'use client'

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 animate-fadeIn">
      {/* Avatar */}
      <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-ai-accent/30 to-purple-500/30
                      border dark:border-ai-accent/30 border-ai-accent/20 flex items-center justify-center">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             className="dark:text-ai-accent text-cyan-600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
          <path d="M12 2v10" />
          <path d="m18.07 5.93-6.07 6.07" />
        </svg>
      </div>

      {/* Bouncing dots */}
      <div className="flex items-center gap-1 px-3.5 py-2.5 rounded-2xl rounded-tl-sm
                      dark:bg-ai-surface-2 bg-ai-surface-2-light">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="block w-1.5 h-1.5 rounded-full dark:bg-ai-muted bg-slate-400 animate-typing"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  )
}
