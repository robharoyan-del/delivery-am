'use client'
/**
 * Floating chat drawer — slides up from bottom-right on mobile,
 * appears as a fixed panel on desktop.
 *
 * Controlled externally with `isOpen` / `onClose` props.
 */

import { useEffect, useRef }  from 'react'
import { useTheme }           from '@/src/hooks/useTheme'
import { ChatInterface }      from './ChatInterface'

interface ChatDrawerProps {
  isOpen:  boolean
  onClose: () => void
}

export function ChatDrawer({ isOpen, onClose }: ChatDrawerProps) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Trap focus inside when open
  useEffect(() => {
    if (isOpen) panelRef.current?.focus()
  }, [isOpen])

  return (
    <>
      {/* Backdrop (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 sm:hidden bg-black/40 backdrop-blur-sm animate-fadeIn"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="AI Assistant"
        aria-modal="true"
        tabIndex={-1}
        className={`
          fixed z-50 flex flex-col outline-none
          transition-all duration-300 ease-drawer
          shadow-2xl shadow-black/40

          /* Mobile — bottom drawer */
          bottom-0 right-0 left-0 sm:left-auto
          h-[80dvh] sm:h-auto
          rounded-t-3xl sm:rounded-2xl

          /* Desktop — fixed panel */
          sm:bottom-24 sm:right-6
          sm:w-[380px] sm:max-h-[580px]

          /* Theme */
          dark:bg-ai-surface bg-white
          dark:border border dark:border-white/10 border-black/10

          /* Open/close state */
          ${isOpen
            ? 'translate-y-0 opacity-100 pointer-events-auto sm:animate-drawerIn'
            : 'translate-y-8 opacity-0 pointer-events-none'}
        `}
        style={{ height: undefined }}
      >
        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full dark:bg-white/20 bg-black/10" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3
                        border-b dark:border-white/5 border-black/5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-ai-accent/30 to-purple-500/30
                            border dark:border-ai-accent/30 border-ai-accent/20
                            flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   className="dark:text-ai-accent text-cyan-600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold dark:text-ai-text text-slate-900">Assistant</p>
              <p className="text-[10px] dark:text-ai-muted text-slate-500">Delivery.am · AI</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                         dark:hover:bg-white/10 hover:bg-black/5
                         dark:text-ai-muted text-slate-500"
            >
              {isDark ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close assistant"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                         dark:hover:bg-white/10 hover:bg-black/5
                         dark:text-ai-muted text-slate-500"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Chat body */}
        <div className="flex-1 overflow-hidden flex flex-col sm:max-h-[490px]">
          <ChatInterface onClose={onClose} />
        </div>
      </div>
    </>
  )
}
