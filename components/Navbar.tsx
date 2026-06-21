'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useLanguage } from '@/lib/i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, loading, openModal, signOut } = useAuth()
  const { t } = useLanguage()

  const navLinks = [
    { label: t('nav_calculator'),   href: '/#calculator'  },
    { label: t('nav_how_it_works'), href: '/#how-it-works' },
    { label: t('nav_rates'),        href: '/#rates'        },
    { label: t('nav_track'),        href: '/#track'        },
    { label: t('nav_shops'),        href: '/#shops'        },
  ]
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const displayName = user?.user_metadata?.full_name
    || user?.email?.split('@')[0]
    || 'Account'

  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <nav className={styles.nav}>
      <a href="/" className={styles.logo}>
        <div className={styles.logoIcon}>📦</div>
        Delivery<span className={styles.logoAccent}>.am</span>
      </a>

      <ul className={styles.links}>
        {navLinks.map((link) => (
          <li key={link.href}>
            <a href={link.href} className={styles.link}>{link.label}</a>
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        <LanguageSwitcher />
        {loading ? (
          <div className={styles.loadingPill} />
        ) : user ? (
          <div className={styles.userMenu} ref={dropdownRef}>
            <button
              className={styles.avatarBtn}
              onClick={() => window.location.href = '/dashboard'}
              aria-label="Go to dashboard"
            >
              <div className={styles.avatar}>{initials}</div>
              <span className={styles.avatarName}>{displayName}</span>
            </button>
            <button
              className={styles.chevronBtn}
              onClick={() => setDropdownOpen(o => !o)}
              aria-label="Account menu"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {dropdownOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                  <p className={styles.dropdownName}>{displayName}</p>
                  <p className={styles.dropdownEmail}>{user.email}</p>
                </div>
                <div className={styles.dropdownDivider} />
                {/* Plain <a> tags — guaranteed navigation without router issues */}
                <a href="/dashboard" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                  📦 {t('nav_my_addresses')}
                </a>
                <a href="/dashboard#transactions" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                  💳 {t('nav_transactions')}
                </a>
                <a href="/settings" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                  ⚙️ {t('nav_settings')}
                </a>
                <div className={styles.dropdownDivider} />
                <button
                  className={`${styles.dropdownItem} ${styles.dropdownSignOut}`}
                  onClick={() => { signOut(); setDropdownOpen(false) }}
                >
                  {t('nav_sign_out')}
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="btn-ghost" onClick={() => openModal('login')}>{t('nav_login')}</button>
            <button className="btn-primary" onClick={() => openModal('register')}>{t('nav_get_started')}</button>
          </>
        )}
      </div>
    </nav>
  )
}
