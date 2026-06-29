/**
 * searchWebsite tool — finds relevant pages for a user query.
 *
 * Current impl: static in-memory index.
 * Future: swap `searchProvider` to Algolia / Elasticsearch / Pinecone RAG.
 */

import { tool } from 'ai'
import { z }    from 'zod'
import type { SearchResult, SearchResponse } from './types'

// ── Static page index (replace with real search provider) ─────────────────────

const INDEX: SearchResult[] = [
  {
    id: 'home', title: 'Home',
    url: '/',
    excerpt: 'Package forwarding service — shop from USA, China, Germany, UK, Italy, UAE and receive in Armenia.',
  },
  {
    id: 'dashboard', title: 'Dashboard',
    url: '/dashboard',
    excerpt: 'View and manage your parcels, track shipments, view your personal suite address and transaction history.',
  },
  {
    id: 'settings', title: 'Account Settings',
    url: '/settings',
    excerpt: 'Manage profile, change password, add phone number, upload KYC identity documents.',
  },
  {
    id: 'contact', title: 'Contact Us',
    url: '/contact',
    excerpt: 'Contact the Delivery.am support team by email or phone. Get help with packages, customs, or billing.',
  },
  {
    id: 'privacy', title: 'Privacy Policy',
    url: '/privacy',
    excerpt: 'How we collect, store and protect your personal data.',
  },
  {
    id: 'terms', title: 'Terms of Service',
    url: '/terms',
    excerpt: 'Terms and conditions for using Delivery.am services.',
  },
]

// TODO: Replace with real search provider
// Example: const results = await algolia.search(indexName, query)
// Example: const results = await pinecone.query({ vector: await embed(query), topK: 5 })
async function searchProvider(query: string): Promise<SearchResult[]> {
  const q = query.toLowerCase()
  const scored = INDEX.map(page => {
    const text = `${page.title} ${page.excerpt}`.toLowerCase()
    const score = q.split(' ').reduce((acc, word) => acc + (text.includes(word) ? 1 : 0), 0) / q.split(' ').length
    return { ...page, score }
  }).filter(p => p.score > 0).sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

  return scored.length ? scored : INDEX.slice(0, 3)
}

// ── Tool definition ───────────────────────────────────────────────────────────

export const searchWebsite = tool({
  description: 'Search the Delivery.am website to find relevant pages, features, or content based on the user query.',
  inputSchema: z.object({
    query: z.string().describe('Search query — keywords or phrase from the user'),
  }),
  execute: async ({ query }): Promise<SearchResponse> => {
    const results = await searchProvider(query)
    return { results, query }
  },
})
