'use client'

import { useState } from 'react'
import {
  type Parcel, type ParcelStatus,
  PARCEL_COUNTRIES, STATUS_CONFIG, CURRENCIES,
  deleteParcel, updateParcelStatus,
} from '@/lib/parcels'
import { useLanguage } from '@/lib/i18n'
import styles from './ParcelList.module.css'

interface Props {
  parcels:    Parcel[]
  onDelete:   (id: string) => void
  onStatus:   (id: string, status: ParcelStatus) => void
}

export default function ParcelList({ parcels, onDelete, onStatus }: Props) {
  const { t } = useLanguage()
  const [deleting,   setDeleting]   = useState<string | null>(null)
  const [expanding,  setExpanding]  = useState<string | null>(null)

  async function handleDelete(id: string) {
    setDeleting(id)
    try { await deleteParcel(id); onDelete(id) }
    catch { /* silently fail */ }
    finally { setDeleting(null) }
  }

  async function handleStatus(id: string, status: ParcelStatus) {
    try { await updateParcelStatus(id, status); onStatus(id, status) }
    catch { /* silently fail */ }
  }

  if (parcels.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📭</div>
        <p className={styles.emptyTitle}>{t('parcels_empty_title')}</p>
        <p className={styles.emptyDesc}>{t('parcels_empty_desc')}</p>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {parcels.map(parcel => {
        const cfg     = STATUS_CONFIG[parcel.status as ParcelStatus]
        const country = PARCEL_COUNTRIES.find(c => c.key === parcel.country)
        const currency = CURRENCIES.find(c => c.code === parcel.currency)
        const isOpen  = expanding === parcel.id

        return (
          <div key={parcel.id} className={styles.card}>

            {/* Main row */}
            <div
              className={styles.cardMain}
              onClick={() => setExpanding(isOpen ? null : parcel.id)}
            >
              {/* Left */}
              <div className={styles.cardLeft}>
                <div className={styles.shopBadge}>
                  {parcel.shop.slice(0, 2).toUpperCase()}
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.cardTopRow}>
                    <span className={styles.shopName}>{parcel.shop}</span>
                    <span className={styles.countryPill}>
                      {country?.flag} {country?.label || parcel.country}
                    </span>
                  </div>
                  <div className={styles.cardMeta}>
                    <span className={styles.metaItem}>
                      {parcel.ship_method === 'air' ? '✈️' : parcel.ship_method === 'standard' ? '📦' : '🚚'}
                      {parcel.ship_method.charAt(0).toUpperCase() + parcel.ship_method.slice(1)}
                    </span>
                    {parcel.tracking && (
                      <span className={styles.metaItem}>🔍 {parcel.tracking}</span>
                    )}
                    {parcel.price != null && (
                      <span className={styles.metaItem}>
                        {currency?.symbol}{parcel.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {parcel.currency}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className={styles.cardRight}>
                <span
                  className={styles.statusBadge}
                  style={{ color: cfg.color, background: cfg.bg }}
                >
                  {cfg.icon} {cfg.label}
                </span>
                <span className={styles.chevron} style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                  ›
                </span>
              </div>
            </div>

            {/* Expanded panel */}
            {isOpen && (
              <div className={styles.expanded}>
                <div className={styles.expandedDivider} />

                {/* Details grid */}
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>{t('parcels_detail_from')}</span>
                    <span className={styles.detailVal}>{country?.flag} {country?.label}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>{t('parcels_detail_shop')}</span>
                    <span className={styles.detailVal}>{parcel.shop}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>{t('parcels_detail_method')}</span>
                    <span className={styles.detailVal} style={{ textTransform: 'capitalize' }}>{parcel.ship_method}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>{t('parcels_detail_tracking')}</span>
                    <span className={styles.detailVal}>{parcel.tracking || '—'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>{t('parcels_detail_value')}</span>
                    <span className={styles.detailVal}>
                      {parcel.price != null
                        ? `${currency?.symbol}${parcel.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${parcel.currency}`
                        : '—'}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>{t('parcels_detail_added')}</span>
                    <span className={styles.detailVal}>
                      {new Date(parcel.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  {parcel.description && (
                    <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
                      <span className={styles.detailLabel}>{t('parcels_detail_description')}</span>
                      <span className={styles.detailVal}>{parcel.description}</span>
                    </div>
                  )}
                </div>

                {/* Status updater */}
                <div className={styles.statusRow}>
                  <span className={styles.detailLabel} style={{ alignSelf: 'center' }}>{t('parcels_update_status')}</span>
                  <div className={styles.statusBtns}>
                    {(Object.keys(STATUS_CONFIG) as ParcelStatus[]).map(s => {
                      const c = STATUS_CONFIG[s]
                      return (
                        <button
                          key={s}
                          className={`${styles.statusBtn} ${parcel.status === s ? styles.statusBtnActive : ''}`}
                          style={parcel.status === s ? { color: c.color, borderColor: c.color, background: c.bg } : {}}
                          onClick={() => handleStatus(parcel.id, s)}
                        >
                          {c.icon} {c.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Delete */}
                <div className={styles.deleteRow}>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(parcel.id)}
                    disabled={deleting === parcel.id}
                  >
                    {deleting === parcel.id ? t('parcels_removing') : t('parcels_remove')}
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
