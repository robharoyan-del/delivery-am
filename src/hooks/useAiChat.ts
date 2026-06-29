'use client'
/**
 * Custom streaming chat hook.
 * Uses fetch() + ReadableStream directly instead of the Vercel AI SDK's
 * useChat hook, giving us full control and version-independence.
 *
 * Future: add conversation persistence, auth headers, RAG context injection.
 */

import { useState, useCallback, useRef } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id:        string
  role:      MessageRole
  content:   string
  createdAt: Date
}

interface UseAiChatOptions {
  /** API endpoint — defaults to /api/chat */
  api?:             string
  initialMessages?: ChatMessage[]
  onError?:         (error: Error) => void
  onFinish?:        (message: ChatMessage) => void
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAiChat({
  api = '/api/chat',
  initialMessages = [],
  onError,
  onFinish,
}: UseAiChatOptions = {}) {
  const [messages,   setMessages]   = useState<ChatMessage[]>(initialMessages)
  const [input,      setInput]      = useState('')
  const [isLoading,  setIsLoading]  = useState(false)
  const [error,      setError]      = useState<Error | null>(null)

  const abortRef  = useRef<AbortController | null>(null)
  const idCounter = useRef(0)

  const genId = () => `msg-${++idCounter.current}-${Date.now()}`

  // ── Core send ──────────────────────────────────────────────────────────────

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMsg: ChatMessage = { id: genId(), role: 'user', content: content.trim(), createdAt: new Date() }
    const asstId = genId()
    const asstMsg: ChatMessage = { id: asstId, role: 'assistant', content: '', createdAt: new Date() }

    setMessages(prev => [...prev, userMsg, asstMsg])
    setInput('')
    setIsLoading(true)
    setError(null)

    abortRef.current = new AbortController()

    try {
      const response = await fetch(api, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
        }),
        signal: abortRef.current.signal,
      })

      if (!response.ok) {
        const body = await response.text().catch(() => '')
        throw new Error(
          response.status === 429 ? 'Rate limit exceeded. Please wait a moment.'
          : response.status === 500 ? 'Server error. Please try again.'
          : `Request failed (${response.status})${body ? `: ${body}` : ''}`
        )
      }

      if (!response.body) throw new Error('No response stream')

      const reader  = response.body.getReader()
      const decoder = new TextDecoder()
      let   fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        fullContent += chunk

        setMessages(prev =>
          prev.map(m => m.id === asstId ? { ...m, content: fullContent } : m)
        )
      }

      const finalMsg: ChatMessage = { id: asstId, role: 'assistant', content: fullContent, createdAt: new Date() }
      onFinish?.(finalMsg)

    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        // User stopped — keep partial response
      } else {
        const e = err instanceof Error ? err : new Error('Unknown error')
        setError(e)
        onError?.(e)
        // Remove the empty assistant placeholder
        setMessages(prev => prev.filter(m => m.id !== asstId || m.content.length > 0))
      }
    } finally {
      setIsLoading(false)
      abortRef.current = null
    }
  }, [api, messages, isLoading, onError, onFinish]) // eslint-disable-line

  // ── Actions ────────────────────────────────────────────────────────────────

  const stop = useCallback(() => {
    abortRef.current?.abort()
    setIsLoading(false)
  }, [])

  const reload = useCallback(() => {
    const lastUser = [...messages].reverse().find(m => m.role === 'user')
    if (!lastUser) return
    // Remove last assistant turn and re-send
    setMessages(prev => {
      const idx = prev.findLastIndex(m => m.role === 'user')
      return prev.slice(0, idx)
    })
    sendMessage(lastUser.content)
  }, [messages, sendMessage])

  const append = useCallback((msg: Pick<ChatMessage, 'role' | 'content'>) => {
    if (msg.role === 'user') sendMessage(msg.content)
  }, [sendMessage])

  const clearMessages = useCallback(() => setMessages([]), [])

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault()
    sendMessage(input)
  }, [input, sendMessage])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setInput(e.target.value)
  }, [])

  return {
    messages,
    input,
    isLoading,
    error,
    handleSubmit,
    handleInputChange,
    stop,
    reload,
    append,
    clearMessages,
    setInput,
    setMessages,
  }
}
