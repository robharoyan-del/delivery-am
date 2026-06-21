'use client'

import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { WAREHOUSE_COUNTRIES, getSuiteNumber } from '@/lib/warehouse'
import { useLanguage } from '@/lib/i18n'
import styles from './AddressBook.module.css'

interface Props {
  user: User
}

export default function AddressBook({ user }: Props) {
  const { t } = useLanguage()
  const suite      = getSuiteNumber(user.id)
  const userName   = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer'
  const [active,   setActive]  = useState('usa')
  const [copied,   setCopied]  = useState<string | null>(null)

  const country = WAREHOUSE_COUNTRIES.find(c => c.key === active)!

  function copyField(label: string, value: string) {
    navigator.clipboard.writeText(value)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  function copyAll() {
    const lines = country.fields
      .map(f => {
        const val = f.getValue(suite, userName)
        return val ? `${f.label}: ${val}` : null
      })
      .filter(Boolean)
      .join('\n')
    navigator.clipboard.writeText(lines)
    setCopied('ALL')
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>

        {/* Sidebar — country tabs */}
        <aside className={styles.sidebar}>
          <p className={styles.sidebarLabel}>{t('addr_your_warehouses')}</p>
          {WAREHOUSE_COUNTRIES.map(c => (
            <button
              key={c.key}
              className={`${styles.countryTab} ${active === c.key ? styles.countryTabActive : ''}`}
              onClick={() => setActive(c.key)}
            >
              <span className={styles.tabFlag}>{c.flag}</span>
              <span className={styles.tabInfo}>
                <span className={styles.tabName}>{c.name}</span>
                <span className={styles.tabCity}>{c.city}</span>
              </span>
              {active === c.key && <span className={styles.tabChevron}>›</span>}
            </button>
          ))}
        </aside>

        {/* Main — address card */}
        <div className={styles.addressPanel}>

          {/* Panel header */}
          <div className={styles.panelHeader}>
            <div>
              <div className={styles.panelFlag}>{country.flag}</div>
              <h2 className={styles.panelTitle}>{country.name} {t('addr_warehouse')}</h2>
              <p className={styles.panelCity}>{country.city}</p>
            </div>
            <button
              className={`${styles.copyAllBtn} ${copied === 'ALL' ? styles.copiedBtn : ''}`}
              onClick={copyAll}
            >
              {copied === 'ALL' ? t('addr_copied') : t('addr_copy_all')}
            </button>
          </div>

          {/* Suite callout */}
          <div className={styles.suiteCallout}>
            <div>
              <p className={styles.suiteLabel}>{t('addr_suite_label')}</p>
              <p className={styles.suiteNum}>Suite {suite}</p>
              <p className={styles.suiteNote}>{t('addr_suite_note')}</p>
            </div>
            <div className={styles.suiteBadge}>{suite}</div>
          </div>

          {/* Address fields */}
          <div className={styles.fields}>
            {country.fields.map(field => {
              const value = field.getValue(suite, userName)
              if (!value) return null
              const isCopied = copied === field.label
              return (
                <div key={field.label} className={styles.field}>
                  <div className={styles.fieldMeta}>
                    <span className={styles.fieldLabel}>{field.label}</span>
                    <button
                      className={`${styles.copyBtn} ${isCopied ? styles.copyBtnCopied : ''}`}
                      onClick={() => copyField(field.label, value)}
                    >
                      {isCopied ? t('addr_copy_done') : t('addr_copy')}
                    </button>
                  </div>
                  <div className={styles.fieldValue}>{value}</div>
                </div>
              )
            })}
          </div>

          {/* Note */}
          <div className={styles.note}>
            <span className={styles.noteIcon}>ℹ️</span>
            {country.note}
          </div>
        </div>

      </div>
    </div>
  )
}
