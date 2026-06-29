'use client'

const PROMPTS = [
  { label: 'How does it work?',       icon: '📦' },
  { label: 'Shipping from USA',        icon: '🇺🇸' },
  { label: 'Shipping times & cost',   icon: '⏱️' },
  { label: 'How to track my parcel?', icon: '📍' },
]

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void
  disabled?: boolean
}

export function SuggestedPrompts({ onSelect, disabled }: SuggestedPromptsProps) {
  return (
    <div className="px-4 pb-2 flex flex-wrap gap-2 animate-fadeIn">
      {PROMPTS.map(p => (
        <button
          key={p.label}
          onClick={() => onSelect(p.label)}
          disabled={disabled}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all duration-150
                     dark:border-white/10 border-black/10
                     dark:bg-white/5 bg-black/5
                     dark:hover:bg-ai-accent/10 hover:bg-cyan-50
                     dark:hover:border-ai-accent/30 hover:border-cyan-300
                     dark:text-ai-muted text-slate-600
                     dark:hover:text-ai-accent hover:text-cyan-600
                     disabled:opacity-40 disabled:pointer-events-none"
        >
          <span>{p.icon}</span>
          <span>{p.label}</span>
        </button>
      ))}
    </div>
  )
}
