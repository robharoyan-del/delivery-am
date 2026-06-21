'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'

type AuthMode = 'login' | 'register'

interface AuthContextValue {
  user:       User | null
  loading:    boolean
  modalOpen:  boolean
  modalMode:  AuthMode
  openModal:  (mode: AuthMode) => void
  closeModal: () => void
  signOut:    () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,      setUser]      = useState<User | null>(null)
  const [loading,   setLoading]   = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<AuthMode>('login')

  // Whether the login modal was open when SIGNED_IN fired.
  // This is the only reliable signal that the user just logged in
  // vs Supabase restoring an existing session on page load.
  const [loginInProgress, setLoginInProgress] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)

      if (event === 'SIGNED_IN' && session?.user && loginInProgress) {
        setLoginInProgress(false)
        setModalOpen(false)
        window.location.href = '/dashboard'
      }

      if (event === 'SIGNED_OUT') {
        window.location.href = '/'
      }
    })

    return () => subscription.unsubscribe()
  }, [loginInProgress])

  const openModal = useCallback((mode: AuthMode) => {
    setModalMode(mode)
    setModalOpen(true)
    setLoginInProgress(true)   // user opened the modal — next SIGNED_IN is real
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setLoginInProgress(false)  // cancelled — don't redirect
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, modalOpen, modalMode, openModal, closeModal, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
