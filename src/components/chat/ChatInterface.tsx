'use client'
/**
 * Main chat interface panel.
 * Renders the message list, suggested prompts (when empty), and input area.
 */

import { useAiChat }       from '@/src/hooks/useAiChat'
import { useTheme }        from '@/src/hooks/useTheme'
import { MessageList }     from './MessageList'
import { ChatInput }       from './ChatInput'
import { SuggestedPrompts } from './SuggestedPrompts'

interface ChatInterfaceProps {
  onClose?: () => void
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-8 text-center animate-fadeIn">
      {/* Logo mark */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ai-accent/20 to-purple-500/20
                      border dark:border-ai-accent/20 border-ai-accent/15
                      flex items-center justify-center mb-1 shadow-ai-glow">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             className="dark:text-ai-accent text-cyan-600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      </div>
      <h3 className="font-semibold text-base dark:text-ai-text text-ai-text-light">
        Delivery.am Assistant
      </h3>
      <p className="text-sm dark:text-ai-muted text-slate-500 max-w-[200px] leading-relaxed">
        Ask me about shipping, warehouses, tracking, or how to get started.
      </p>
    </div>
  )
}

// ── Main ────────────────────────────────────────────────────────────────────────

export function ChatInterface({ onClose }: ChatInterfaceProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const { messages, input, isLoading, error, handleSubmit, handleInputChange, stop, append } =
    useAiChat({
      onError: (err) => console.error('[ChatInterface]', err.message),
    })

  const hasMessages = messages.length > 0

  return (
    <div className="flex flex-col h-full dark:bg-ai-surface bg-ai-surface-light">
      {/* Messages or empty state */}
      {hasMessages ? (
        <MessageList messages={messages} isLoading={isLoading} isDark={isDark} />
      ) : (
        <div className="flex-1 flex flex-col justify-end">
          <EmptyState />
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="mx-4 mb-2 px-3 py-2 rounded-xl text-xs
                        dark:bg-red-500/10 bg-red-50
                        dark:text-red-400 text-red-600
                        dark:border border dark:border-red-500/20 border-red-200
                        animate-fadeIn">
          {error.message}
        </div>
      )}

      {/* Suggested prompts — only when no messages */}
      {!hasMessages && (
        <SuggestedPrompts
          onSelect={p => append({ role: 'user', content: p })}
          disabled={isLoading}
        />
      )}

      {/* Input */}
      <ChatInput
        value={input}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        onStop={stop}
        isLoading={isLoading}
      />
    </div>
  )
}
