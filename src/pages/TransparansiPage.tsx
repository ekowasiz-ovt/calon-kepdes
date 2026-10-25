import { useMemo, useState } from 'react'
import { ArrowUpRight, Bank, Wallet } from '@phosphor-icons/react'
import { useToast } from '../components/ui/Toast'
import { LabelStatus } from '../components/ui/LabelStatus'
import { useAnggaran } from '../hooks/useAnggaran'
import { rupiah } from '../lib/format'
import type { AnggaranItemRow } from '../types/db'

// brand data ramp: green → gold → neutral (charts are data, not decoration)
const dataRamp = ['#0b3d2e', '#14664a', '#1e7a54', '#c08a2e', '#8a9890']
const incomeColors = dataRamp
const expenseColors = dataRamp

function allocatePercentages(items: AnggaranItemRow[]) {
  const total = items.reduce((sum, item) => sum + Number(item.nominal), 0)
  if (!total || items.length === 0) return items.map(() => 0)

  const exact = items.map((item) => (Number(item.nominal) / total) * 100)
  const roundedDown = exact.map(Math.floor)
  let remaining = 100 - roundedDown.reduce((sum, value) => sum + value, 0)
  const remainders = exact
    .map((value, index) => ({ index, remainder: value - roundedDown[index] }))
    .sort((left, right) => right.remainder - left.remainder)

  for (let index = 0; index < remaining; index += 1) {
    roundedDown[remainders[index].index] += 1
  }

  return roundedDown
}

function BudgetLegend({ items, colors }: { items: AnggaranItemRow[]; colors: string[] }) {
  const percentages = allocatePercentages(items)

  if (items.length === 0) {
    return <p className="transparency-empty">Belum ada rincian anggaran.</p>
  }

  return (
    <ul className="budget-legend">
      {items.map((item, index) => (
        <li className="budget-legend__item" key={item.id}>
          <span className="budget-legend__swatch" style={{ background: colors[index % colors.length] }} aria-hidden="true" />
          <span className="budget-legend__name">{item.nama}</span>
          <span className="budget-legend__amount">{rupiah(item.nominal)}</span>
          <strong>{percentages[index]}%</strong>
        </li>
      ))}
    </ul>
  )
}

function StackedBar({ items, colors }: { items: AnggaranItemRow[]; colors: string[] }) {
  const percentages = allocatePercentages(items)

  return (
    <div className="budget-stacked-bar" role="img" aria-label="Komposisi anggaran">
      {items.map((item, index) => percentages[index] > 0 && (
        <span
          key={item.id}
          style={{ width: `${percentages[index]}%`, background: colors[index % colors.length] }}
          title={`${item.nama}: ${percentages[index]}%`}
        />
      ))}
    </div>
  )
}

function BudgetDonut({ items, colors }: { items: AnggaranItemRow[]; colors: string[] }) {
  const percentages = allocatePercentages(items)
  let cursor = 0
  const stops = items.map((_, index) => {
    const start = cursor
    cursor += percentages[index]
    return `${colors[index % colors.length]} ${start}% ${cursor}%`
  })

  return (
    <div className="budget-donut" role="img" aria-label="Distribusi belanja desa">
      <span className="budget-donut__center">
        <Wallet size={19} aria-hidden="true" />
      </span>
      <span className="visually-hidden">{items.length ? 'Distribusi belanja desa' : 'Belum ada rincian belanja'}</span>
      <span className="budget-donut__paint" style={{ background: stops.length ? `conic-gradient(${stops.join(', ')})` : '#e3e4e0' }} />
    </div>
  )
}

function RealisasiTable({ rows }: { rows: { id: string; bidang: string; pagu: number; realisasi: number }[] }) {
  if (rows.length === 0) {
    return <p className="transparency-empty">Belum ada data pagu dan realisasi untuk tahun ini.</p>
  }

  return (
    <div className="realisasi-table-wrap">
      <table className="realisasi-table">
        <thead>
          <tr><th>Bidang</th><th>Pagu</th><th>Realisasi</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <th scope="row">{row.bidang}</th>
              <td>{rupiah(row.pagu)}</td>
              <td>{rupiah(row.realisasi)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function TransparansiPage() {
  const [tab, setTab] = useState<'apbdes' | 'pembangunan' | 'realisasi'>('pembangunan')
  const [year, setYear] = useState(2025)
  const { data, isLoading, isError, error } = useAnggaran(year)
  const { showToast } = useToast()
  const income = useMemo(() => (data?.item ?? []).filter((item) => item.jenis === 'pendapatan'), [data])
  const expenses = useMemo(() => (data?.item ?? []).filter((item) => item.jenis === 'belanja'), [data])
  const incomeTotal = income.reduce((sum, item) => sum + Number(item.nominal), 0)
  const expenseTotal = expenses.reduce((sum, item) => sum + Number(item.nominal), 0)

  return (
    <div className="transparency-page kampanye__shell">
      <div className="kampanye-page-head">
        <span className="kampanye-eyebrow">Transparansi</span>
        <div className="kampanye-rule" aria-hidden="true" />
        <h1>Transparansi Desa</h1>
        <p className="kampanye-lead">
          Ringkasan anggaran desa dan realisasi pembangunan sebagai bentuk keterbukaan informasi.
        </p>
      </div>

      <LabelStatus block netral>
        Data APBDes tahun anggaran 2025. Sumber: SIKD DJPK. Jika terpilih, laporan ini diperbarui tiap triwulan.
        Situs ini belum merupakan layanan resmi Pemerintah Desa Karanganyar.
      </LabelStatus>

      <div className="transparency-tabs" role="tablist" aria-label="Informasi anggaran">
        {([
          ['apbdes', 'APBDes'],
          ['pembangunan', 'Pembangunan'],
          ['realisasi', 'Realisasi'],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            className={tab === value ? 'transparency-tabs__item transparency-tabs__item--active' : 'transparency-tabs__item'}
            onClick={() => setTab(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="transparency-year">
        <span>Tahun anggaran</span>
        <select value={year} onChange={(event) => setYear(Number(event.target.value))}>
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
        </select>
      </label>

      <section className="transparency-content" aria-live="polite">
        {isLoading ? (
          <p className="transparency-state">Memuat data anggaran...</p>
        ) : isError ? (
          <p className="transparency-state transparency-state--error">
            {error instanceof Error ? error.message : 'Data anggaran belum dapat dimuat.'}
          </p>
        ) : tab === 'pembangunan' ? (
          <>
            <article className="budget-panel">
              <header className="budget-panel__header">
                <span className="budget-panel__icon budget-panel__icon--income"><Bank size={20} aria-hidden="true" /></span>
                <div><p>{year === 2025 ? 'Dana Desa' : 'Pendapatan Desa'}</p><h2>{rupiah(incomeTotal)}</h2></div>
                <span className="budget-panel__year">{year}</span>
              </header>
              <StackedBar items={income} colors={incomeColors} />
              <BudgetLegend items={income} colors={incomeColors} />
            </article>

            <article className="budget-panel">
              <header className="budget-panel__header">
                <span className="budget-panel__icon budget-panel__icon--expense"><Wallet size={20} aria-hidden="true" /></span>
                <div><p>Belanja Desa</p><h2>{rupiah(expenseTotal)}</h2></div>
                <span className="budget-panel__year">{year}</span>
              </header>
              <div className="budget-expense-layout">
                <BudgetDonut items={expenses} colors={expenseColors} />
                <BudgetLegend items={expenses} colors={expenseColors} />
              </div>
            </article>

            <button type="button" className="transparency-detail" onClick={() => showToast('Detail anggaran segera hadir')}>
              Lihat Detail Anggaran <ArrowUpRight size={17} aria-hidden="true" />
            </button>
          </>
        ) : (
          <article className="budget-panel budget-panel--table">
            <header className="budget-panel__header">
              <span className="budget-panel__icon budget-panel__icon--income"><Bank size={20} aria-hidden="true" /></span>
              <div>
                <p>{tab === 'apbdes' ? (year === 2025 ? 'Rincian Dana Desa' : 'Ringkasan APBDes') : 'Realisasi Anggaran'}</p>
                <h2>Tahun {year}</h2>
              </div>
            </header>
            <RealisasiTable rows={data?.realisasi ?? []} />
          </article>
        )}
      </section>
    </div>
  )
}