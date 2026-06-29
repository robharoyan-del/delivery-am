/**
 * Mastra Agent declaration for structure and discoverability.
 * The agent config lives here; actual inference is done by streamText in the API route.
 *
 * Future: use mastra.getAgent() for multi-agent orchestration, evals, or Mastra Cloud.
 */
import { Agent }  from '@mastra/core/agent'
import { openai } from '@ai-sdk/openai'

import { SYSTEM_PROMPT }  from '../prompts/system'
import { searchWebsite }  from '../tools/search'
import { navigateUser }   from '../tools/navigation'
import { getProducts }    from '../tools/products'
import { getFAQs, getContactInfo } from '../tools/faq'

// Export the tools so the API route can import them from a single place
export const agentTools = {
  searchWebsite,
  navigateUser,
  getProducts,
  getFAQs,
  getContactInfo,
} as const

export const websiteAssistant = new Agent({
  id:           'websiteAssistant',
  name:         'websiteAssistant',
  instructions: SYSTEM_PROMPT,
  model:        openai(process.env.OPENAI_MODEL ?? 'gpt-4o'),
  tools:        agentTools,
})
