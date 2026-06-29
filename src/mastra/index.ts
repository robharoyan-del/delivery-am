import { Mastra } from '@mastra/core'
import { websiteAssistant } from './agents/website-agent'

export const mastra = new Mastra({ agents: { websiteAssistant } })

// Re-export for convenience
export { websiteAssistant } from './agents/website-agent'
export { agentTools }       from './agents/website-agent'
export { SYSTEM_PROMPT }    from './prompts/system'
