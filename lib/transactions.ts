import { supabase } from './supabase'

// ── Types ─────────────────────────────────────────────────────────────────────
export type TxType   = 'payment' | 'refund' | 'charge' | 'topup'
export type TxStatus = 'pending' | 'completed' | 'failed'

export interface Transaction {
  id:          string
  user_id:     string
  type:        TxType
  amount:      number
  currency:    string
  status:      TxStatus
  description: string | null
  reference:   string | null
  parcel_id:   string | null
  created_at:  string
}

// ── Display config ─────────────────────────────────────────────────────────────
export const TX_TYPE_CONFIG: Record<TxType, {
  label: string; icon: string; color: string; bg: string; sign: string
}> = {
  payment: { label: 'Payment',   icon: '💳', color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)', sign: '-' },
  charge:  { label: 'Charge',    icon: '📦', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  sign: '-' },
  refund:  { label: 'Refund',    icon: '↩️', color: '#4ade80', bg: 'rgba(74,222,128,0.1)',  sign: '+' },
  topup:   { label: 'Top-up',    icon: '⬆️', color: '#00D4FF', bg: 'rgba(0,212,255,0.1)',   sign: '+' },
}

export const TX_STATUS_CONFIG: Record<TxStatus, {
  label: string; color: string; bg: string
}> = {
  pending:   { label: 'Pending',   color: '#fbbf24', bg: 'rgba(251,191,36,0.1)'  },
  completed: { label: 'Completed', color: '#4ade80', bg: 'rgba(74,222,128,0.1)'  },
  failed:    { label: 'Failed',    color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)' },
}

// ── Currency list (shared with parcels) ───────────────────────────────────────
export const TX_CURRENCIES = [
  { code: 'AMD', symbol: '֏',   label: 'AMD — Armenian Dram' },
  { code: 'USD', symbol: '$',   label: 'USD — US Dollar'      },
  { code: 'EUR', symbol: '€',   label: 'EUR — Euro'            },
  { code: 'GBP', symbol: '£',   label: 'GBP — British Pound'  },
  { code: 'CNY', symbol: '¥',   label: 'CNY — Chinese Yuan'   },
  { code: 'AED', symbol: 'د.إ', label: 'AED — UAE Dirham'     },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
export function formatAmount(amount: number, currency: string, type: TxType): string {
  const cur  = TX_CURRENCIES.find(c => c.code === currency)
  const sym  = cur?.symbol ?? currency
  const sign = TX_TYPE_CONFIG[type].sign
  const abs  = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: currency === 'AMD' ? 0 : 2,
    maximumFractionDigits: currency === 'AMD' ? 0 : 2,
  })
  return `${sign}${sym}${abs}`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  })
}

// ── Supabase CRUD ─────────────────────────────────────────────────────────────
export async function fetchTransactions(userId: string): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Transaction[]
}

export async function addTransaction(
  userId: string,
  payload: {
    type:        TxType
    amount:      number
    currency:    string
    status:      TxStatus
    description: string | null
    reference:   string | null
    parcel_id:   string | null
  }
): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .insert({ ...payload, user_id: userId })
    .select()
    .single()

  if (error) throw error
  return data as Transaction
}
