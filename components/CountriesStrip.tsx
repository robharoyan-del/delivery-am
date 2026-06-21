'use client'

import { useLanguage } from '@/lib/i18n'
import styles from './CountriesStrip.module.css'

const WAREHOUSES = [
  { country: 'USA',     city: 'New York'   },
  { country: 'China',   city: 'Guangzhou'  },
  { country: 'Germany', city: 'Frankfurt'  },
  { country: 'UK',      city: 'London'     },
  { country: 'Italy',   city: 'Milan'      },
  { country: 'UAE',     city: 'Dubai'      },
]

export default function CountriesStrip() {
  const { t } = useLanguage()
  return (
    <div className={styles.strip}>
      <span className={styles.label}>{t('countries_warehouses_in')}</span>
      <div className={styles.list}>
        {WAREHOUSES.map(({ country, city }) => (
          <div key={country} className={styles.item}>
            <span className={styles.dot} />
            <span className={styles.country}>{country}</span>
            &nbsp;·&nbsp;{city}
          </div>
        ))}
      </div>
    </div>
  )
}
