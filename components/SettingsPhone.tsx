'use client'

import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import s from './SettingsCard.module.css'

const PREFIXES = [
  { label: '🇦🇲 +374', value: '+374' },
  { label: '🇺🇸 +1',   value: '+1'   },
  { label: '🇷🇺 +7',   value: '+7'   },
  { label: '🇩🇪 +49',  value: '+49'  },
  { label: '🇬🇧 +44',  value: '+44'  },
  { label: '🇦🇪 +971', value: '+971' },
  { label: '🇨🇳 +86',  value: '+86'  },
  { label: '🇮🇹 +39',  value: '+39'  },
  { label: '🇫🇷 +33',  value: '+33'  },
]

type Step = 'input' | 'verify' | 'done'

export default function SettingsPhone({ user }: { user: User }) {
  const savedPhone  = (user.user_metadata?.phone as string) || ''
  const savedPrefix = (user.user_metadata?.phone_prefix as string) || '+374'
  const isVerified  = (user.user_metadata?.phone_verified as boolean) || false

  const [prefix,  setPrefix]  = useState(savedPrefix)
  const [phone,   setPhone]   = useState(savedPhone.replace(savedPrefix, '').trim())
  const [otp,     setOtp]     = useState('')
  const [step,    setStep]    = useState<Step>(isVerified ? 'done' : 'input')
  const [busy,    setBusy]    = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')

  const fullPhone = `${prefix}${phone.replace(/\D/g, '')}`

  async function sendOtp() {
    setError(''); setSuccess('')
    if (!phone.trim()) { setError('Please enter your phone number.'); return }

    setBusy(true)
    try {
      // Save the phone number to user metadata
      const { error: metaErr } = await supabase.auth.updateUser({
        data: { phone: fullPhone, phone_prefix: prefix, phone_verified: false },
      })
      if (metaErr) throw metaErr

      // Send OTP via Supabase phone auth
      const { error: otpErr } = await supabase.auth.signInWithOtp({ phone: fullPhone })
      if (otpErr) throw otpErr

      setSuccess(`Verification code sent to ${fullPhone}`)
      setStep('verify')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send code.')
    } finally {
      setBusy(false)
    }
  }

  async function verifyOtp() {
    setError(''); setSuccess('')
    if (!otp.trim()) { setError('Please enter the verification code.'); return }

    setBusy(true)
    try {
      const { error: verifyErr } = await supabase.auth.verifyOtp({
        phone: fullPhone,
        token: otp,
        type: 'sms',
      })
      if (verifyErr) throw verifyErr

      // Mark as verified in metadata
      await supabase.auth.updateUser({
        data: { phone: fullPhone, phone_prefix: prefix, phone_verified: true },
      })

      setSuccess('Phone number verified successfully!')
      setStep('done')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid code. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  function handleEdit() {
    setStep('input')
    setOtp('')
    setError('')
    setSuccess('')
  }

  const badge =
    step === 'done'
      ? <span className={`${s.statusBadge} ${s.done}`}>✓ Verified</span>
      : step === 'verify'
      ? <span className={`${s.statusBadge} ${s.pending}`}>⏳ Pending</span>
      : <span className={`${s.statusBadge} ${s.none}`}>Not added</span>

  return (
    <div className={s.card}>
      <div className={s.cardHead}>
        <div className={s.cardIcon}>📱</div>
        <div className={s.cardTitles}>
          <p className={s.cardTitle}>Phone Number</p>
          <p className={s.cardDesc}>Add and verify your phone number for account security and delivery updates.</p>
        </div>
        {badge}
      </div>

      <div className={s.cardBody}>
        {error   && <p className={s.error}>{error}</p>}
        {success && <p className={s.success}>{success}</p>}

        {step === 'done' ? (
          /* Verified state */
          <div>
            <div className={s.field}>
              <label className={s.label}>Verified phone</label>
              <input className={s.input} value={fullPhone} disabled />
            </div>
            <div className={s.btnRow}>
              <button className={s.secondaryBtn} onClick={handleEdit}>Change number</button>
            </div>
          </div>
        ) : step === 'verify' ? (
          /* OTP entry */
          <div>
            <div className={s.field}>
              <label className={s.label} htmlFor="otp-code">Verification code</label>
              <input
                id="otp-code"
                className={s.input}
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="6-digit code"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                autoComplete="one-time-code"
              />
              <p className={s.hint}>Code sent to {fullPhone}. Check your SMS.</p>
            </div>
            <div className={s.btnRow}>
              <button className={s.saveBtn} onClick={verifyOtp} disabled={busy}>
                {busy ? 'Verifying…' : 'Verify code'}
              </button>
              <button className={s.secondaryBtn} onClick={handleEdit}>Change number</button>
              <button className={s.secondaryBtn} onClick={sendOtp} disabled={busy}>Resend</button>
            </div>
          </div>
        ) : (
          /* Phone input */
          <div>
            <div className={s.field}>
              <label className={s.label} htmlFor="phone-num">Phone number</label>
              <div className={s.phoneRow}>
                <select
                  className={s.select}
                  value={prefix}
                  onChange={e => setPrefix(e.target.value)}
                >
                  {PREFIXES.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <input
                  id="phone-num"
                  className={s.input}
                  type="tel"
                  placeholder="093 123 456"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>
              <p className={s.hint}>We'll send a one-time SMS code to verify this number.</p>
            </div>
            <div className={s.btnRow}>
              <button className={s.saveBtn} onClick={sendOtp} disabled={busy}>
                {busy ? 'Sending…' : 'Send verification code'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
