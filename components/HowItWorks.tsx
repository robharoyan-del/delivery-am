'use client'

import { useLanguage } from '@/lib/i18n'
import styles from './HowItWorks.module.css'

export default function HowItWorks() {
  const { t } = useLanguage()

  const STEPS = [
    { icon: '🏠', num: '01', title: t('how_step1_title'), desc: t('how_step1_desc') },
    { icon: '🛍️', num: '02', title: t('how_step2_title'), desc: t('how_step2_desc') },
    { icon: '✈️', num: '03', title: t('how_step3_title'), desc: t('how_step3_desc') },
    { icon: '📍', num: '04', title: t('how_step4_title'), desc: t('how_step4_desc') },
  ]

  return (
    <section className={styles.section} id="how-it-works">
      <p className="section-label">{t('how_label')}</p>
      <h2 className="section-title">{t('how_title')}</h2>
      <p className={styles.body}>{t('how_body')}</p>

      <div className={styles.grid}>
        {STEPS.map((step) => (
          <div key={step.num} className={styles.card}>
            <div className={styles.icon}>{step.icon}</div>
            <p className={styles.num}>{step.num}</p>
            <p className={styles.title}>{step.title}</p>
            <p className={styles.desc}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
