/**
 * Structured logger for AI request/response events.
 * Replace with your observability provider (Datadog, Axiom, etc.) in production.
 */

type Level = 'debug' | 'info' | 'warn' | 'error'

interface LogPayload {
  level:     Level
  event:     string
  data?:     Record<string, unknown>
  duration?: number
  timestamp: string
}

function write(level: Level, event: string, data?: Record<string, unknown>, duration?: number) {
  const payload: LogPayload = { level, event, data, duration, timestamp: new Date().toISOString() }
  const tag = `[AI:${level.toUpperCase()}]`
  if (level === 'error') console.error(tag, event, data ?? '')
  else if (level === 'warn')  console.warn(tag, event, data ?? '')
  else if (process.env.NODE_ENV !== 'production' || level === 'info')
    console.log(tag, event, data ?? '')
}

export const aiLogger = {
  debug: (event: string, data?: Record<string, unknown>)                   => write('debug', event, data),
  info:  (event: string, data?: Record<string, unknown>)                   => write('info',  event, data),
  warn:  (event: string, data?: Record<string, unknown>)                   => write('warn',  event, data),
  error: (event: string, data?: Record<string, unknown>)                   => write('error', event, data),
  request: (data: { ip: string; messageCount: number })                    => write('info', 'chat.request',  data),
  response:(data: { ip: string; durationMs: number; error?: string })      => write('info', 'chat.response', data),
}
