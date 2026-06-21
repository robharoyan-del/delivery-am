'use client'

import { useState, useRef } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import s from './SettingsCard.module.css'

type KycStatus = 'none' | 'pending' | 'approved' | 'rejected'

interface UploadState {
  file:     File | null
  preview:  string | null
  uploaded: boolean
}

const EMPTY_UPLOAD: UploadState = { file: null, preview: null, uploaded: false }

export default function SettingsIdentity({ user }: { user: User }) {
  const kycStatus  = (user.user_metadata?.kyc_status  as KycStatus) || 'none'
  const kycStep    = (user.user_metadata?.kyc_step    as number)    || 0

  const [step,       setStep]       = useState<number>(kycStep)
  const [docType,    setDocType]    = useState<string>('passport')
  const [front,      setFront]      = useState<UploadState>(EMPTY_UPLOAD)
  const [back,       setBack]       = useState<UploadState>(EMPTY_UPLOAD)
  const [selfie,     setSelfie]     = useState<UploadState>(EMPTY_UPLOAD)
  const [busy,       setBusy]       = useState(false)
  const [error,      setError]      = useState('')
  const [submitted,  setSubmitted]  = useState(kycStatus === 'pending' || kycStatus === 'approved')

  const frontRef  = useRef<HTMLInputElement>(null)
  const backRef   = useRef<HTMLInputElement>(null)
  const selfieRef = useRef<HTMLInputElement>(null)

  function handleFile(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (u: UploadState) => void
  ) {
    const file = e.target.files?.[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    setter({ file, preview, uploaded: false })
  }

  async function uploadFile(uploadState: UploadState, path: string): Promise<string> {
    if (!uploadState.file) throw new Error('No file')
    const ext  = uploadState.file.name.split('.').pop()
    const name = `${path}-${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('kyc-documents')
      .upload(`${user.id}/${name}`, uploadState.file, { upsert: true })
    if (error) throw error
    return name
  }

  async function handleSubmit() {
    setError('')
    if (!front.file) { setError('Please upload the front of your document.'); return }
    if (docType !== 'passport' && !back.file) { setError('Please upload the back of your document.'); return }
    if (!selfie.file) { setError('Please upload your selfie.'); return }

    setBusy(true)
    try {
      const frontName  = await uploadFile(front,  'front')
      const backName   = docType !== 'passport' ? await uploadFile(back, 'back') : null
      const selfieName = await uploadFile(selfie, 'selfie')

      await supabase.auth.updateUser({
        data: {
          kyc_status:   'pending',
          kyc_step:     3,
          kyc_doc_type: docType,
          kyc_front:    frontName,
          kyc_back:     backName,
          kyc_selfie:   selfieName,
          kyc_submitted_at: new Date().toISOString(),
        },
      })

      setSubmitted(true)
      setStep(3)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  // ── Status badge ───────────────────────────────────────────────────────────
  const badge = submitted
    ? kycStatus === 'approved'
      ? <span className={`${s.statusBadge} ${s.done}`}>✓ Verified</span>
      : kycStatus === 'rejected'
      ? <span className={`${s.statusBadge} ${s.none}`}>✗ Rejected</span>
      : <span className={`${s.statusBadge} ${s.pending}`}>⏳ Under review</span>
    : <span className={`${s.statusBadge} ${s.none}`}>Not verified</span>

  // ── Upload box ─────────────────────────────────────────────────────────────
  function UploadBox({
    label, state, inputRef, onChange, accept = 'image/*,.pdf'
  }: {
    label:    string
    state:    UploadState
    inputRef: React.RefObject<HTMLInputElement | null>
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    accept?:  string
  }) {
    return (
      <div>
        <p className={s.label}>{label}</p>
        <div
          className={`${s.uploadArea} ${state.file ? s.hasFile : ''}`}
          onClick={() => inputRef.current?.click()}
        >
          {state.file ? (
            <>
              <div className={s.uploadIcon}>✅</div>
              <p className={s.uploadText}><strong>{state.file.name}</strong><br />Click to replace</p>
            </>
          ) : (
            <>
              <div className={s.uploadIcon}>📄</div>
              <p className={s.uploadText}>Click to upload<br /><strong>JPG, PNG or PDF</strong> · max 10MB</p>
            </>
          )}
          <input ref={inputRef} type="file" accept={accept} onChange={onChange} className={s.fileInput} />
        </div>
      </div>
    )
  }

  return (
    <div className={s.card}>
      <div className={s.cardHead}>
        <div className={s.cardIcon}>🪪</div>
        <div className={s.cardTitles}>
          <p className={s.cardTitle}>Identity Verification</p>
          <p className={s.cardDesc}>
            Verify your identity to unlock higher shipping limits and customs clearance.
          </p>
        </div>
        {badge}
      </div>

      <div className={s.cardBody}>
        {error && <p className={s.error}>{error}</p>}

        {/* Steps overview */}
        <div className={s.steps}>
          <div className={s.step}>
            <div className={`${s.stepNum} ${step >= 1 ? s.done : step === 0 ? s.active : ''}`}>
              {step >= 1 ? '✓' : '1'}
            </div>
            <div className={s.stepContent}>
              <p className={s.stepTitle}>Choose document type</p>
              <p className={s.stepDesc}>Passport, national ID card, or driver's license.</p>
            </div>
          </div>
          <div className={s.step}>
            <div className={`${s.stepNum} ${step >= 2 ? s.done : step === 1 ? s.active : ''}`}>
              {step >= 2 ? '✓' : '2'}
            </div>
            <div className={s.stepContent}>
              <p className={s.stepTitle}>Upload document photos</p>
              <p className={s.stepDesc}>Clear photos of front {docType !== 'passport' ? 'and back ' : ''}of your document.</p>
            </div>
          </div>
          <div className={s.step}>
            <div className={`${s.stepNum} ${step >= 3 ? s.done : step === 2 ? s.active : ''}`}>
              {step >= 3 ? '✓' : '3'}
            </div>
            <div className={s.stepContent}>
              <p className={s.stepTitle}>Selfie with document</p>
              <p className={s.stepDesc}>A photo of you holding your document next to your face.</p>
            </div>
          </div>
        </div>

        {submitted ? (
          /* Submitted state */
          <div style={{ marginTop: 20 }}>
            {kycStatus === 'approved' ? (
              <p className={s.success}>✓ Your identity has been verified. You have full access to all services.</p>
            ) : kycStatus === 'rejected' ? (
              <div>
                <p className={s.error}>Your verification was rejected. Please resubmit with clearer photos.</p>
                <div className={s.btnRow}>
                  <button className={s.saveBtn} onClick={() => { setSubmitted(false); setStep(0); setFront(EMPTY_UPLOAD); setBack(EMPTY_UPLOAD); setSelfie(EMPTY_UPLOAD) }}>
                    Resubmit
                  </button>
                </div>
              </div>
            ) : (
              <p className={s.success} style={{ color: '#fbbf24', background: 'rgba(251,191,36,0.08)', borderColor: 'rgba(251,191,36,0.2)' }}>
                ⏳ Your documents are under review. This usually takes 1–2 business days.
              </p>
            )}
          </div>
        ) : (
          /* Verification form */
          <div style={{ marginTop: 24 }}>
            <div className={s.divider} />

            {/* Step 1 — doc type */}
            <div className={s.field}>
              <label className={s.label} htmlFor="doc-type">Document type</label>
              <select
                id="doc-type"
                className={s.select}
                style={{ width: '100%' }}
                value={docType}
                onChange={e => { setDocType(e.target.value); setStep(1) }}
              >
                <option value="passport">Passport</option>
                <option value="national_id">National ID Card</option>
                <option value="drivers_license">Driver's License</option>
              </select>
            </div>

            <div className={s.divider} />

            {/* Step 2 — document photos */}
            <UploadBox
              label={`Front of ${docType === 'passport' ? 'passport' : 'document'}`}
              state={front}
              inputRef={frontRef}
              onChange={e => { handleFile(e, setFront); setStep(Math.max(step, 2)) }}
            />

            {docType !== 'passport' && (
              <div style={{ marginTop: 14 }}>
                <UploadBox
                  label="Back of document"
                  state={back}
                  inputRef={backRef}
                  onChange={e => { handleFile(e, setBack); setStep(Math.max(step, 2)) }}
                />
              </div>
            )}

            <div className={s.divider} />

            {/* Step 3 — selfie */}
            <UploadBox
              label="Selfie holding your document"
              state={selfie}
              inputRef={selfieRef}
              onChange={e => { handleFile(e, setSelfie); setStep(3) }}
              accept="image/*"
            />

            <p className={s.hint} style={{ marginTop: 8 }}>
              Make sure your face and the document text are clearly visible. No filters.
            </p>

            <div className={s.btnRow}>
              <button className={s.saveBtn} onClick={handleSubmit} disabled={busy}>
                {busy ? 'Uploading…' : 'Submit for verification'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
