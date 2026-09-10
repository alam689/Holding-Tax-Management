import { useId, useLayoutEffect, useRef, useState } from 'react'

// ---------------------------------------------------------------------------
// Hand-rolled SVG charts. No charting library — every mark is computed here so
// the bundle stays small and the palette follows the portal's design tokens.
// ---------------------------------------------------------------------------

export const PALETTE = ['#0f7b41', '#1d4ed8', '#d97706', '#0891b2', '#7c3aed', '#c8102e', '#0d9488', '#b45309']

function niceMax(v) {
  if (v <= 0) return 1
  const mag = Math.pow(10, Math.floor(Math.log10(v)))
  const norm = v / mag
  const step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10
  return step * mag
}

/**
 * Measures the chart container so the SVG can be drawn 1:1 with CSS pixels.
 * Without this the viewBox is scaled up to the panel width and the bars and
 * axis labels grow with it.
 */
function useMeasure(fallback = 640) {
  const ref = useRef(null)
  const [width, setWidth] = useState(fallback)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    // Measure synchronously first: ResizeObserver only reports on a paint, and
    // some embedded/background contexts never deliver that first callback.
    const measure = () => {
      const w = Math.round(el.clientWidth)
      if (w > 0) setWidth((prev) => (Math.abs(prev - w) > 1 ? w : prev))
    }
    measure()

    window.addEventListener('resize', measure)
    let ro
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure)
      ro.observe(el)
    }
    return () => {
      window.removeEventListener('resize', measure)
      if (ro) ro.disconnect()
    }
  }, [])

  return [ref, width]
}

// Bars stay readable rather than turning into slabs on a wide panel.
const MAX_BAR = 46
const MAX_GROUP = 88

function Legend({ items }) {
  return (
    <div className="chart-legend">
      {items.map((it) => (
        <span key={it.label}>
          <i style={{ background: it.color }} aria-hidden="true" />
          {it.label}
        </span>
      ))}
    </div>
  )
}

/** Vertical bars with a value axis and optional per-bar colours. */
export function BarChart({ data, height = 220, color = PALETTE[0], format = (v) => v, legend }) {
  const [hover, setHover] = useState(null)
  const [ref, W] = useMeasure()
  const H = height
  const pad = { t: 12, r: 10, b: 30, l: 52 }
  const max = niceMax(Math.max(...data.map((d) => d.value), 0))
  const iw = W - pad.l - pad.r
  const ih = H - pad.t - pad.b
  const gap = iw / data.length
  const bw = Math.min(gap * 0.62, MAX_BAR)
  const ticks = 4

  return (
    <div className="chart" ref={ref}>
      {legend && <Legend items={legend} />}
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img">
        {Array.from({ length: ticks + 1 }, (_, i) => {
          const y = pad.t + (ih / ticks) * i
          const v = max - (max / ticks) * i
          return (
            <g key={i}>
              <line x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke="#e6ecf1" />
              <text x={pad.l - 8} y={y + 4} textAnchor="end" className="ct-axis">{format(Math.round(v))}</text>
            </g>
          )
        })}
        {data.map((d, i) => {
          const h = max ? (d.value / max) * ih : 0
          const x = pad.l + gap * i + (gap - bw) / 2
          const y = pad.t + ih - h
          return (
            <g key={d.label}
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={x} y={y} width={bw} height={Math.max(h, 1)} rx="3"
                fill={d.color || color} opacity={hover === null || hover === i ? 1 : 0.45}>
                <title>{`${d.label}: ${format(d.value)}`}</title>
              </rect>
              {hover === i && (
                <text x={x + bw / 2} y={y - 5} textAnchor="middle" className="ct-value">{format(d.value)}</text>
              )}
              <text x={x + bw / 2} y={H - 12} textAnchor="middle" className="ct-axis">{d.label}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

/** Donut with a centre total and a side legend showing shares. */
export function DonutChart({ data, size = 220, format = (v) => v, centreLabel }) {
  const [hover, setHover] = useState(null)
  const total = data.reduce((s, d) => s + d.value, 0)
  const r = size / 2
  const inner = r * 0.6
  const uid = useId()

  let angle = -Math.PI / 2
  const arcs = data.map((d, i) => {
    const frac = total ? d.value / total : 0
    const a0 = angle
    const a1 = angle + frac * Math.PI * 2
    angle = a1
    const large = a1 - a0 > Math.PI ? 1 : 0
    const p = (rad, a) => `${r + rad * Math.cos(a)} ${r + rad * Math.sin(a)}`
    // A full-circle single slice needs a closed ring rather than an arc path.
    const d3 = frac >= 0.9999
      ? `M ${r} ${r - r} A ${r} ${r} 0 1 1 ${r - 0.01} ${r - r} L ${r - 0.01} ${r - inner} A ${inner} ${inner} 0 1 0 ${r} ${r - inner} Z`
      : `M ${p(r, a0)} A ${r} ${r} 0 ${large} 1 ${p(r, a1)} L ${p(inner, a1)} A ${inner} ${inner} 0 ${large} 0 ${p(inner, a0)} Z`
    return { ...d, path: d3, frac, color: d.color || PALETTE[i % PALETTE.length] }
  })

  return (
    <div className="chart chart-donut">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-labelledby={uid}>
        <title id={uid}>{centreLabel || 'Donut chart'}</title>
        {arcs.map((a, i) => (
          <path key={a.label} d={a.path} fill={a.color}
            opacity={hover === null || hover === i ? 1 : 0.4}
            onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <title>{`${a.label}: ${format(a.value)} (${Math.round(a.frac * 100)}%)`}</title>
          </path>
        ))}
        <text x={r} y={r - 2} textAnchor="middle" className="ct-total">{format(total)}</text>
        <text x={r} y={r + 16} textAnchor="middle" className="ct-axis">{centreLabel}</text>
      </svg>
      <ul className="donut-legend">
        {arcs.map((a, i) => (
          <li key={a.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <i style={{ background: a.color }} aria-hidden="true" />
            <span className="dl-label">{a.label}</span>
            <span className="dl-value">{format(a.value)}</span>
            <span className="dl-pct">{Math.round(a.frac * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Stacked or grouped bars for multi-series comparisons across categories. */
export function SeriesBarChart({ categories, series, height = 240, stacked = false, format = (v) => v }) {
  const [ref, W] = useMeasure()
  const H = height
  const pad = { t: 12, r: 10, b: 30, l: 52 }
  const iw = W - pad.l - pad.r
  const ih = H - pad.t - pad.b
  const totals = categories.map((_, ci) =>
    stacked
      ? series.reduce((s, se) => s + (se.values[ci] || 0), 0)
      : Math.max(...series.map((se) => se.values[ci] || 0)))
  const max = niceMax(Math.max(...totals, 0))
  const gap = iw / categories.length
  const groupW = Math.min(gap * 0.68, stacked ? MAX_BAR : MAX_GROUP)
  const bw = stacked ? groupW : groupW / series.length
  const ticks = 4

  return (
    <div className="chart" ref={ref}>
      <Legend items={series.map((s, i) => ({ label: s.label, color: s.color || PALETTE[i % PALETTE.length] }))} />
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img">
        {Array.from({ length: ticks + 1 }, (_, i) => {
          const y = pad.t + (ih / ticks) * i
          const v = max - (max / ticks) * i
          return (
            <g key={i}>
              <line x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke="#e6ecf1" />
              <text x={pad.l - 8} y={y + 4} textAnchor="end" className="ct-axis">{format(Math.round(v))}</text>
            </g>
          )
        })}
        {categories.map((c, ci) => {
          const x0 = pad.l + gap * ci + (gap - groupW) / 2
          let stackY = pad.t + ih
          return (
            <g key={c}>
              {series.map((se, si) => {
                const v = se.values[ci] || 0
                const h = max ? (v / max) * ih : 0
                const color = se.color || PALETTE[si % PALETTE.length]
                if (stacked) {
                  stackY -= h
                  return (
                    <rect key={se.label} x={x0} y={stackY} width={bw} height={Math.max(h, 0)} fill={color}>
                      <title>{`${se.label} · ${c}: ${format(v)}`}</title>
                    </rect>
                  )
                }
                return (
                  <rect key={se.label} x={x0 + bw * si} y={pad.t + ih - h} width={bw - 1}
                    height={Math.max(h, 0)} rx="2" fill={color}>
                    <title>{`${se.label} · ${c}: ${format(v)}`}</title>
                  </rect>
                )
              })}
              <text x={x0 + groupW / 2} y={H - 12} textAnchor="middle" className="ct-axis">{c}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

/** Compact trend line used inside KPI tiles. */
export function Sparkline({ values, color = '#fff', width = 110, height = 34 }) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = max - min || 1
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width
    const y = height - ((v - min) / span) * (height - 4) - 2
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  return (
    <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden="true">
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" opacity=".85" />
    </svg>
  )
}
