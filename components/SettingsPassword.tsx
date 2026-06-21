'use client'

import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import PasswordStrength from '@/components/PasswordStrength'
import s from './SettingsCard.module.css'

export default function SettingsPassword({ user }: { user: User }) {
  const [current,  setCurrent]  = useState('')
  const [next,     setNext]     = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [busy,     setBusy]     = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')

  async function handleSave() {
    setError(''); setSuccess('')

    if (!current) { setError('Please enter your current password.'); return }
    if (next.length < 6) { setError('New password must be at least 6 characters.'); return }
    if (next !== confirm) { setError('New passwords do not match.'); return }
    if (next === current) { setError('New password must be different from current.'); return }

    setBusy(true)
    try {
      // Re-authenticate first so the update is secure
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: current,
      })
      if (signInErr) { setError('Current password is incorrect.'); return }

      const { error: updateErr } = await supabase.auth.updateUser({ password: next })
      if (updateErr) throw updateErr

      setSuccess('Password updated successfully.')
      setCurrent(''); setNext(''); setConfirm('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={s.card}>
      <div className={s.cardHead}>
        <div className={s.cardIcon}>🔐</div>
        <div className={s.cardTitles}>
          <p className={s.cardTitle}>Password</p>
          <p className={s.cardDesc}>Change your account password. You'll need your current password.</p>
        </div>
      </div>

      <div className={s.cardBody}>
        {error   && <p className={s.error}>{error}</p>}
        {success && <p className={s.success}>{success}</p>}

        <div className={s.field}>
          <label className={s.label} htmlFor="pw-current">Current password</label>
          <input
            id="pw-current"
            className={s.input}
            type="password"
            placeholder="Enter current password"
            value={current}
            onChange={e => setCurrent(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <div className={s.divider} />

        <div className={s.inputRow}>
          <div className={s.field}>
            <label className={s.label} htmlFor="pw-new">New password</label>
            <input
              id="pw-new"
              className={s.input}
              type="password"
              placeholder="At least 6 characters"
              value={next}
              onChange={e => setNext(e.target.value)}
              autoComplete="new-password"
            />
            <PasswordStrength password={next} />
          </div>
          <div className={s.field}>
            <label className={s.label} htmlFor="pw-confirm">Confirm new password</label>
            <input
              id="pw-confirm"
              className={s.input}
              type="password"
              placeholder="Repeat new password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </div>
        </div>

        <div className={s.btnRow}>
          <button className={s.saveBtn} onClick={handleSave} disabled={busy}>
            {busy ? 'Saving…' : 'Update password'}
          </button>
        </div>
      </div>
    </div>
  )
}
