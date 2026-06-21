'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/i18n'
import styles from './TrackingSection.module.css'

export default function TrackingSection() {
  const { t } = useLanguage()
  const [code, setCode]     = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [error, setError]   = useState(false)

  const STATUSES = [
    'Order registered at warehouse',
    'Package is being prepared for shipment',
    'Package is on its way to Armenia',
    'Package has arrived in Yerevan',
    'Package is ready for pickup',
  ]

  function track() {
    const trimmed = code.trim()
    if (!trimmed) {
      setError(true)
      setResult(null)
      return
    }
    setError(false)
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)]
    setResult(`${trimmed}: ${status}`)
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') track()
  }

  return (
    <section className={styles.section} id="track">
      <div className={styles.card}>
        {/* Left */}
        <div className={styles.left}>
          <p className={styles.eyebrow}>{t('track_label')}</p>
          <h2 className={styles.title}>{t('track_title')}</h2>
          <p className={styles.desc}>{t('track_desc')}</p>
        </div>

        {/* Right — form */}
        <div className={styles.formWrap}>
          <div className={styles.inputRow}>
            <input
              className={styles.input}
              type="text"
              placeholder={t('track_placeholder')}
              value={code}
              onChange={e => { setCode(e.target.value); setError(false) }}
              onKeyDown={handleKey}
            />
            <button className={styles.btn} onClick={track}>
              {t('track_btn')}
            </button>
          </div>

          {error && (
            <p className={styles.errorMsg}>{t('track_error')}</p>
          )}

          {result && (
            <div className={styles.result}>
              <span className={styles.resultDot} />
              {result}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
