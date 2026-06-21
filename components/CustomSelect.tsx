'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './CustomSelect.module.css'

export interface SelectOption {
  value: string
  label: string
  icon?: string        // emoji or text icon shown left of label
  imgSrc?: string      // image url shown left of label
  desc?: string        // small line below label
}

interface Props {
  id?:          string
  options:      SelectOption[]
  value:        string
  onChange:     (val: string) => void
  placeholder?: string
  compact?:     boolean   // smaller height, used for currency picker
}

export default function CustomSelect({
  id, options, value, onChange, placeholder = 'Select…', compact = false
}: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find(o => o.value === value)

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  function select(val: string) {
    onChange(val)
    setOpen(false)
  }

  return (
    <div className={`${styles.wrap} ${compact ? styles.compact : ''}`} ref={ref} id={id}>
      {/* Trigger */}
      <button
        type="button"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''} ${!selected ? styles.placeholder : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={styles.triggerInner}>
          {selected?.imgSrc && (
            <img src={selected.imgSrc} alt="" className={styles.optImg} width={20} height={14} />
          )}
          {selected?.icon && <span className={styles.optIcon}>{selected.icon}</span>}
          <span className={styles.triggerLabel}>
            {selected ? selected.label : placeholder}
          </span>
        </span>
        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          width="14" height="14" viewBox="0 0 14 14" fill="none"
        >
          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className={styles.dropdown} role="listbox">
          {options.map(opt => {
            const isActive = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isActive}
                className={`${styles.option} ${isActive ? styles.optionActive : ''}`}
                onClick={() => select(opt.value)}
              >
                {opt.imgSrc && (
                  <img src={opt.imgSrc} alt="" className={styles.optImg} width={20} height={14} />
                )}
                {opt.icon && <span className={styles.optIcon}>{opt.icon}</span>}
                <span className={styles.optText}>
                  <span className={styles.optLabel}>{opt.label}</span>
                  {opt.desc && <span className={styles.optDesc}>{opt.desc}</span>}
                </span>
                {isActive && <span className={styles.check}>✓</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
