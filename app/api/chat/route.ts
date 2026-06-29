/**
 * POST /api/chat
 * Streaming AI chat endpoint.
 *
 * Uses streamText from AI SDK v6 (which supports toTextStreamResponse).
 * Mastra provides the agent definition / tool set; we invoke streamText directly
 * to guarantee streaming compatibility with the installed SDK version.
 *
 * Rate limiting: in-memory (stateless). Replace with Upstash Redis for production.
 */
import { NextRequest }  from 'next/server'
import { streamText, stepCountIs } from 'ai'
import { openai }       from '@ai-sdk/openai'

import { getAiConfig }              from '@/src/lib/ai/config'
import { aiLogger }                 from '@/src/lib/ai/logger'
import { checkRateLimit, getClientIp } from '@/src/lib/ai/rate-limit'
import { agentTools, SYSTEM_PROMPT }   from '@/src/mastra'

export const runtime    = 'nodejs'
export const maxDuration = 60

// ── Message validation ─────────────────────────────────────────────────────────

interface IncomingMessage {
  role:    'user' | 'assistant'
  content: string
}

function validateMessages(raw: unknown): IncomingMessage[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw Object.assign(new Error('messages must be a non-empty array'), { status: 400 })
  }
  return raw.map((m, i) => {
    if (!m || typeof m !== 'object') throw Object.assign(new Error(`messages[${i}] is not an object`), { status: 400 })
    const { role, content } = m as Record<string, unknown>
    if (role !== 'user' && role !== 'assistant')
      throw Object.assign(new Error(`messages[${i}].role must be "user" or "assistant"`), { status: 400 })
    if (typeof content !== 'string' || !content.trim())
      throw Object.assign(new Error(`messages[${i}].content must be a non-empty string`), { status: 400 })
    return { role, content: content.trim() }
  })
}

// ── Handler ────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const startedAt = Date.now()
  const ip        = getClientIp(req)

  // ── Rate limiting ──────────────────────────────────────────────────────────
  const rl = checkRateLimit(ip)
  if (!rl.ok) {
    aiLogger.warn('chat.rate_limit', { ip, reset: rl.reset })
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please wait a moment.' }),
      {
        status: 429,
        headers: {
          'Content-Type':    'application/json',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset':     String(rl.reset),
          'Retry-After':           String(Math.ceil((rl.reset - Date.now()) / 1000)),
        },
      }
    )
  }

  try {
    // ── Parse & validate ────────────────────────────────────────────────────
    const body     = await req.json()
    const messages = validateMessages(body?.messages)

    aiLogger.request({ ip, messageCount: messages.length })

    // ── Config / env validation ─────────────────────────────────────────────
    const config = getAiConfig()

    // ── Stream ──────────────────────────────────────────────────────────────
    const result = streamText({
      model:   openai(config.OPENAI_MODEL),
      system:  SYSTEM_PROMPT,
      messages,
      tools:   agentTools,
      // Allow up to 5 internal tool-call steps before producing final text
      stopWhen: stepCountIs(5),
      temperature: 0.4,
      onFinish: ({ usage }) => {
        aiLogger.response({
          ip,
          durationMs: Date.now() - startedAt,
          ...usage,
        })
      },
    })

    // toTextStreamResponse() streams only the final text to the client.
    // Tool calls run server-side; their results are incorporated into the response text.
    return result.toTextStreamResponse({
      headers: {
        'X-RateLimit-Remaining': String(rl.remaining),
        'X-RateLimit-Reset':     String(rl.reset),
      },
    })

  } catch (err) {
    const msg   = err instanceof Error ? err.message : 'Internal server error'
    const code  = (err as { status?: number }).status ?? 500

    aiLogger.error('chat.error', { ip, message: msg, code })

    return new Response(
      JSON.stringify({ error: msg }),
      {
        status:  code,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
