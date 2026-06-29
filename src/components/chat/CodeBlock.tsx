'use client'
/**
 * Renders fenced code blocks with language label and a copy button.
 * react-syntax-highlighter is lazy-loaded only on the client to avoid SSR bundle cost.
 */

import { useState, useCallback } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight }          from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
  language?: string
  children:  string
  isDark?:   boolean
}

export function CodeBlock({ language = 'text', children, isDark = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [children])

  return (
    <div className="group relative my-3 rounded-xl overflow-hidden border dark:border-white/10 border-black/10">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 dark:bg-white/5 bg-black/5 border-b dark:border-white/10 border-black/10">
        <span className="text-xs font-mono dark:text-ai-muted text-ai-muted-light">{language}</span>
        <button
          onClick={handleCopy}
          aria-label="Copy code"
          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-all duration-150
                     dark:bg-white/10 bg-black/10 dark:hover:bg-white/20 hover:bg-black/20
                     dark:text-ai-muted text-ai-muted-light hover:dark:text-ai-text hover:text-ai-text-light"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Highlighted code */}
      <SyntaxHighlighter
        language={language}
        style={isDark ? oneDark : oneLight}
        customStyle={{
          margin:     0,
          padding:    '1rem',
          background: 'transparent',
          fontSize:   '0.8125rem',
          lineHeight: '1.6',
        }}
        PreTag="div"
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
}
