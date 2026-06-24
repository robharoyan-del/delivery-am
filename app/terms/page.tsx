'use client'

import { useLanguage } from '@/lib/i18n'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from '../static-page.module.css'

export default function TermsPage() {
  const { t } = useLanguage()

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>{t('terms_eyebrow')}</p>
            <h1 className={styles.title}>{t('terms_title')}</h1>
            <p className={styles.subtitle}>{t('terms_subtitle')}</p>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('terms_s1_title')}</h2>
            <p className={styles.text}>{t('terms_s1_p1')}</p>
            <p className={styles.text}>{t('terms_s1_p2')}</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('terms_s2_title')}</h2>
            <p className={styles.text}>{t('terms_s2_p1')}</p>
            <p className={styles.text}>{t('terms_s2_p2')}</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('terms_s3_title')}</h2>
            <p className={styles.text}>{t('terms_s3_p1')}</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('terms_s4_title')}</h2>
            <p className={styles.text}>{t('terms_s4_p1')}</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('terms_s5_title')}</h2>
            <p className={styles.text}>{t('terms_s5_p1')}</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('terms_s6_title')}</h2>
            <p className={styles.text}>{t('terms_s6_p1')}</p>
          </div>

          <p className={styles.updated}>{t('terms_updated')}</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
