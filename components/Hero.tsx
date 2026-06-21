'use client'

import { useAuth } from '@/lib/auth-context'
import { useLanguage } from '@/lib/i18n'
import styles from './Hero.module.css'
import ShippingCalculator from './ShippingCalculator'

export default function Hero() {
  const { user, openModal } = useAuth()
  const { t } = useLanguage()

  return (
    <section className={styles.hero}>
      <div className={styles.left}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          {t('hero_badge')}
        </div>

        <h1 className={styles.h1}>
          {t('hero_h1_1')}<br />
          <span className={styles.accentLine}>
            {t('hero_h1_2')}
            <span className={styles.underline} />
          </span>
        </h1>

        <p className={styles.sub}>{t('hero_sub')}</p>

        <div className={styles.cta}>
          {user ? (
            <a href="/dashboard" className="btn-large" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              {t('hero_cta_dashboard')}
            </a>
          ) : (
            <>
              <button className="btn-large" onClick={() => openModal('register')}>
                {t('hero_cta_start')}
              </button>
              <button className="btn-large-ghost" onClick={() => openModal('login')}>
                {t('hero_cta_login')}
              </button>
            </>
          )}
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <div className={styles.statNum}>6+</div>
            <div className={styles.statLabel}>{t('hero_stat_countries')}</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNum}>2–7</div>
            <div className={styles.statLabel}>{t('hero_stat_days')}</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNum}>24/7</div>
            <div className={styles.statLabel}>{t('hero_stat_tracking')}</div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <ShippingCalculator />
      </div>
    </section>
  )
}
