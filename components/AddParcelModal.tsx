'use client'

import { useState, useEffect } from 'react'
import {
  PARCEL_COUNTRIES, PARCEL_SHOPS, SHIP_METHODS, CURRENCIES,
  addParcel, type Parcel,
} from '@/lib/parcels'
import { useLanguage } from '@/lib/i18n'
import CustomSelect from './CustomSelect'
import styles from './AddParcelModal.module.css'

interface Props {
  userId:   string
  onClose:  () => void
  onSaved:  (p: Parcel) => void
}

const EMPTY = {
  country:     'usa',
  shop:        '',
  customShop:  '',
  shipMethod:  '',
  tracking:    '',
  price:       '',
  currency:    'USD',
  description: '',
}

// Build option lists for CustomSelect
const SHOP_OPTIONS = PARCEL_SHOPS.map(s => ({ value: s, label: s }))

const CURRENCY_OPTIONS = CURRENCIES.map(c => ({
  value: c.code,
  label: `${c.symbol} ${c.code}`,
  desc:  c.label.split('—')[1]?.trim(),
}))

export default function AddParcelModal({ userId, onClose, onSaved }: Props) {
  const { t } = useLanguage()
  const [form,  setForm]  = useState(EMPTY)
  const [busy,  setBusy]  = useState(false)
  const [error, setError] = useState('')

  // Reset ship method when country changes
  useEffect(() => {
    const methods = SHIP_METHODS[form.country] || []
    setForm(f => ({ ...f, shipMethod: methods[0]?.key || '' }))
  }, [form.country])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  function set(key: keyof typeof EMPTY, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    setError('')
  }

  async function handleSubmit() {
    setError('')
    const shopName = form.shop === 'Other' ? form.customShop.trim() : form.shop
    if (!form.country)    { setError(t('add_parcel_err_country')); return }
    if (!shopName)        { setError(t('add_parcel_err_shop'));    return }
    if (!form.shipMethod) { setError(t('add_parcel_err_method')); return }

    setBusy(true)
    try {
      const saved = await addParcel(userId, {
        country:     form.country,
        shop:        shopName,
        ship_method: form.shipMethod,
        tracking:    form.tracking.trim()    || null,
        price:       form.price ? parseFloat(form.price) : null,
        currency:    form.currency,
        description: form.description.trim() || null,
      })
      onSaved(saved)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('add_parcel_err_save'))
    } finally {
      setBusy(false)
    }
  }

  const methods = SHIP_METHODS[form.country] || []
  const selectedCountry = PARCEL_COUNTRIES.find(c => c.key === form.country)

  // Country options for CustomSelect with flag images
  const countryOptions = PARCEL_COUNTRIES.map(c => ({
    value:  c.key,
    label:  c.label,
    imgSrc: c.flag,
  }))

  return (
    <div className={styles.backdrop} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="parcel-modal-title">

        {/* Header */}
        <div className={styles.modalHead}>
          <div>
            <p className={styles.eyebrow}>{t('add_parcel_eyebrow')}</p>
            <h2 className={styles.title} id="parcel-modal-title">{t('add_parcel_title')}</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className={styles.body}>
          {error && <p className={styles.error}>{error}</p>}

          {/* ── Country ── */}
          <div className={styles.field}>
            <label className={styles.label}>{t('add_parcel_country_label')}</label>
            <CustomSelect
              options={countryOptions}
              value={form.country}
              onChange={v => set('country', v)}
              placeholder={t('add_parcel_country_placeholder')}
            />
          </div>

          <div className={styles.row}>
            {/* ── Shop ── */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="parcel-shop">{t('add_parcel_shop_label')}</label>
              <CustomSelect
                id="parcel-shop"
                options={SHOP_OPTIONS}
                value={form.shop}
                onChange={v => set('shop', v)}
                placeholder={t('add_parcel_shop_placeholder')}
              />
              {form.shop === 'Other' && (
                <input
                  className={styles.input}
                  style={{ marginTop: 8 }}
                  type="text"
                  placeholder={t('add_parcel_shop_custom')}
                  value={form.customShop}
                  onChange={e => set('customShop', e.target.value)}
                />
              )}
            </div>

            {/* ── Shipping method ── */}
            <div className={styles.field}>
              <label className={styles.label}>{t('add_parcel_method_label')}</label>
              <div className={styles.methodGrid}>
                {methods.map(m => (
                  <button
                    key={m.key}
                    type="button"
                    className={`${styles.methodBtn} ${form.shipMethod === m.key ? styles.methodBtnActive : ''}`}
                    onClick={() => set('shipMethod', m.key)}
                  >
                    <span className={styles.methodLabel}>{m.label}</span>
                    <span className={styles.methodDays}>{m.days}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Tracking ── */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="parcel-tracking">
              {t('add_parcel_tracking_label')}
              <span className={styles.optional}>{t('add_parcel_optional')}</span>
            </label>
            <input
              id="parcel-tracking"
              className={styles.input}
              type="text"
              placeholder={`e.g. 1Z999AA10123456784`}
              value={form.tracking}
              onChange={e => set('tracking', e.target.value)}
            />
            <p className={styles.hint}>{t('add_parcel_tracking_hint')}</p>
          </div>

          {/* ── Price + Currency ── */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="parcel-price">
              {t('add_parcel_value_label')}
              <span className={styles.optional}>{t('add_parcel_value_note')}</span>
            </label>
            <div className={styles.priceRow}>
              <input
                id="parcel-price"
                className={styles.input}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.price}
                onChange={e => set('price', e.target.value)}
                style={{ flex: 1 }}
              />
              <div style={{ width: 140, flexShrink: 0 }}>
                <CustomSelect
                  options={CURRENCY_OPTIONS}
                  value={form.currency}
                  onChange={v => set('currency', v)}
                  compact
                />
              </div>
            </div>
          </div>

          {/* ── Description ── */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="parcel-desc">
              {t('add_parcel_desc_label')}
              <span className={styles.optional}>{t('add_parcel_optional')}</span>
            </label>
            <textarea
              id="parcel-desc"
              className={styles.textarea}
              placeholder="e.g. Blue Nike Air Max sneakers, size 42"
              rows={2}
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose} disabled={busy}>{t('add_parcel_cancel')}</button>
          <button className={styles.saveBtn} onClick={handleSubmit} disabled={busy}>
            {busy ? t('add_parcel_saving') : t('add_parcel_save')}
          </button>
        </div>
      </div>
    </div>
  )
}
