'use client'
/**
 * Renders a single chat message.
 * Markdown is parsed with react-markdown; code blocks use CodeBlock for syntax highlighting.
 */

import dynamic       from 'next/dynamic'
import remarkGfm     from 'remark-gfm'
import type { ChatMessage } from '@/src/hooks/useAiChat'
import { CodeBlock } from './CodeBlock'

// react-markdown is ESM-only — dynamic import prevents SSR issues
const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false })

interface MessageItemProps {
  message: ChatMessage
  isDark:  boolean
}

// ── Assistant avatar ────────────────────────────────────────────────────────────

function AiAvatar() {
  return (
    <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-ai-accent/30 to-purple-500/30
                    border dark:border-ai-accent/30 border-ai-accent/20 flex items-center justify-center">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           className="dark:text-ai-accent text-cyan-600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
        <path d="M12 2v10" />
        <path d="m18.07 5.93-6.07 6.07" />
      </svg>
    </div>
  )
}

// ── Markdown components ─────────────────────────────────────────────────────────

function buildMarkdownComponents(isDark: boolean) {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code({ inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className ?? '')
      const code  = String(children).replace(/\n$/, '')

      if (!inline && match) {
        return <CodeBlock language={match[1]} isDark={isDark}>{code}</CodeBlock>
      }

      return (
        <code
          className="px-1.5 py-0.5 rounded-md text-sm font-mono
                     dark:bg-white/10 bg-black/10
                     dark:text-ai-accent text-cyan-700"
          {...props}
        >
          {children}
        </code>
      )
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    a({ href, children, ...props }: any) {
      const isInternal = href?.startsWith('/')
      return (
        <a
          href={href}
          target={isInternal ? '_self' : '_blank'}
          rel={isInternal ? undefined : 'noopener noreferrer'}
          className="dark:text-ai-accent text-cyan-600 underline decoration-dotted hover:decoration-solid
                     transition-all duration-100"
          {...props}
        >
          {children}
        </a>
      )
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    p({ children, ...props }: any) {
      return <p className="mb-2 last:mb-0 leading-relaxed" {...props}>{children}</p>
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ul({ children, ...props }: any) {
      return <ul className="list-disc list-inside mb-2 space-y-1" {...props}>{children}</ul>
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ol({ children, ...props }: any) {
      return <ol className="list-decimal list-inside mb-2 space-y-1" {...props}>{children}</ol>
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    li({ children, ...props }: any) {
      return <li className="leading-relaxed" {...props}>{children}</li>
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    strong({ children, ...props }: any) {
      return <strong className="font-semibold dark:text-white text-slate-900" {...props}>{children}</strong>
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    blockquote({ children, ...props }: any) {
      return (
        <blockquote
          className="border-l-2 dark:border-ai-accent/50 border-cyan-300
                     pl-3 dark:text-ai-muted text-slate-500 italic my-2"
          {...props}
        >
          {children}
        </blockquote>
      )
    },
  }
}

// ── Main component ──────────────────────────────────────────────────────────────

export function MessageItem({ message, isDark }: MessageItemProps) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end px-4 py-1 animate-slideUp">
        <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm leading-relaxed
                        bg-gradient-to-br from-ai-accent to-cyan-500 text-slate-900 font-medium shadow-sm">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 px-4 py-1 animate-slideUp">
      <AiAvatar />
      <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm
                       dark:bg-ai-surface-2 bg-ai-surface-2-light
                       dark:text-ai-text text-ai-text-light
                       ${!message.content ? 'min-w-[60px] min-h-[36px]' : ''}`}>
        {message.content ? (
          // @ts-ignore — dynamic import type mismatch is benign
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={buildMarkdownComponents(isDark)}
          >
            {message.content}
          </ReactMarkdown>
        ) : (
          // Empty bubble while streaming
          <span className="inline-block w-2 h-4 align-middle dark:bg-ai-accent bg-cyan-500 rounded-sm animate-pulse" />
        )}
      </div>
    </div>
  )
}
