'use client'

import { useLanguage } from '@/lib/i18n'
import styles from './Footer.module.css'

export default function Footer() {
  const { t } = useLanguage()

  const LINKS = [
    { label: t('footer_privacy'), href: '/privacy'  },
    { label: t('footer_terms'),   href: '/terms'    },
    { label: t('footer_contact'), href: '/contact'  },
  ]

  return (
    <footer className={styles.footer}>
      <p className={styles.copy}>{t('footer_copy')}</p>
      <nav className={styles.links}>
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} className={styles.link}>
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  )
}
