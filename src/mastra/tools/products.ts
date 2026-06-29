/**
 * getProducts tool — returns warehouse locations and shipping options.
 *
 * Current impl: static data.
 * Future: connect to CMS, Contentful, Sanity, or PostgreSQL products table.
 *
 * RAG future: embed warehouse descriptions and query via vector similarity.
 */

import { tool } from 'ai'
import { z }    from 'zod'
import type { Warehouse, ProductsResponse } from './types'

// TODO: Replace with database query or CMS API call
// Example: const warehouses = await db.select().from(warehousesTable).where(...)
// Example: const warehouses = await cms.getEntries({ content_type: 'warehouse' })
const WAREHOUSES: Warehouse[] = [
  {
    key: 'usa', flag: '🇺🇸', name: 'USA', city: 'New York (Bronx)', country: 'United States',
    shipping: [
      { method: 'Air',      days: '5–7 business days'   },
      { method: 'Standard', days: '10–14 business days' },
    ],
    note: 'Best for Amazon, eBay, Nike, Apple, Walmart, Farfetch.',
  },
  {
    key: 'china', flag: '🇨🇳', name: 'China', city: 'Guangzhou', country: 'China',
    shipping: [
      { method: 'Air',      days: '7–10 days'   },
      { method: 'Standard', days: '14–21 days'  },
      { method: 'Ground',   days: '21–30 days'  },
    ],
    note: 'Best for Taobao, JD.com, Pinduoduo, AliExpress, Shein.',
  },
  {
    key: 'germany', flag: '🇩🇪', name: 'Germany', city: 'Frankfurt am Main', country: 'Germany',
    shipping: [
      { method: 'Air',    days: '4–6 days'   },
      { method: 'Ground', days: '8–12 days'  },
    ],
    note: 'Covers Germany, Austria, Switzerland and all EU shops.',
  },
  {
    key: 'uk', flag: '🇬🇧', name: 'United Kingdom', city: 'London (Croydon)', country: 'United Kingdom',
    shipping: [{ method: 'Air', days: '4–6 days' }],
    note: 'Best for ASOS, Next, John Lewis, Marks & Spencer, H&M.',
  },
  {
    key: 'italy', flag: '🇮🇹', name: 'Italy', city: 'Milan', country: 'Italy',
    shipping: [{ method: 'Ground', days: '7–10 days' }],
    note: 'Perfect for Italian fashion, luxury brands, Farfetch EU.',
  },
  {
    key: 'uae', flag: '🇦🇪', name: 'UAE', city: 'Dubai', country: 'United Arab Emirates',
    shipping: [{ method: 'Air', days: '3–5 days' }],
    note: 'Fastest route. Ideal for Noon, Namshi and regional brands.',
  },
]

export const getProducts = tool({
  description: 'Returns available warehouse locations, countries, shipping methods, and delivery times for Delivery.am.',
  inputSchema: z.object({
    country: z
      .enum(['usa', 'china', 'germany', 'uk', 'italy', 'uae'])
      .optional()
      .describe('Filter by a specific warehouse country'),
  }),
  execute: async ({ country }): Promise<ProductsResponse> => {
    const warehouses = country
      ? WAREHOUSES.filter(w => w.key === country)
      : WAREHOUSES
    return { warehouses }
  },
})
