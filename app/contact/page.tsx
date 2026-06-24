'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/i18n'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from '../static-page.module.css'

export default function ContactPage() {
  const { t } = useLanguage()
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [message, setMessage] = useState('')
  const [sent,    setSent]    = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
    setName(''); setEmail(''); setMessage('')
  }

  const contacts = [
    {
      icon: '📞',
      title: t('contact_phone_title'),
      value: '060 111 222',
      href: 'tel:+37460111222',
      desc: t('contact_phone_desc'),
    },
    {
      icon: '✉️',
      title: t('contact_email_title'),
      value: 'support@delivery.am',
      href: 'mailto:support@delivery.am',
      desc: t('contact_email_desc'),
    },
    {
      icon: '📍',
      title: t('contact_address_title'),
      value: 'Yerevan, Armenia',
      href: 'https://maps.google.com/?q=Yerevan,Armenia',
      desc: t('contact_address_desc'),
    },
    {
      icon: '⏰',
      title: t('contact_hours_title'),
      value: t('contact_hours_value'),
      href: null,
      desc: t('contact_hours_desc'),
    },
  ]

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>{t('contact_eyebrow')}</p>
            <h1 className={styles.title}>{t('contact_title')}</h1>
            <p className={styles.subtitle}>{t('contact_subtitle')}</p>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.grid}>
            {contacts.map(c => (
              <div key={c.title} className={styles.card}>
                <div className={styles.cardIcon}>{c.icon}</div>
                <p className={styles.cardTitle}>{c.title}</p>
                {c.href ? (
                  <a href={c.href} className={styles.cardValue} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                    {c.value}
                  </a>
                ) : (
                  <p className={styles.cardValue} style={{ color: 'var(--text)' }}>{c.value}</p>
                )}
                <p className={styles.cardDesc}>{c.desc}</p>
              </div>
            ))}
          </div>

          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>{t('contact_form_title')}</h2>

            {sent ? (
              <p className={styles.successMsg}>{t('contact_success')}</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="c-name">{t('contact_name_label')}</label>
                  <input
                    id="c-name"
                    className={styles.input}
                    type="text"
                    placeholder={t('contact_name_placeholder')}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="c-email">{t('contact_email_label')}</label>
                  <input
                    id="c-email"
                    className={styles.input}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="c-msg">{t('contact_msg_label')}</label>
                  <textarea
                    id="c-msg"
                    className={styles.textarea}
                    placeholder={t('contact_msg_placeholder')}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                  />
                </div>
                <button className={styles.submitBtn} type="submit">
                  {t('contact_submit')}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
