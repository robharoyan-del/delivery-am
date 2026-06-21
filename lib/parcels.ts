import { supabase } from './supabase'

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Parcel {
  id:          string
  user_id:     string
  country:     string
  shop:        string
  ship_method: string
  tracking:    string | null
  price:       number | null
  currency:    string
  description: string | null
  status:      ParcelStatus
  created_at:  string
  updated_at:  string
}

export type ParcelStatus = 'registered' | 'in_transit' | 'customs' | 'delivered'

// ── Country options (mirrors WAREHOUSE_COUNTRIES) ─────────────────────────────
export const PARCEL_COUNTRIES = [
  { key: 'usa',     flag: 'https://flagcdn.com/w40/us.png', label: 'USA'            },
  { key: 'china',   flag: 'https://flagcdn.com/w40/cn.png', label: 'China'          },
  { key: 'germany', flag: 'https://flagcdn.com/w40/de.png', label: 'Germany'        },
  { key: 'uk',      flag: 'https://flagcdn.com/w40/gb.png', label: 'United Kingdom' },
  { key: 'italy',   flag: 'https://flagcdn.com/w40/it.png', label: 'Italy'          },
  { key: 'uae',     flag: 'https://flagcdn.com/w40/ae.png', label: 'UAE'            },
]

// ── Shop options ──────────────────────────────────────────────────────────────
export const PARCEL_SHOPS = [
  'Amazon', 'eBay', 'Zara', 'Nike', 'Adidas', 'Apple', 'IKEA',
  'Shein', 'H&M', 'Ray-Ban', 'Samsung', 'Walmart', 'Farfetch',
  'ASOS', 'Sephora', 'Other',
]

// ── Shipping methods (per country) ────────────────────────────────────────────
export const SHIP_METHODS: Record<string, { key: string; label: string; days: string }[]> = {
  usa:     [
    { key: 'air',      label: 'Air',      days: '5–7 days'  },
    { key: 'standard', label: 'Standard', days: '10–14 days' },
  ],
  china:   [
    { key: 'air',      label: 'Air',      days: '7–10 days'  },
    { key: 'standard', label: 'Standard', days: '14–21 days' },
    { key: 'ground',   label: 'Ground',   days: '21–30 days' },
  ],
  germany: [
    { key: 'air',      label: 'Air',      days: '4–6 days'  },
    { key: 'ground',   label: 'Ground',   days: '8–12 days' },
  ],
  uk:      [
    { key: 'air',      label: 'Air',      days: '4–6 days'  },
  ],
  italy:   [
    { key: 'ground',   label: 'Ground',   days: '7–10 days' },
  ],
  uae:     [
    { key: 'air',      label: 'Air',      days: '3–5 days'  },
  ],
}

// ── Currencies ────────────────────────────────────────────────────────────────
export const CURRENCIES = [
  { code: 'USD', symbol: '$',  label: 'USD — US Dollar'       },
  { code: 'EUR', symbol: '€',  label: 'EUR — Euro'             },
  { code: 'GBP', symbol: '£',  label: 'GBP — British Pound'   },
  { code: 'CNY', symbol: '¥',  label: 'CNY — Chinese Yuan'    },
  { code: 'AMD', symbol: '֏', label: 'AMD — Armenian Dram'   },
  { code: 'AED', symbol: 'د.إ', label: 'AED — UAE Dirham'    },
]

// ── Status config ─────────────────────────────────────────────────────────────
export const STATUS_CONFIG: Record<ParcelStatus, { label: string; color: string; bg: string; icon: string }> = {
  registered: { label: 'Registered',  color: '#8888A0', bg: 'rgba(136,136,160,0.1)',  icon: '📋' },
  in_transit: { label: 'In Transit',  color: '#00D4FF', bg: 'rgba(0,212,255,0.1)',    icon: '✈️' },
  customs:    { label: 'In Customs',  color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',   icon: '🛃' },
  delivered:  { label: 'Delivered',   color: '#4ade80', bg: 'rgba(74,222,128,0.1)',   icon: '✅' },
}

// ── Supabase helpers ──────────────────────────────────────────────────────────
export async function fetchParcels(userId: string): Promise<Parcel[]> {
  const { data, error } = await supabase
    .from('parcels')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Parcel[]
}

export async function addParcel(
  userId: string,
  payload: Omit<Parcel, 'id' | 'user_id' | 'status' | 'created_at' | 'updated_at'>
): Promise<Parcel> {
  const { data, error } = await supabase
    .from('parcels')
    .insert({ ...payload, user_id: userId, status: 'registered' })
    .select()
    .single()

  if (error) throw error
  return data as Parcel
}

export async function deleteParcel(id: string): Promise<void> {
  const { error } = await supabase.from('parcels').delete().eq('id', id)
  if (error) throw error
}

export async function updateParcelStatus(id: string, status: ParcelStatus): Promise<void> {
  const { error } = await supabase.from('parcels').update({ status }).eq('id', id)
  if (error) throw error
}
