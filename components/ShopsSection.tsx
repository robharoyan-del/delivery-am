'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/i18n'
import styles from './ShopsSection.module.css'

// Inline SVG brand logos — no external API, always works
const SHOPS = [
  {
    name: 'Amazon',
    url: 'https://www.amazon.com',
    logo: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <text y="55" x="50" textAnchor="middle" fontSize="42" fontWeight="bold" fontFamily="Arial" fill="#FF9900">a</text>
        <path d="M20 68 Q50 80 80 68" stroke="#FF9900" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d="M76 64 L82 70 L76 72" fill="#FF9900"/>
      </svg>
    ),
    bg: '#ffffff',
  },
  {
    name: 'eBay',
    url: 'https://www.ebay.com',
    logo: (
      <svg viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
        <text y="34" x="2" fontSize="40" fontWeight="900" fontFamily="Arial" fill="#E53238">e</text>
        <text y="34" x="24" fontSize="40" fontWeight="900" fontFamily="Arial" fill="#0064D2">b</text>
        <text y="34" x="47" fontSize="40" fontWeight="900" fontFamily="Arial" fill="#F5AF02">a</text>
        <text y="34" x="68" fontSize="40" fontWeight="900" fontFamily="Arial" fill="#86B817">y</text>
      </svg>
    ),
    bg: '#ffffff',
  },
  {
    name: 'Zara',
    url: 'https://www.zara.com',
    logo: (
      <svg viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg">
        <text y="26" x="50" textAnchor="middle" fontSize="26" fontWeight="900" fontFamily="Arial" letterSpacing="4" fill="#000000">ZARA</text>
      </svg>
    ),
    bg: '#ffffff',
  },
  {
    name: 'Nike',
    url: 'https://www.nike.com',
    logo: (
      <svg viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 30 Q40 5 95 10 Q70 20 30 35 Q15 40 5 30Z" fill="#000000"/>
      </svg>
    ),
    bg: '#ffffff',
  },
  {
    name: 'Adidas',
    url: 'https://www.adidas.com',
    logo: (
      <svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,5 95,75 5,75" fill="none" stroke="#000" strokeWidth="10"/>
        <line x1="27" y1="75" x2="50" y2="33" stroke="#000" strokeWidth="10"/>
        <line x1="73" y1="75" x2="50" y2="33" stroke="#000" strokeWidth="10"/>
      </svg>
    ),
    bg: '#ffffff',
  },
  {
    name: 'Apple',
    url: 'https://www.apple.com',
    logo: (
      <svg viewBox="0 0 814 1000" xmlns="http://www.w3.org/2000/svg">
        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.3-155.5-127.1C46.7 790.7 0 663 0 541.8c0-207.8 135.7-317.9 269-317.9 70.5 0 129.5 46.5 170.4 46.5 39.5 0 107.1-49 185.8-49 30.1 0 110.7 2.6 168.4 98.3zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" fill="#555"/>
      </svg>
    ),
    bg: '#ffffff',
  },
  {
    name: 'IKEA',
    url: 'https://www.ikea.com',
    logo: (
      <svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="50" fill="#0058A3" rx="4"/>
        <text y="37" x="50" textAnchor="middle" fontSize="28" fontWeight="900" fontFamily="Arial" fill="#FFDA1A" letterSpacing="2">IKEA</text>
      </svg>
    ),
    bg: '#0058A3',
  },
  {
    name: 'Shein',
    url: 'https://www.shein.com',
    logo: (
      <svg viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
        <text y="32" x="50" textAnchor="middle" fontSize="28" fontWeight="900" fontFamily="Arial" fill="#E23744" letterSpacing="1">SHEIN</text>
      </svg>
    ),
    bg: '#ffffff',
  },
  {
    name: 'H&M',
    url: 'https://www.hm.com',
    logo: (
      <svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="50" fill="#E50010" rx="4"/>
        <text y="38" x="50" textAnchor="middle" fontSize="30" fontWeight="900" fontFamily="Arial" fill="#ffffff">H&amp;M</text>
      </svg>
    ),
    bg: '#E50010',
  },
  {
    name: 'Ray-Ban',
    url: 'https://www.ray-ban.com',
    logo: (
      <svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
        <text y="20" x="50" textAnchor="middle" fontSize="13" fontWeight="900" fontFamily="Arial" fill="#CC0000" letterSpacing="2">RAY-BAN</text>
        <ellipse cx="28" cy="36" rx="20" ry="11" fill="none" stroke="#333" strokeWidth="3"/>
        <ellipse cx="72" cy="36" rx="20" ry="11" fill="none" stroke="#333" strokeWidth="3"/>
        <line x1="48" y1="36" x2="52" y2="36" stroke="#333" strokeWidth="3"/>
        <line x1="5" y1="32" x2="8" y2="36" stroke="#333" strokeWidth="3"/>
        <line x1="92" y1="32" x2="95" y2="36" stroke="#333" strokeWidth="3"/>
      </svg>
    ),
    bg: '#ffffff',
  },
  {
    name: 'Samsung',
    url: 'https://www.samsung.com',
    logo: (
      <svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
        <text y="38" x="100" textAnchor="middle" fontSize="34" fontWeight="700" fontFamily="Arial" fill="#1428A0" letterSpacing="1">SAMSUNG</text>
      </svg>
    ),
    bg: '#ffffff',
  },
  {
    name: 'Walmart',
    url: 'https://www.walmart.com',
    logo: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(50,50)">
          {[0,60,120,180,240,300].map((angle, i) => (
            <ellipse key={i} cx={Math.cos((angle-90)*Math.PI/180)*22} cy={Math.sin((angle-90)*Math.PI/180)*22} rx="7" ry="16" transform={`rotate(${angle})`} fill="#FFC220"/>
          ))}
        </g>
        <text y="88" x="50" textAnchor="middle" fontSize="14" fontWeight="700" fontFamily="Arial" fill="#0071CE">walmart</text>
      </svg>
    ),
    bg: '#ffffff',
  },
  {
    name: 'Farfetch',
    url: 'https://www.farfetch.com',
    logo: (
      <svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
        <text y="38" x="100" textAnchor="middle" fontSize="28" fontWeight="900" fontFamily="Arial" fill="#000000" letterSpacing="1">FARFETCH</text>
      </svg>
    ),
    bg: '#ffffff',
  },
  {
    name: 'ASOS',
    url: 'https://www.asos.com',
    logo: (
      <svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="50" fill="#000000" rx="4"/>
        <text y="36" x="50" textAnchor="middle" fontSize="28" fontWeight="900" fontFamily="Arial" fill="#ffffff" letterSpacing="2">ASOS</text>
      </svg>
    ),
    bg: '#000000',
  },
  {
    name: 'Sephora',
    url: 'https://www.sephora.com',
    logo: (
      <svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="50" fill="#000000" rx="4"/>
        <text y="36" x="100" textAnchor="middle" fontSize="24" fontWeight="900" fontFamily="Arial" fill="#ffffff" letterSpacing="3">SEPHORA</text>
      </svg>
    ),
    bg: '#000000',
  },
]

export default function ShopsSection() {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')

  const filtered = SHOPS.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <section className={styles.section} id="shops">
      <div className={styles.head}>
        <div>
          <p className="section-label">{t('shops_label')}</p>
          <h2 className="section-title">{t('shops_title')}</h2>
        </div>
        <p className={styles.desc}>{t('shops_desc')}</p>
      </div>

      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          type="text"
          placeholder={t('shops_search')}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {query && (
          <button className={styles.clearBtn} onClick={() => setQuery('')}>✕</button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className={styles.empty}>{t('shops_empty', { query })}</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map(shop => (
            <a key={shop.name} className={styles.card} href={shop.url} target="_blank" rel="noopener noreferrer">
              <div className={styles.logoWrap} style={{ background: shop.bg }}>
                {shop.logo}
              </div>
              <span className={styles.shopName}>{shop.name}</span>
            </a>
          ))}
        </div>
      )}
    </section>
  )
}
