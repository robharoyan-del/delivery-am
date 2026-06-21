'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useLanguage } from '@/lib/i18n'
import { fetchParcels, type Parcel } from '@/lib/parcels'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AddressBook from '@/components/AddressBook'
import ParcelsSection from '@/components/ParcelsSection'
import TransactionsSection from '@/components/TransactionsSection'
import TrackingSection from '@/components/TrackingSection'
import styles from './dashboard.module.css'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const [parcels, setParcels] = useState<Parcel[]>([])

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) window.location.href = '/'
  }, [user, loading])

  // Load parcels once so TransactionsSection can link to them
  const loadParcels = useCallback(async () => {
    if (!user) return
    try {
      const data = await fetchParcels(user.id)
      setParcels(data)
    } catch { /* silent */ }
  }, [user])

  useEffect(() => { loadParcels() }, [loadParcels])

  if (loading || !user) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner} />
      </div>
    )
  }

  const displayName   = user.user_metadata?.full_name || user.email?.split('@')[0] || 'there'
  const kycStatus     = user.user_metadata?.kyc_status  as string | undefined
  const phoneVerified = user.user_metadata?.phone_verified as boolean | undefined
  const kycLabel      = kycStatus === 'approved' ? t('kyc_verified') : kycStatus === 'pending' ? t('kyc_pending') : t('kyc_none')
  const kycClass      = kycStatus === 'approved' ? styles.cardBadgeGreen : kycStatus === 'pending' ? styles.cardBadgeYellow : styles.cardBadgeGray

  return (
    <>
      <Navbar />
      <main className={styles.main}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInner}>
            <div>
              <p className={styles.eyebrow}>{t('dash_eyebrow')}</p>
              <h1 className={styles.title}>{t('dash_title', { name: displayName })}</h1>
              <p className={styles.sub}>{t('dash_sub')}</p>
            </div>
            <div className={styles.headerRight}>
              <div className={styles.headerBadge}>
                <span className={styles.badgeDot} />
                {t('dash_warehouses_active')}
              </div>
              <button className={styles.settingsBtn} onClick={() => window.location.href = '/settings'}>
                {t('dash_settings_btn')}
              </button>
            </div>
          </div>
        </div>

        {/* Quick status cards */}
        <div className={styles.quickCards}>
          <div className={styles.quickCard} onClick={() => window.location.href = '/settings#password'}>
            <div className={styles.quickIcon}>🔐</div>
            <div className={styles.quickInfo}>
              <p className={styles.quickLabel}>{t('dash_password_label')}</p>
              <p className={styles.quickValue}>{t('dash_password_value')}</p>
            </div>
            <span className={styles.quickArrow}>›</span>
          </div>

          <div className={styles.quickCard} onClick={() => window.location.href = '/settings#phone'}>
            <div className={styles.quickIcon}>📱</div>
            <div className={styles.quickInfo}>
              <p className={styles.quickLabel}>{t('dash_phone_label')}</p>
              <p className={styles.quickValue}>{phoneVerified ? t('kyc_verified') : t('dash_phone_none')}</p>
            </div>
            <span className={`${styles.quickBadge} ${phoneVerified ? styles.cardBadgeGreen : styles.cardBadgeGray}`}>
              {phoneVerified ? t('dash_badge_done') : t('dash_badge_add')}
            </span>
          </div>

          <div className={styles.quickCard} onClick={() => window.location.href = '/settings#identity'}>
            <div className={styles.quickIcon}>🪪</div>
            <div className={styles.quickInfo}>
              <p className={styles.quickLabel}>{t('dash_identity_label')}</p>
              <p className={styles.quickValue}>{kycLabel}</p>
            </div>
            <span className={`${styles.quickBadge} ${kycClass}`}>
              {kycStatus === 'approved' ? t('dash_badge_done') : kycStatus === 'pending' ? t('dash_badge_review') : t('dash_badge_verify')}
            </span>
          </div>

        </div>

        {/* Track a package */}
        <div className={styles.trackingWrap}>
          <TrackingSection />
        </div>

        {/* Parcels — passes setParcels so dashboard stays in sync */}
        <ParcelsSection user={user} onParcelsChange={setParcels} />

        {/* Transactions — can link to any parcel */}
        <TransactionsSection user={user} parcels={parcels} />

        {/* Address book */}
        <AddressBook user={user} />

      </main>
      <Footer />
    </>
  )
}
