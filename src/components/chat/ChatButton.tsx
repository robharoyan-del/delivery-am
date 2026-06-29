'use client'
/**
 * Floating chat button — triggers the ChatDrawer.
 * Includes an unread-dot hint before first interaction.
 */

import { useState, useCallback } from 'react'
import { ChatDrawer } from './ChatDrawer'

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)

  const open = useCallback(() => {
    setIsOpen(true)
    setHasOpened(true)
  }, [])

  const close = useCallback(() => setIsOpen(false), [])

  return (
    <>
      <ChatDrawer isOpen={isOpen} onClose={close} />

      {/* Floating button */}
      <button
        onClick={open}
        aria-label="Open AI assistant"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`
          fixed z-40 bottom-6 right-6
          w-14 h-14 rounded-2xl
          bg-gradient-to-br from-ai-accent to-cyan-500
          hover:from-cyan-400 hover:to-ai-accent
          flex items-center justify-center
          shadow-ai-btn hover:shadow-ai-glow
          transition-all duration-200
          active:scale-95
          ${isOpen ? 'opacity-0 pointer-events-none scale-75' : 'opacity-100 scale-100'}
        `}
      >
        {/* Unread / attention dot */}
        {!hasOpened && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500
                           ring-2 dark:ring-ai-bg ring-white animate-pulse" />
        )}

        {/* Icon */}
        <svg
          width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          className="text-slate-900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          <line x1="9" y1="10" x2="15" y2="10"/>
          <line x1="12" y1="7" x2="12" y2="13"/>
        </svg>
      </button>
    </>
  )
}
