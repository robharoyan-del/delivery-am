'use client'

import { useAuth } from '@/lib/auth-context'
import { useLanguage } from '@/lib/i18n'
import styles from './CTASection.module.css'

export default function CTASection() {
  const { user, openModal } = useAuth()
  const { t } = useLanguage()

  return (
    <section className={styles.section}>
      <div className={styles.block}>
        <div className={styles.topLine} />
        <p className="section-label" style={{ textAlign: 'center' }}>{t('cta_label')}</p>
        <h2 className={styles.h2}>{t('cta_title')}</h2>
        <p className={styles.sub}>{t('cta_sub')}</p>
        <div className={styles.actions}>
          {user ? (
            <a href="/dashboard" className="btn-large" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              {t('cta_dashboard')}
            </a>
          ) : (
            <>
              <button className="btn-large" onClick={() => openModal('register')}>
                {t('cta_create')}
              </button>
              <button className="btn-large-ghost" onClick={() => openModal('login')}>
                {t('cta_login')}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
