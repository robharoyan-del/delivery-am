'use client'

import { useEffect, useRef } from 'react'
import type { ChatMessage }  from '@/src/hooks/useAiChat'
import { MessageItem }       from './MessageItem'
import { TypingIndicator }   from './TypingIndicator'

interface MessageListProps {
  messages:  ChatMessage[]
  isLoading: boolean
  isDark:    boolean
}

export function MessageList({ messages, isLoading, isDark }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const lastIsAssistant = messages.at(-1)?.role === 'assistant'
  const showTyping = isLoading && !lastIsAssistant

  return (
    <div className="flex-1 overflow-y-auto py-4 space-y-1 scroll-smooth" role="log" aria-live="polite">
      {messages.map(msg => (
        <MessageItem key={msg.id} message={msg} isDark={isDark} />
      ))}

      {showTyping && <TypingIndicator />}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  )
}
