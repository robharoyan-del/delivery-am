/**
 * Shared TypeScript interfaces for all AI tools.
 * Designed to be swapped with real API / database adapters later.
 *
 * Future integration points are marked with TODO comments.
 */

// ── Search ────────────────────────────────────────────────────────────────────

export interface SearchResult {
  id:      string
  title:   string
  url:     string
  excerpt: string
  score?:  number   // relevance score (0–1) when using RAG/vector search
}

export interface SearchResponse {
  results: SearchResult[]
  query:   string
}

// ── Products / Warehouses ─────────────────────────────────────────────────────

export interface ShippingOption {
  method: string
  days:   string
}

export interface Warehouse {
  key:      string
  flag:     string
  name:     string
  city:     string
  country:  string
  shipping: ShippingOption[]
  note:     string
}

export interface ProductsResponse {
  warehouses: Warehouse[]
}

// ── FAQ ───────────────────────────────────────────────────────────────────────

export interface FaqEntry {
  id:      string
  topic:   string
  q:       string
  a:       string
}

export interface FaqResponse {
  faqs:  FaqEntry[]
  topic: string | null
}

// ── Contact ───────────────────────────────────────────────────────────────────

export interface ContactInfo {
  email:   string
  phone:   string
  address: string
  hours:   string
  social?: Record<string, string>
}

// ── Navigation ────────────────────────────────────────────────────────────────

export type PageKey = 'home' | 'dashboard' | 'settings' | 'contact' | 'privacy' | 'terms'

export interface NavResult {
  url:   string
  label: string
}
