'use client'

import { useState, useEffect } from 'react'
import {
  TX_CURRENCIES, TX_TYPE_CONFIG,
  addTransaction, type Transaction, type TxType, type TxStatus,
} from '@/lib/transactions'
import type { Parcel } from '@/lib/parcels'
import { useLanguage } from '@/lib/i18n'
import CustomSelect from './CustomSelect'
import styles from './AddTransactionModal.module.css'

interface Props {
  userId:  string
  parcels: Parcel[]
  onClose: () => void
  onSaved: (t: Transaction) => void
}

const CURRENCY_OPTIONS = TX_CURRENCIES.map(c => ({
  value: c.code,
  label: `${c.symbol} ${c.code}`,
  desc:  c.label.split('—')[1]?.trim(),
}))

export default function AddTransactionModal({ userId, parcels, onClose, onSaved }: Props) {
  const { t } = useLanguage()

  const TYPES: { key: TxType; label: string; icon: string; desc: string }[] = [
    { key: 'payment', icon: '💳', label: t('add_tx_type_payment_label'), desc: t('add_tx_type_payment_desc') },
    { key: 'charge',  icon: '📦', label: t('add_tx_type_charge_label'),  desc: t('add_tx_type_charge_desc')  },
    { key: 'topup',   icon: '⬆️', label: t('add_tx_type_topup_label'),   desc: t('add_tx_type_topup_desc')   },
    { key: 'refund',  icon: '↩️', label: t('add_tx_type_refund_label'),  desc: t('add_tx_type_refund_desc')  },
  ]

  const STATUSES: { key: TxStatus; label: string }[] = [
    { key: 'completed', label: t('add_tx_status_completed') },
    { key: 'pending',   label: t('add_tx_status_pending')   },
    { key: 'failed',    label: t('add_tx_status_failed')     },
  ]

  const [type,        setType]        = useState<TxType>('payment')
  const [amount,      setAmount]      = useState('')
  const [currency,    setCurrency]    = useState('AMD')
  const [status,      setStatus]      = useState<TxStatus>('completed')
  const [description, setDescription] = useState('')
  const [reference,   setReference]   = useState('')
  const [parcelId,    setParcelId]    = useState('')
  const [busy,        setBusy]        = useState(false)
  const [error,       setError]       = useState('')

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  async function handleSubmit() {
    setError('')
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError(t('add_tx_err_amount'))
      return
    }
    setBusy(true)
    try {
      const saved = await addTransaction(userId, {
        type,
        amount:      parseFloat(amount),
        currency,
        status,
        description: description.trim() || null,
        reference:   reference.trim()   || null,
        parcel_id:   parcelId           || null,
      })
      onSaved(saved)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('add_tx_err_save'))
    } finally {
      setBusy(false)
    }
  }

  const cfg = TX_TYPE_CONFIG[type]

  const parcelOptions = [
    { value: '', label: t('add_tx_parcel_none') },
    ...parcels.map(p => ({
      value: p.id,
      label: `${p.shop} · ${p.country.toUpperCase()}`,
      desc:  p.tracking ? `#${p.tracking}` : undefined,
    })),
  ]

  return (
    <div className={styles.backdrop} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={styles.modal} role="dialog" aria-modal="true">

        {/* Header */}
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>{t('add_tx_eyebrow')}</p>
            <h2 className={styles.title}>{t('add_tx_title')}</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>
          {error && <p className={styles.error}>{error}</p>}

          {/* Type */}
          <div className={styles.field}>
            <label className={styles.label}>{t('add_tx_type_label')}</label>
            <div className={styles.typeGrid}>
              {TYPES.map(t => (
                <button
                  key={t.key}
                  type="button"
                  className={`${styles.typeBtn} ${type === t.key ? styles.typeBtnActive : ''}`}
                  style={type === t.key ? {
                    borderColor: TX_TYPE_CONFIG[t.key].color,
                    background:  TX_TYPE_CONFIG[t.key].bg,
                  } : {}}
                  onClick={() => setType(t.key)}
                >
                  <span className={styles.typeIcon}>{t.icon}</span>
                  <span className={styles.typeLabel}>{t.label}</span>
                  <span className={styles.typeDesc}>{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount + Currency */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="tx-amount">{t('add_tx_amount_label')}</label>
            <div className={styles.amountRow}>
              <div className={styles.amountSign} style={{ color: cfg.color }}>{cfg.sign}</div>
              <input
                id="tx-amount"
                className={styles.amountInput}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={e => { setAmount(e.target.value); setError('') }}
                autoFocus
              />
              <div style={{ width: 140, flexShrink: 0 }}>
                <CustomSelect
                  options={CURRENCY_OPTIONS}
                  value={currency}
                  onChange={setCurrency}
                  compact
                />
              </div>
            </div>
          </div>

          <div className={styles.row}>
            {/* Status */}
            <div className={styles.field}>
              <label className={styles.label}>{t('add_tx_status_label')}</label>
              <div className={styles.statusGroup}>
                {STATUSES.map(s => (
                  <button
                    key={s.key}
                    type="button"
                    className={`${styles.statusBtn} ${status === s.key ? styles.statusBtnActive : ''}`}
                    onClick={() => setStatus(s.key)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Linked parcel */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="tx-parcel">
                {t('add_tx_parcel_label')} <span className={styles.optional}>{t('add_tx_optional')}</span>
              </label>
              <CustomSelect
                id="tx-parcel"
                options={parcelOptions}
                value={parcelId}
                onChange={setParcelId}
                placeholder={t('add_tx_parcel_none')}
              />
            </div>
          </div>

          {/* Reference */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="tx-ref">
              {t('add_tx_ref_label')} <span className={styles.optional}>{t('add_tx_optional')}</span>
            </label>
            <input
              id="tx-ref"
              className={styles.input}
              type="text"
              placeholder="e.g. INV-2024-001"
              value={reference}
              onChange={e => setReference(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="tx-desc">
              {t('add_tx_desc_label')} <span className={styles.optional}>{t('add_tx_optional')}</span>
            </label>
            <textarea
              id="tx-desc"
              className={styles.textarea}
              placeholder="e.g. Shipping fee for Nike sneakers from USA"
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose} disabled={busy}>{t('add_tx_cancel')}</button>
          <button className={styles.saveBtn} onClick={handleSubmit} disabled={busy}>
            {busy ? t('add_tx_saving') : t('add_tx_save')}
          </button>
        </div>

      </div>
    </div>
  )
}
