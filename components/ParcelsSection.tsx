'use client'

import { useState, useEffect, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import { fetchParcels, type Parcel, type ParcelStatus } from '@/lib/parcels'
import { useLanguage } from '@/lib/i18n'
import AddParcelModal from './AddParcelModal'
import ParcelList from './ParcelList'
import styles from './ParcelsSection.module.css'

export default function ParcelsSection({ user, onParcelsChange }: { user: User; onParcelsChange?: (p: Parcel[]) => void }) {
  const { t } = useLanguage()
  const [parcels,    setParcels]    = useState<Parcel[]>([])
  const [loading,    setLoading]    = useState(true)
  const [modalOpen,  setModalOpen]  = useState(false)

  const load = useCallback(async () => {
    try {
      const data = await fetchParcels(user.id)
      setParcels(data)
      onParcelsChange?.(data)
    } catch { /* silently fail */ }
    finally { setLoading(false) }
  }, [user.id])

  useEffect(() => { load() }, [load])

  function handleSaved(p: Parcel) {
    const updated = [p, ...parcels]
    setParcels(updated)
    onParcelsChange?.(updated)
    setModalOpen(false)
  }

  function handleDelete(id: string) {
    const updated = parcels.filter(p => p.id !== id)
    setParcels(updated)
    onParcelsChange?.(updated)
  }

  function handleStatus(id: string, status: ParcelStatus) {
    setParcels(prev => prev.map(p => p.id === id ? { ...p, status } : p))
  }

  // Stats
  const total     = parcels.length
  const inTransit = parcels.filter(p => p.status === 'in_transit').length
  const customs   = parcels.filter(p => p.status === 'customs').length
  const delivered = parcels.filter(p => p.status === 'delivered').length

  return (
    <div className={styles.section}>
      {/* Section header */}
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{t('parcels_eyebrow')}</p>
          <h2 className={styles.title}>{t('parcels_title')}</h2>
        </div>
        <button className={styles.addBtn} onClick={() => setModalOpen(true)}>
          {t('parcels_add')}
        </button>
      </div>

      {/* Stats row */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statNum}>{total}</span>
          <span className={styles.statLabel}>{t('parcels_total')}</span>
        </div>
        <div className={styles.statDiv} />
        <div className={styles.stat}>
          <span className={styles.statNum} style={{ color: '#00D4FF' }}>{inTransit}</span>
          <span className={styles.statLabel}>{t('parcels_in_transit')}</span>
        </div>
        <div className={styles.statDiv} />
        <div className={styles.stat}>
          <span className={styles.statNum} style={{ color: '#fbbf24' }}>{customs}</span>
          <span className={styles.statLabel}>{t('parcels_in_customs')}</span>
        </div>
        <div className={styles.statDiv} />
        <div className={styles.stat}>
          <span className={styles.statNum} style={{ color: '#4ade80' }}>{delivered}</span>
          <span className={styles.statLabel}>{t('parcels_delivered')}</span>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className={styles.loadingRow}>
          {[1,2,3].map(i => <div key={i} className={styles.skeleton} />)}
        </div>
      ) : (
        <ParcelList
          parcels={parcels}
          onDelete={handleDelete}
          onStatus={handleStatus}
        />
      )}

      {/* Modal */}
      {modalOpen && (
        <AddParcelModal
          userId={user.id}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
