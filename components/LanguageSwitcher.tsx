'use client'

import { useLanguage, type Lang } from '@/lib/i18n'
import styles from './LanguageSwitcher.module.css'

const OPTIONS: { value: Lang; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'ru', label: 'RU' },
  { value: 'hy', label: 'ՀԱՅ' },
]

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  return (
    <div className={styles.wrap}>
      {OPTIONS.map(o => (
        <button
          key={o.value}
          className={`${styles.btn} ${lang === o.value ? styles.active : ''}`}
          onClick={() => setLang(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
