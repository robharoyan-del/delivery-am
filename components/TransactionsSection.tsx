'use client'

import { useState, useEffect, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import type { Parcel } from '@/lib/parcels'
import {
  fetchTransactions, formatAmount, formatDate, formatTime,
  TX_TYPE_CONFIG, TX_STATUS_CONFIG,
  type Transaction, type TxType,
} from '@/lib/transactions'
import { useLanguage } from '@/lib/i18n'
import AddTransactionModal from './AddTransactionModal'
import styles from './TransactionsSection.module.css'

interface Props {
  user:    User
  parcels: Parcel[]
}

type Filter = 'all' | TxType

export default function TransactionsSection({ user, parcels }: Props) {
  const { t } = useLanguage()
  const [txs,       setTxs]       = useState<Transaction[]>([])
  const [loading,   setLoading]   = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [filter,    setFilter]    = useState<Filter>('all')
  const [expanded,  setExpanded]  = useState<string | null>(null)

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all',     label: t('tx_filter_all')     },
    { key: 'payment', label: t('tx_filter_payments') },
    { key: 'charge',  label: t('tx_filter_charges')  },
    { key: 'topup',   label: t('tx_filter_topups')   },
    { key: 'refund',  label: t('tx_filter_refunds')  },
  ]

  const load = useCallback(async () => {
    try {
      const data = await fetchTransactions(user.id)
      setTxs(data)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [user.id])

  useEffect(() => { load() }, [load])

  function handleSaved(t: Transaction) {
    setTxs(prev => [t, ...prev])
    setModalOpen(false)
  }

  const filtered = filter === 'all' ? txs : txs.filter(t => t.type === filter)

  // Summary stats
  const totalIn  = txs.filter(t => t.type === 'topup'   || t.type === 'refund').reduce((s, t) => s + t.amount, 0)
  const totalOut = txs.filter(t => t.type === 'payment' || t.type === 'charge').reduce((s, t) => s + t.amount, 0)
  const pending  = txs.filter(t => t.status === 'pending').length

  return (
    <div className={styles.section} id="transactions">

      {/* Header */}
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{t('tx_eyebrow')}</p>
          <h2 className={styles.title}>{t('tx_title')}</h2>
        </div>
        <button className={styles.addBtn} onClick={() => setModalOpen(true)}>
          {t('tx_add')}
        </button>
      </div>

      {/* Summary cards */}
      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>{t('tx_total_payments')}</span>
          <span className={styles.summaryVal} style={{ color: '#ff6b6b' }}>
            −{totalOut.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>{t('tx_total_received')}</span>
          <span className={styles.summaryVal} style={{ color: '#4ade80' }}>
            +{totalIn.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>{t('tx_transactions')}</span>
          <span className={styles.summaryVal}>{txs.length}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>{t('tx_pending')}</span>
          <span className={styles.summaryVal} style={{ color: pending > 0 ? '#fbbf24' : 'var(--text)' }}>
            {pending}
          </span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className={styles.filters}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`${styles.filterBtn} ${filter === f.key ? styles.filterBtnActive : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            {f.key !== 'all' && (
              <span className={styles.filterCount}>
                {txs.filter(t => t.type === f.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className={styles.skeletons}>
          {[1,2,3].map(i => <div key={i} className={styles.skeleton} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>💸</div>
          <p className={styles.emptyTitle}>{t('tx_empty_title')}</p>
          <p className={styles.emptyDesc}>
            {filter === 'all'
              ? t('tx_empty_desc_all')
              : t('tx_empty_desc_filter', { filter })}
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map(tx => {
            const typeCfg   = TX_TYPE_CONFIG[tx.type]
            const statusCfg = TX_STATUS_CONFIG[tx.status]
            const isOpen    = expanded === tx.id
            const linkedParcel = parcels.find(p => p.id === tx.parcel_id)

            return (
              <div key={tx.id} className={styles.card}>
                <div className={styles.cardMain} onClick={() => setExpanded(isOpen ? null : tx.id)}>

                  {/* Icon */}
                  <div className={styles.txIcon} style={{ background: typeCfg.bg }}>
                    {typeCfg.icon}
                  </div>

                  {/* Info */}
                  <div className={styles.txInfo}>
                    <div className={styles.txTop}>
                      <span className={styles.txType}>{typeCfg.label}</span>
                      {tx.description && (
                        <span className={styles.txDesc}>{tx.description}</span>
                      )}
                    </div>
                    <div className={styles.txMeta}>
                      <span className={styles.txDate}>{formatDate(tx.created_at)} · {formatTime(tx.created_at)}</span>
                      {tx.reference && (
                        <span className={styles.txRef}>#{tx.reference}</span>
                      )}
                    </div>
                  </div>

                  {/* Right */}
                  <div className={styles.txRight}>
                    <span
                      className={styles.txAmount}
                      style={{ color: typeCfg.color }}
                    >
                      {formatAmount(tx.amount, tx.currency, tx.type)}
                    </span>
                    <span
                      className={styles.txStatus}
                      style={{ color: statusCfg.color, background: statusCfg.bg }}
                    >
                      {statusCfg.label}
                    </span>
                    <span className={styles.chevron} style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}>›</span>
                  </div>
                </div>

                {/* Expanded details */}
                {isOpen && (
                  <div className={styles.expanded}>
                    <div className={styles.expandedDivider} />
                    <div className={styles.detailGrid}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('tx_detail_type')}</span>
                        <span className={styles.detailVal}>{typeCfg.icon} {typeCfg.label}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('tx_detail_amount')}</span>
                        <span className={styles.detailVal} style={{ color: typeCfg.color }}>
                          {formatAmount(tx.amount, tx.currency, tx.type)} {tx.currency}
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('tx_detail_status')}</span>
                        <span className={styles.detailVal}>{statusCfg.label}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('tx_detail_date')}</span>
                        <span className={styles.detailVal}>{formatDate(tx.created_at)}</span>
                      </div>
                      {tx.reference && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>{t('tx_detail_reference')}</span>
                          <span className={styles.detailVal}>{tx.reference}</span>
                        </div>
                      )}
                      {linkedParcel && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>{t('tx_detail_linked')}</span>
                          <span className={styles.detailVal}>{linkedParcel.shop} · {linkedParcel.country.toUpperCase()}</span>
                        </div>
                      )}
                      {tx.description && (
                        <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
                          <span className={styles.detailLabel}>{t('tx_detail_description')}</span>
                          <span className={styles.detailVal}>{tx.description}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <AddTransactionModal
          userId={user.id}
          parcels={parcels}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
