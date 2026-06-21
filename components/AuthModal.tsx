'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/i18n'
import PasswordStrength from '@/components/PasswordStrength'
import styles from './AuthModal.module.css'

export default function AuthModal() {
  const { modalOpen, modalMode, closeModal, openModal } = useAuth()
  const { t } = useLanguage()

  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')
  const [busy,     setBusy]     = useState(false)

  const emailRef = useRef<HTMLInputElement>(null)

  // Reset fields when modal opens / mode changes
  useEffect(() => {
    if (modalOpen) {
      setName(''); setEmail(''); setPassword('')
      setError(''); setSuccess('')
      setTimeout(() => emailRef.current?.focus(), 80)
    }
  }, [modalOpen, modalMode])

  // Close on Escape
  useEffect(() => {
    if (!modalOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [modalOpen, closeModal])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setSuccess(''); setBusy(true)

    try {
      if (modalMode === 'register') {
        if (!name.trim()) { setError('Please enter your name.'); setBusy(false); return }

        const { error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name.trim() } },
        })

        if (signUpErr) throw signUpErr

        setSuccess(t('auth_success_register'))
        setName(''); setEmail(''); setPassword('')
      } else {
        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password })
        if (signInErr) throw signInErr
        closeModal()
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  if (!modalOpen) return null

  return (
    <div className={styles.backdrop} onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">

        {/* Close */}
        <button className={styles.closeBtn} onClick={closeModal} aria-label="Close">✕</button>

        {/* Header */}
        <p className={styles.eyebrow}>{t('auth_welcome')}</p>
        <h2 className={styles.title} id="modal-title">
          {modalMode === 'login' ? t('auth_sign_in_title') : t('auth_register_title')}
        </h2>

        {/* Tab switcher */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${modalMode === 'login' ? styles.tabActive : ''}`}
            onClick={() => openModal('login')}
            type="button"
          >
            {t('auth_tab_login')}
          </button>
          <button
            className={`${styles.tab} ${modalMode === 'register' ? styles.tabActive : ''}`}
            onClick={() => openModal('register')}
            type="button"
          >
            {t('auth_tab_register')}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {modalMode === 'register' && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="auth-name">{t('auth_name_label')}</label>
              <input
                id="auth-name"
                className={styles.input}
                type="text"
                placeholder={t('auth_name_placeholder')}
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="auth-email">{t('auth_email_label')}</label>
            <input
              id="auth-email"
              className={styles.input}
              type="email"
              placeholder={t('auth_email_placeholder')}
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              ref={emailRef}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="auth-password">{t('auth_password_label')}</label>
            <input
              id="auth-password"
              className={styles.input}
              type="password"
              placeholder={modalMode === 'register' ? t('auth_pw_placeholder_reg') : t('auth_pw_placeholder_login')}
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete={modalMode === 'register' ? 'new-password' : 'current-password'}
              required
            />
            {modalMode === 'register' && <PasswordStrength password={password} />}
          </div>

          {error   && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.successMsg}>{success}</p>}

          <button className={styles.submitBtn} type="submit" disabled={busy}>
            {busy
              ? t('auth_busy')
              : modalMode === 'login' ? t('auth_submit_login') : t('auth_submit_register')}
          </button>
        </form>

        {/* Footer link */}
        <p className={styles.switchText}>
          {modalMode === 'login' ? t('auth_switch_to_register') : t('auth_switch_to_login')}
          <button
            className={styles.switchLink}
            type="button"
            onClick={() => openModal(modalMode === 'login' ? 'register' : 'login')}
          >
            {modalMode === 'login' ? t('auth_switch_register_link') : t('auth_switch_login_link')}
          </button>
        </p>
      </div>
    </div>
  )
}
