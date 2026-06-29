/**
 * AI configuration & environment validation.
 * Called lazily on first request so build-time doesn't fail.
 */
import { z } from 'zod'

const envSchema = z.object({
  OPENAI_API_KEY:          z.string().min(1, 'OPENAI_API_KEY is required'),
  OPENAI_MODEL:            z.string().default('gpt-4o'),
  OPENAI_EMBEDDING_MODEL:  z.string().default('text-embedding-3-large'),
  // Optional: rate limiting
  AI_RATE_LIMIT_RPM:       z.coerce.number().default(20),
})

export type AiConfig = z.infer<typeof envSchema>

let _config: AiConfig | null = null

export function getAiConfig(): AiConfig {
  if (_config) return _config
  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    const msg = parsed.error.errors.map(e => `  ${e.path.join('.')}: ${e.message}`).join('\n')
    throw new Error(`AI configuration error — missing environment variables:\n${msg}\n\nAdd them to your .env.local file.`)
  }
  _config = parsed.data
  return _config
}
