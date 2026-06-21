'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/i18n'
import CustomSelect from './CustomSelect'
import styles from './ShippingCalculator.module.css'

// ── Types ──────────────────────────────────────────────────────────────────────
type Country = 'usa' | 'china' | 'germany' | 'uk' | 'italy' | 'uae'
type ShipType = 'air' | 'standard' | 'ground'
type Currency = 'EUR' | 'USD' | 'AMD' | 'GBP' | 'CNY'

// ── Rates in AMD / kg ─────────────────────────────────────────────────────────
const RATES: Record<Country, { name: string; air: number; standard: number; ground: number }> = {
  usa:     { name: 'USA',     air: 6200, standard: 3900, ground: 2200 },
  china:   { name: 'China',   air: 5600, standard: 3200, ground: 1900 },
  germany: { name: 'Germany', air: 6500, standard: 4200, ground: 2700 },
  uk:      { name: 'UK',      air: 6400, standard: 4100, ground: 2600 },
  italy:   { name: 'Italy',   air: 6600, standard: 4300, ground: 2800 },
  uae:     { name: 'UAE',     air: 5000, standard: 3400, ground: 2300 },
}

// Which shipping types are available per country
const AVAILABLE_TYPES: Record<Country, ShipType[]> = {
  usa:     ['air', 'standard'],
  china:   ['air', 'standard', 'ground'],
  germany: ['air', 'ground'],
  uk:      ['air'],
  italy:   ['ground'],
  uae:     ['air'],
}

// ── Currencies ────────────────────────────────────────────────────────────────
const CURRENCIES: Record<Currency, { symbol: string; toEUR: number; decimals: number }> = {
  EUR: { symbol: '€',  toEUR: 1,         decimals: 2 },
  USD: { symbol: '$',  toEUR: 0.92,      decimals: 2 },
  AMD: { symbol: '֏', toEUR: 1 / 430,   decimals: 0 },
  GBP: { symbol: '£',  toEUR: 1.17,      decimals: 2 },
  CNY: { symbol: '¥',  toEUR: 0.127,     decimals: 2 },
}

const TAX_FREE_LIMIT_EUR = 200
const TAX_RATE = 0.15

// ── Helpers ───────────────────────────────────────────────────────────────────
function toEUR(amount: number, currency: Currency) {
  return amount * CURRENCIES[currency].toEUR
}
function fromEUR(amountEUR: number, currency: Currency) {
  return amountEUR / CURRENCIES[currency].toEUR
}
function fmt(value: number, currency: Currency) {
  const { symbol, decimals } = CURRENCIES[currency]
  // Use a fixed locale ('en-US') so server and client always render identically.
  // toLocaleString() without a pinned locale uses the runtime locale, which
  // differs between Node (server) and the user's browser → hydration mismatch.
  const formatted = Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  if (currency === 'AMD') return formatted + ' ֏'
  return symbol + formatted
}

const COUNTRIES: { key: Country; label: string }[] = [
  { key: 'usa',     label: 'USA'     },
  { key: 'china',   label: 'China'   },
  { key: 'germany', label: 'Germany' },
  { key: 'uk',      label: 'UK'      },
  { key: 'italy',   label: 'Italy'   },
  { key: 'uae',     label: 'UAE'     },
]

// Labels resolved inside component via t()
const ALL_TYPE_KEYS: ShipType[] = ['air', 'standard', 'ground']

const CURRENCY_OPTIONS: Currency[] = ['EUR', 'USD', 'AMD', 'GBP', 'CNY']

export default function ShippingCalculator() {
  const { t } = useLanguage()
  const [country, setCountry]   = useState<Country>('usa')
  const [shipType, setShipType] = useState<ShipType>('air')
  const [currency, setCurrency] = useState<Currency>('EUR')
  const [weight,   setWeight]   = useState('')
  const [price,    setPrice]    = useState('')
  const [length,   setLength]   = useState('')
  const [width,    setWidth]    = useState('')
  const [height,   setHeight]   = useState('')

  // Switch country — auto-fix shipType if no longer available
  function handleCountryChange(c: Country) {
    setCountry(c)
    const allowed = AVAILABLE_TYPES[c]
    if (!allowed.includes(shipType)) {
      setShipType(allowed[0])
    }
  }

  // ── Core calc (mirrors robb.html exactly) ──────────────────────────────────
  const realWeight   = parseFloat(weight) || 0
  const parcelPrice  = parseFloat(price)  || 0
  const l = parseFloat(length) || 0
  const w = parseFloat(width)  || 0
  const h = parseFloat(height) || 0

  // Volumetric weight: L × W × H / 5000
  const volumeWeight     = l && w && h ? (l * w * h) / 5000 : 0
  const chargeWeight     = Math.max(realWeight, volumeWeight)
  // Round UP to nearest 0.1 kg
  const roundedCharge    = chargeWeight > 0 ? Math.ceil(chargeWeight * 10) / 10 : 0

  // Shipping: rate is AMD/kg → convert AMD→EUR→selected currency
  const shippingAMD      = roundedCharge * RATES[country][shipType]
  const shippingEUR      = toEUR(shippingAMD, 'AMD')
  const shippingDisplay  = fromEUR(shippingEUR, currency)

  // Tax: product value in selected currency → convert to EUR → tax on amount over €200
  const parcelPriceEUR   = toEUR(parcelPrice, currency)
  const taxableExtraEUR  = Math.max(parcelPriceEUR - TAX_FREE_LIMIT_EUR, 0)
  const taxEUR           = taxableExtraEUR * TAX_RATE

  const taxFreeLimitDisplay   = fromEUR(TAX_FREE_LIMIT_EUR, currency)
  const taxableExtraDisplay   = fromEUR(taxableExtraEUR, currency)
  const taxDisplay            = fromEUR(taxEUR, currency)
  const totalDisplay          = shippingDisplay + taxDisplay

  const availableTypes = AVAILABLE_TYPES[country]
  const typeLabel: Record<ShipType, string> = {
    air: t('method_air'), standard: t('method_standard'), ground: t('method_ground'),
  }

  return (
    <div className={styles.card} id="calculator">
      <div className={styles.topLine} />

      <div className={styles.header}>
        <div>
          <p className={styles.title}>{t('calc_title')}</p>
          <p className={styles.sub}>{t('calc_sub')}</p>
        </div>
        <div className={styles.icon}>📦</div>
      </div>

      {/* Country tabs */}
      <div className={styles.pillGroup}>
        {COUNTRIES.map(({ key, label }) => (
          <button
            key={key}
            className={`pill ${country === key ? 'active' : ''}`}
            onClick={() => handleCountryChange(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Shipping type tabs — only show available ones */}
      <div className={styles.pillGroup} style={{ marginTop: 8 }}>
        {ALL_TYPE_KEYS.filter(k => availableTypes.includes(k)).map((key) => (
          <button
            key={key}
            className={`pill ${shipType === key ? 'active' : ''}`}
            onClick={() => setShipType(key)}
          >
            {typeLabel[key]}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className={styles.grid}>
        <div>
          <p className={styles.label}>{t('calc_weight')}</p>
          <input className="field-input" type="number" min="0" step="0.1"
            placeholder="e.g. 1.5" value={weight}
            onChange={e => setWeight(e.target.value)} />
        </div>

        <div>
          <p className={styles.label}>{t('calc_value')}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="field-input" type="number" min="0" step="1"
              placeholder="e.g. 250" value={price}
              onChange={e => setPrice(e.target.value)}
              style={{ flex: 1, minWidth: 0 }} />
            <div style={{ width: 100, flexShrink: 0 }}>
              <CustomSelect
                options={CURRENCY_OPTIONS.map(c => ({ value: c, label: c }))}
                value={currency}
                onChange={v => setCurrency(v as Currency)}
                compact
              />
            </div>
          </div>
        </div>

        <div>
          <p className={styles.label}>{t('calc_length')}</p>
          <input className="field-input" type="number" min="0"
            placeholder="30" value={length}
            onChange={e => setLength(e.target.value)} />
        </div>

        <div>
          <p className={styles.label}>{t('calc_width')}</p>
          <input className="field-input" type="number" min="0"
            placeholder="20" value={width}
            onChange={e => setWidth(e.target.value)} />
        </div>

        <div>
          <p className={styles.label}>{t('calc_height')}</p>
          <input className="field-input" type="number" min="0"
            placeholder="15" value={height}
            onChange={e => setHeight(e.target.value)} />
        </div>
      </div>

      {/* Summary */}
      <div className={styles.summary}>
        <div className={styles.resultRow}>
          <span className={styles.resultKey}>{t('calc_vol_weight')}</span>
          <span className={styles.resultVal}>{volumeWeight.toFixed(2)} {t('calc_kg')}</span>
        </div>
        <div className={styles.resultRow}>
          <span className={styles.resultKey}>{t('calc_charge_weight')}</span>
          <span className={styles.resultVal}>{roundedCharge.toFixed(1)} {t('calc_kg')}</span>
        </div>
        <div className={styles.resultRow}>
          <span className={styles.resultKey}>{t('calc_shipping')}</span>
          <span className={styles.resultVal}>{fmt(shippingDisplay, currency)}</span>
        </div>
        <div className={styles.resultRow}>
          <span className={styles.resultKey}>{t('calc_duty_free')}</span>
          <span className={styles.resultVal}>{fmt(taxFreeLimitDisplay, currency)}</span>
        </div>
        <div className={styles.resultRow}>
          <span className={styles.resultKey}>{t('calc_taxable')}</span>
          <span className={styles.resultVal}>{fmt(taxableExtraDisplay, currency)}</span>
        </div>
        <div className={styles.resultRow}>
          <span className={styles.resultKey}>{t('calc_duty')}</span>
          <span className={styles.resultVal}>{fmt(taxDisplay, currency)}</span>
        </div>
        <div className={`${styles.resultRow} ${styles.total}`}>
          <span>{t('calc_total')}</span>
          <span className={styles.resultAccent}>{fmt(totalDisplay, currency)}</span>
        </div>
      </div>

      <p className={styles.taxNote}>
        {t('calc_tax_note', { limit: fmt(taxFreeLimitDisplay, currency) })}
      </p>
    </div>
  )
}
