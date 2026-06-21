'use client'

import { useLanguage } from '@/lib/i18n'
import styles from './Rates.module.css'

// Rates mirror ShippingCalculator.tsx exactly (AMD/kg)
// AMD → USD at ~430 AMD = $1, shown as rounded $/kg for display
// null means that method isn't available for that country

interface RateRow {
  method: string
  icon:   string
  amd:    number
  days:   string
}

interface CountryRate {
  country:  string
  desc:     string
  featured: boolean
  rows:     RateRow[]
}

// flagcdn.com — free, reliable, no token needed
// 2-letter ISO 3166-1 alpha-2 code, 40px wide
const FLAG: Record<string, string> = {
  USA:     'https://flagcdn.com/w40/us.png',
  China:   'https://flagcdn.com/w40/cn.png',
  Germany: 'https://flagcdn.com/w40/de.png',
  UK:      'https://flagcdn.com/w40/gb.png',
  Italy:   'https://flagcdn.com/w40/it.png',
  UAE:     'https://flagcdn.com/w40/ae.png',
}

// Mirrors ShippingCalculator.tsx availableTypes EXACTLY:
// usa     → air, standard
// china   → air, standard, ground
// germany → air, ground
// uk      → air only
// italy   → ground only
// uae     → air only
const RATES: CountryRate[] = [
  {
    country: 'USA', featured: true,
    desc: 'Amazon, eBay, Walmart, Nike, Apple and all major US retailers.',
    rows: [
      { method: 'Air',      icon: '✈️', amd: 6200, days: '5–7 days'   },
      { method: 'Standard', icon: '📦', amd: 3900, days: '10–14 days' },
    ],
  },
  {
    country: 'China', featured: false,
    desc: 'Taobao, JD.com, Pinduoduo, AliExpress and Chinese marketplaces.',
    rows: [
      { method: 'Air',      icon: '✈️', amd: 5600, days: '7–10 days'  },
      { method: 'Standard', icon: '📦', amd: 3200, days: '14–21 days' },
      { method: 'Ground',   icon: '🚚', amd: 1900, days: '21–30 days' },
    ],
  },
  {
    country: 'Germany', featured: false,
    desc: 'German fashion, automotive parts, cosmetics and EU cross-border orders.',
    rows: [
      { method: 'Air',    icon: '✈️', amd: 6500, days: '4–6 days'   },
      { method: 'Ground', icon: '🚚', amd: 2700, days: '10–15 days' },
    ],
  },
  {
    country: 'UK', featured: false,
    desc: 'ASOS, Next, John Lewis, Marks & Spencer and all UK online stores.',
    rows: [
      { method: 'Air', icon: '✈️', amd: 6400, days: '4–6 days' },
    ],
  },
  {
    country: 'Italy', featured: false,
    desc: 'Luxury fashion, footwear, Zara, Gucci, Prada and Italian brands.',
    rows: [
      { method: 'Ground', icon: '🚚', amd: 2800, days: '12–18 days' },
    ],
  },
  {
    country: 'UAE', featured: false,
    desc: 'Noon, Namshi, Shein ME and regional brands — closest route to Armenia.',
    rows: [
      { method: 'Air', icon: '✈️', amd: 5000, days: '3–5 days' },
    ],
  },
]

// Convert AMD/kg to a display string in USD (rounded)
function amdToUsd(amd: number): string {
  const usd = amd / 430
  return usd < 10 ? `$${usd.toFixed(1)}` : `$${Math.round(usd)}`
}

export default function Rates() {
  const { t } = useLanguage()

  const RATES_TRANSLATED: CountryRate[] = [
    { country: 'USA',     featured: true,  desc: t('rates_usa_desc'),     rows: [{ method: t('method_air'), icon: '✈️', amd: 6200, days: '5–7 days' }, { method: t('method_standard'), icon: '📦', amd: 3900, days: '10–14 days' }] },
    { country: 'China',   featured: false, desc: t('rates_china_desc'),   rows: [{ method: t('method_air'), icon: '✈️', amd: 5600, days: '7–10 days' }, { method: t('method_standard'), icon: '📦', amd: 3200, days: '14–21 days' }, { method: t('method_ground'), icon: '🚚', amd: 1900, days: '21–30 days' }] },
    { country: 'Germany', featured: false, desc: t('rates_germany_desc'), rows: [{ method: t('method_air'), icon: '✈️', amd: 6500, days: '4–6 days' }, { method: t('method_ground'), icon: '🚚', amd: 2700, days: '10–15 days' }] },
    { country: 'UK',      featured: false, desc: t('rates_uk_desc'),      rows: [{ method: t('method_air'), icon: '✈️', amd: 6400, days: '4–6 days' }] },
    { country: 'Italy',   featured: false, desc: t('rates_italy_desc'),   rows: [{ method: t('method_ground'), icon: '🚚', amd: 2800, days: '12–18 days' }] },
    { country: 'UAE',     featured: false, desc: t('rates_uae_desc'),     rows: [{ method: t('method_air'), icon: '✈️', amd: 5000, days: '3–5 days' }] },
  ]

  return (
    <section className={styles.section} id="rates">
      <p className="section-label">{t('rates_label')}</p>
      <h2 className="section-title">{t('rates_title')}</h2>
      <p className={styles.sub}>{t('rates_sub')}</p>

      <div className={styles.grid}>
        {RATES_TRANSLATED.map((rate) => (
          <div
            key={rate.country}
            className={`${styles.card} ${rate.featured ? styles.featured : ''}`}
          >
            {rate.featured && <span className={styles.badge}>{t('rates_popular')}</span>}

            <div className={styles.cardHead}>
              <img
                src={FLAG[rate.country]}
                alt={rate.country}
                className={styles.flag}
                width={40}
                height={27}
              />
              <div>
                <p className={styles.from}>{t('rates_from')}</p>
                <p className={styles.country}>{rate.country}</p>
              </div>
            </div>

            <p className={styles.desc}>{rate.desc}</p>

            <div className={styles.methodTable}>
              {rate.rows.map(row => (
                <div key={row.method} className={styles.methodRow}>
                  <span className={styles.methodIcon}>{row.icon}</span>
                  <span className={styles.methodName}>{row.method}</span>
                  <span className={styles.methodPrice}>
                    {amdToUsd(row.amd)}<span className={styles.methodUnit}>/kg</span>
                  </span>
                  <span className={styles.methodDays}>{row.days}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className={styles.note}>{t('rates_note')}</p>
    </section>
  )
}
