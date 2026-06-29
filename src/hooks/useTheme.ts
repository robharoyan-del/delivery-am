'use client'
/**
 * Dark / light mode toggle.
 * Persists to localStorage. Defaults to dark to match the site design.
 * Applies `dark` or `light` class to <html> for Tailwind's `darkMode: 'class'`.
 */

import { useState, useEffect, useCallback } from 'react'

export type Theme         = 'dark' | 'light' | 'system'
export type ResolvedTheme = 'dark' | 'light'

const STORAGE_KEY = 'delivery-am-theme'

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme): ResolvedTheme {
  const resolved = theme === 'system' ? getSystemTheme() : theme
  const root = document.documentElement
  root.classList.toggle('dark',  resolved === 'dark')
  root.classList.toggle('light', resolved === 'light')
  return resolved
}

export function useTheme() {
  const [theme,         setThemeState]         = useState<Theme>('dark')
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark')
  const [mounted,       setMounted]       = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? 'dark'
    setThemeState(stored)
    const resolved = applyTheme(stored)
    setResolvedTheme(resolved)
  }, [])

  // Listen for system preference changes
  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setResolvedTheme(applyTheme('system'))
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(STORAGE_KEY, newTheme)
    const resolved = applyTheme(newTheme)
    setResolvedTheme(resolved)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  return { theme, resolvedTheme, setTheme, toggleTheme, mounted }
}
