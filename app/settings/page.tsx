'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SettingsPassword from '@/components/SettingsPassword'
import SettingsPhone    from '@/components/SettingsPhone'
import SettingsIdentity from '@/components/SettingsIdentity'
import styles from './settings.module.css'

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push('/')
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner} />
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>

        <div className={styles.header}>
          <div className={styles.headerInner}>
            <div>
              <p className={styles.eyebrow}>Account</p>
              <h1 className={styles.title}>Settings</h1>
              <p className={styles.sub}>Manage your password, phone number, and identity verification.</p>
            </div>
            <button className={styles.backBtn} onClick={() => window.location.href='/dashboard'}>
              ← Dashboard
            </button>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.sections}>
            <div id="password">
              <SettingsPassword user={user} />
            </div>
            <div id="phone">
              <SettingsPhone user={user} />
            </div>
            <div id="identity">
              <SettingsIdentity user={user} />
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
