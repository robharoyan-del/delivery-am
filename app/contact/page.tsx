'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from '../static-page.module.css'

export default function ContactPage() {
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [message,  setMessage]  = useState('')
  const [sent,     setSent]     = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // In production, wire this to an email service or Supabase edge function
    setSent(true)
    setName(''); setEmail(''); setMessage('')
  }

  const contacts = [
    {
      icon: '📞',
      title: 'Phone',
      value: '060 111 222',
      href: 'tel:+37460111222',
      desc: 'Monday – Saturday, 9am – 6pm',
    },
    {
      icon: '✉️',
      title: 'Email',
      value: 'support@delivery.am',
      href: 'mailto:support@delivery.am',
      desc: 'We respond within 24 hours',
    },
    {
      icon: '📍',
      title: 'Address',
      value: 'Yerevan, Armenia',
      href: 'https://maps.google.com/?q=Yerevan,Armenia',
      desc: 'Main office & pickup location',
    },
    {
      icon: '⏰',
      title: 'Working hours',
      value: 'Mon – Sat, 9:00 – 18:00',
      href: null,
      desc: 'Armenian time (UTC+4)',
    },
  ]

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>Support</p>
            <h1 className={styles.title}>Contact Us</h1>
            <p className={styles.subtitle}>
              Have a question about your shipment or our service? We're here to help.
            </p>
          </div>
        </div>

        <div className={styles.content}>
          {/* Contact cards */}
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

          {/* Contact form */}
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Send us a message</h2>

            {sent ? (
              <p className={styles.successMsg}>
                ✓ Message sent! We'll get back to you within 24 hours.
              </p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="c-name">Your name</label>
                  <input
                    id="c-name"
                    className={styles.input}
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="c-email">Email address</label>
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
                  <label className={styles.label} htmlFor="c-msg">Message</label>
                  <textarea
                    id="c-msg"
                    className={styles.textarea}
                    placeholder="Describe your question or issue..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                  />
                </div>
                <button className={styles.submitBtn} type="submit">
                  Send message →
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
