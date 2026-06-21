'use client'

import styles from './PasswordStrength.module.css'

type Level = 'weak' | 'fair' | 'strong' | 'very-strong'

function score(pw: string): { level: Level; label: string; tips: string[] } {
  const tips: string[] = []
  let pts = 0

  if (pw.length >= 8)  pts++; else tips.push('at least 8 characters')
  if (pw.length >= 12) pts++
  if (/[A-Z]/.test(pw)) pts++; else tips.push('an uppercase letter')
  if (/[0-9]/.test(pw)) pts++; else tips.push('a number')
  if (/[^A-Za-z0-9]/.test(pw)) pts++; else tips.push('a special character (!@#…)')

  if (pts <= 1) return { level: 'weak',        label: 'Weak',        tips }
  if (pts === 2) return { level: 'fair',        label: 'Fair',        tips }
  if (pts === 3) return { level: 'strong',      label: 'Strong',      tips }
  return              { level: 'very-strong', label: 'Very strong', tips }
}

const SEGMENTS = 4
const FILL: Record<Level, number> = { weak: 1, fair: 2, strong: 3, 'very-strong': 4 }

export default function PasswordStrength({ password }: { password: string }) {
  if (!password) return null

  const { level, label, tips } = score(password)
  const filled = FILL[level]
  const minLen = 6

  return (
    <div className={styles.wrap}>
      <div className={styles.barRow}>
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <div
            key={i}
            className={`${styles.seg} ${i < filled ? styles[level] : ''}`}
          />
        ))}
        <span className={`${styles.label} ${styles[level]}`}>{label}</span>
      </div>

      <p className={styles.hint}>
        {password.length < minLen
          ? `Minimum ${minLen} characters — ${minLen - password.length} more needed.`
          : tips.length
          ? `Add ${tips.slice(0, 2).join(' and ')} to strengthen it.`
          : 'Great password!'}
      </p>
    </div>
  )
}
