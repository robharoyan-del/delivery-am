'use client'

import { useRef, useCallback, type KeyboardEvent, type ChangeEvent } from 'react'

interface ChatInputProps {
  value:     string
  onChange:  (e: ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit:  (e?: React.FormEvent) => void
  onStop:    () => void
  isLoading: boolean
  disabled?: boolean
}

export function ChatInput({ value, onChange, onSubmit, onStop, isLoading, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Submit on Enter (Shift+Enter = newline)
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading && value.trim()) onSubmit()
    }
  }, [isLoading, value, onSubmit])

  // Auto-resize textarea
  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
    onChange(e)
  }, [onChange])

  const canSend = !isLoading && value.trim().length > 0 && !disabled

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-end gap-2 p-3 border-t dark:border-white/5 border-black/5"
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled || isLoading}
        placeholder="Ask me anything about Delivery.am…"
        aria-label="Chat message"
        className="flex-1 resize-none text-sm leading-relaxed rounded-xl px-3.5 py-2.5 outline-none
                   min-h-[42px] max-h-[160px] overflow-y-auto
                   dark:bg-white/5 bg-black/5
                   dark:text-ai-text text-ai-text-light
                   dark:placeholder-ai-muted placeholder-slate-400
                   dark:border border dark:border-white/10 border-black/10
                   dark:focus:border-ai-accent/50 focus:border-cyan-400
                   transition-colors duration-150
                   disabled:opacity-50 disabled:cursor-not-allowed"
      />

      {isLoading ? (
        <button
          type="button"
          onClick={onStop}
          aria-label="Stop generation"
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150
                     dark:bg-red-500/20 bg-red-100 dark:hover:bg-red-500/30 hover:bg-red-200
                     dark:text-red-400 text-red-600"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        </button>
      ) : (
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150
                     bg-gradient-to-br from-ai-accent to-cyan-500
                     hover:from-cyan-400 hover:to-ai-accent
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:from-slate-500 disabled:to-slate-600
                     shadow-sm hover:shadow-ai-glow text-slate-900"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      )}
    </form>
  )
}
