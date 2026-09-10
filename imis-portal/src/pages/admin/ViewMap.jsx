import { useMemo, useRef, useState } from 'react'
import { useLang } from '../../context/LangContext'
import { useData } from '../../context/DataContext'
import { Alert, Badge } from '../../components/ui'

// ---------------------------------------------------------------------------
// A schematic ward map drawn in SVG. Records are projected onto a synthetic
// grid derived from their ward number and id, so every feature has a stable
// position without needing external tiles or a mapping library.
// ---------------------------------------------------------------------------

const W = 1000
const H = 640
const COLS = 6
const ROWS = 6

/** Deterministic 0..1 jitter from a string, so a record never moves. */
function hash01(str, salt = 0) {
  let h = 2166136261 ^ salt
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 10000) / 10000
}

function wardCell(ward) {
  const idx = (Number(ward) || 1) - 1
  return { cx: (idx % COLS), cy: Math.floor(idx / COLS) % ROWS }
}

function project(ward, id, salt = 0) {
  const { cx, cy } = wardCell(ward)
  const cellW = W / COLS
  const cellH = H / ROWS
  return {
    x: cx * cellW + 14 + hash01(id, salt) * (cellW - 28),
    y: cy * cellH + 14 + hash01(id, salt + 977) * (cellH - 28),
  }
}

const LAYER_DEFS = [
  { key: 'wards', color: '#94a3b8', en: 'Ward boundaries', bn: 'ওয়ার্ড সীমানা' },
  { key: 'roads', color: '#64748b', en: 'Roads', bn: 'সড়ক' },
  { key: 'drains', color: '#0891b2', en: 'Drains', bn: 'ড্রেন' },
  { key: 'buildings', color: '#0f7b41', en: 'Building structures', bn: 'ইমারত কাঠামো' },
  { key: 'containments', color: '#7c3aed', en: 'Containments', bn: 'কনটেইনমেন্ট' },
  { key: 'plants', color: '#c8102e', en: 'Treatment plants', bn: 'ট্রিটমেন্ট প্ল্যান্ট' },
  { key: 'stations', color: '#d97706', en: 'Transfer stations', bn: 'ট্রান্সফার স্টেশন' },
]

export default function ViewMap() {
  const { p, n, lang } = useLang()
  const { rowsOf } = useData()
  const svgRef = useRef(null)

  const [tab, setTab] = useState('layers')
  const [layers, setLayers] = useState(() =>
    Object.fromEntries(LAYER_DEFS.map((l) => [l.key, true])))
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [selected, setSelected] = useState(null)
  const [pin, setPin] = useState(null)          // Find Nearest Road probe
  const [nearest, setNearest] = useState(null)
  const [taxMode, setTaxMode] = useState(false)
  const [minDue, setMinDue] = useState(5000)
  const [wardFilter, setWardFilter] = useState('')

  const buildings = rowsOf('building-structures')
  const roads = rowsOf('roads')
  const drains = rowsOf('drains')
  const containments = rowsOf('containments')
  const plants = rowsOf('treatment-plants')
  const stations = rowsOf('transfer-stations')

  const inWard = (r) => !wardFilter || String(r.ward) === wardFilter

  // --- geometry ---
  const roadLines = useMemo(() => roads.filter(inWard).map((r) => {
    const a = project(r.ward, r.id, 11)
    const angle = hash01(r.id, 31) * Math.PI
    const len = 40 + hash01(r.id, 53) * 90
    return {
      rec: r,
      x1: a.x - Math.cos(angle) * len / 2, y1: a.y - Math.sin(angle) * len / 2,
      x2: a.x + Math.cos(angle) * len / 2, y2: a.y + Math.sin(angle) * len / 2,
    }
  }), [roads, wardFilter])

  const drainLines = useMemo(() => drains.filter(inWard).map((d) => {
    const a = project(d.ward, d.id, 71)
    const angle = hash01(d.id, 97) * Math.PI
    const len = 30 + hash01(d.id, 113) * 70
    return {
      rec: d,
      x1: a.x - Math.cos(angle) * len / 2, y1: a.y - Math.sin(angle) * len / 2,
      x2: a.x + Math.cos(angle) * len / 2, y2: a.y + Math.sin(angle) * len / 2,
    }
  }), [drains, wardFilter])

  const buildingPts = useMemo(() => buildings.filter(inWard).map((b) => ({
    rec: b, ...project(b.ward, b.id, 3), due: Number(b.taxDue) || 0,
  })), [buildings, wardFilter])

  const containmentPts = useMemo(() => containments.filter(inWard).map((c) => ({
    rec: c, ...project(c.ward, c.id, 7),
  })), [containments, wardFilter])

  const stationPts = useMemo(() => stations.filter(inWard).map((s) => ({
    rec: s, ...project(s.ward, s.id, 17),
  })), [stations, wardFilter])

  const plantPts = useMemo(() => plants.map((t, i) => ({
    rec: t, x: 120 + i * 360, y: H - 60,
  })), [plants])

  const taxDue = useMemo(
    () => buildingPts.filter((b) => b.due >= Number(minDue || 0)),
    [buildingPts, minDue],
  )

  // --- tools ---
  const pointToSegment = (px, py, s) => {
    const dx = s.x2 - s.x1
    const dy = s.y2 - s.y1
    const len2 = dx * dx + dy * dy || 1
    let t = ((px - s.x1) * dx + (py - s.y1) * dy) / len2
    t = Math.max(0, Math.min(1, t))
    const cx = s.x1 + t * dx
    const cy = s.y1 + t * dy
    return { dist: Math.hypot(px - cx, py - cy), cx, cy }
  }

  const onMapClick = (e) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    // Convert the click into user units, undoing the zoom/pan transform.
    const x = ((e.clientX - rect.left) / rect.width * W - pan.x) / zoom
    const y = ((e.clientY - rect.top) / rect.height * H - pan.y) / zoom
    if (tab !== 'tools') return
    setPin({ x, y })
    let best = null
    roadLines.forEach((s) => {
      const r = pointToSegment(x, y, s)
      if (!best || r.dist < best.dist) best = { ...r, road: s.rec }
    })
    setNearest(best)
  }

  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); setPin(null); setNearest(null); setSelected(null) }

  const visibleCount = {
    buildings: buildingPts.length, roads: roadLines.length, drains: drainLines.length,
    containments: containmentPts.length, plants: plantPts.length, stations: stationPts.length,
  }

  return (
    <>
      <div className="page-bar">
        <div>
          <h1>🗺️ {lang === 'bn' ? 'মানচিত্র' : 'View Map'}</h1>
          <p className="small muted mb-0">
            {lang === 'bn'
              ? 'ওয়ার্ডভিত্তিক পরিকল্পিত মানচিত্রে ইমারত, সড়ক, ড্রেন ও এফএসএম স্থাপনা দেখুন।'
              : 'A schematic ward map of buildings, roads, drains and FSM infrastructure.'}
          </p>
        </div>
        <div className="flex">
          <button className="btn btn-outline btn-sm" onClick={() => setZoom((z) => Math.min(4, +(z * 1.25).toFixed(2)))}>＋</button>
          <button className="btn btn-outline btn-sm" onClick={() => setZoom((z) => Math.max(0.5, +(z / 1.25).toFixed(2)))}>－</button>
          <button className="btn btn-outline btn-sm" onClick={resetView}>⟲ {lang === 'bn' ? 'রিসেট' : 'Reset'}</button>
          <button className="btn btn-outline btn-sm" onClick={() => window.print()}>🖨</button>
          <span className="small muted">{lang === 'bn' ? 'জুম' : 'Zoom'} {n(zoom)}×</span>
        </div>
      </div>

      <div className="maplayout">
        <aside className="panel mapside">
          <div className="tabs" style={{ margin: '0 .6rem' }}>
            <button className={tab === 'layers' ? 'active' : ''} onClick={() => setTab('layers')}>
              {lang === 'bn' ? 'লেয়ার' : 'Layers'}
            </button>
            <button className={tab === 'tools' ? 'active' : ''} onClick={() => setTab('tools')}>
              {lang === 'bn' ? 'টুলস' : 'Tools'}
            </button>
          </div>

          {tab === 'layers' && (
            <div className="panel-pad">
              <p className="small muted">
                {lang === 'bn' ? 'যে স্তরগুলো দেখতে চান নির্বাচন করুন।' : 'Choose which layers to draw.'}
              </p>
              {LAYER_DEFS.map((l) => (
                <label key={l.key} className="layerrow">
                  <input type="checkbox" checked={layers[l.key]}
                    onChange={(e) => setLayers((s) => ({ ...s, [l.key]: e.target.checked }))} />
                  <i style={{ background: l.color }} aria-hidden="true" />
                  <span>{lang === 'bn' ? l.bn : l.en}</span>
                  {visibleCount[l.key] !== undefined && (
                    <span className="small muted">{n(visibleCount[l.key])}</span>
                  )}
                </label>
              ))}

              <hr />
              <label className="small" htmlFor="wf">{lang === 'bn' ? 'ওয়ার্ড ফিল্টার' : 'Ward filter'}</label>
              <select id="wf" value={wardFilter} onChange={(e) => setWardFilter(e.target.value)}>
                <option value="">{lang === 'bn' ? 'সব ওয়ার্ড' : 'All wards'}</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w}>{lang === 'bn' ? `ওয়ার্ড ${n(w)}` : `Ward ${w}`}</option>
                ))}
              </select>
            </div>
          )}

          {tab === 'tools' && (
            <div className="panel-pad">
              <h4 className="mb-0">📍 {lang === 'bn' ? 'নিকটতম সড়ক খুঁজুন' : 'Find Nearest Road'}</h4>
              <p className="small muted">
                {lang === 'bn'
                  ? 'মানচিত্রে যেকোনো স্থানে ক্লিক করুন — নিকটতম সড়কটি চিহ্নিত হবে।'
                  : 'Click anywhere on the map — the nearest road is measured and highlighted.'}
              </p>
              {nearest ? (
                <dl className="kv">
                  <dt>{lang === 'bn' ? 'সড়ক' : 'Road'}</dt><dd>{p(nearest.road.name)}</dd>
                  <dt>{lang === 'bn' ? 'আইডি' : 'ID'}</dt><dd>{nearest.road.id}</dd>
                  <dt>{lang === 'bn' ? 'ওয়ার্ড' : 'Ward'}</dt><dd>{n(nearest.road.ward)}</dd>
                  <dt>{lang === 'bn' ? 'দূরত্ব' : 'Distance'}</dt><dd>≈ {n(Math.round(nearest.dist * 2.4))} m</dd>
                </dl>
              ) : (
                <p className="small muted"><em>{lang === 'bn' ? 'এখনো কোনো স্থান নির্বাচন করা হয়নি।' : 'No point picked yet.'}</em></p>
              )}

              <hr />
              <h4 className="mb-0">💰 {lang === 'bn' ? 'বকেয়া কর সহ ইমারত' : 'Find Tax Due Buildings'}</h4>
              <p className="small muted">
                {lang === 'bn'
                  ? 'ন্যূনতম বকেয়া দিন — মানচিত্রে সেই ইমারতগুলো চিহ্নিত হবে।'
                  : 'Set a minimum amount to highlight the holdings that owe it.'}
              </p>
              <label className="small" htmlFor="md">{lang === 'bn' ? 'ন্যূনতম বকেয়া (৳)' : 'Minimum due (৳)'}</label>
              <input id="md" type="number" min="0" step="1000" value={minDue}
                onChange={(e) => setMinDue(e.target.value)} />
              <button className={`btn btn-sm mt-1 ${taxMode ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setTaxMode((v) => !v)}>
                {taxMode
                  ? (lang === 'bn' ? '✓ চিহ্নিতকরণ চালু' : '✓ Highlighting on')
                  : (lang === 'bn' ? 'চিহ্নিত করুন' : 'Highlight')}
              </button>
              {taxMode && (
                <p className="small mt-1 mb-0">
                  <Badge tone="red">
                    {lang === 'bn' ? `${n(taxDue.length)} টি ইমারত` : `${taxDue.length} buildings`}
                  </Badge>{' '}
                  {lang === 'bn' ? 'মোট ' : 'owing '}
                  <strong>৳ {n(taxDue.reduce((s, b) => s + b.due, 0).toLocaleString('en-US'))}</strong>
                </p>
              )}
            </div>
          )}
        </aside>

        <section className="panel mapcanvas">
          <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="mapsvg" onClick={onMapClick}
            role="img" aria-label="Ward map">
            <rect x="0" y="0" width={W} height={H} fill="#f2f6f4" />
            <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
              {/* ward grid */}
              {layers.wards && Array.from({ length: 31 }, (_, i) => {
                const { cx, cy } = wardCell(i + 1)
                const cw = W / COLS
                const ch = H / ROWS
                const active = !wardFilter || String(i + 1) === wardFilter
                return (
                  <g key={i} opacity={active ? 1 : 0.25}>
                    <rect x={cx * cw} y={cy * ch} width={cw} height={ch}
                      fill={(cx + cy) % 2 ? '#eaf1ed' : '#f6faf8'} stroke="#cbd5e1" />
                    <text x={cx * cw + 6} y={cy * ch + 15} className="ct-axis">
                      {lang === 'bn' ? `ওয়ার্ড ${n(i + 1)}` : `Ward ${i + 1}`}
                    </text>
                  </g>
                )
              })}

              {layers.roads && roadLines.map((s) => (
                <line key={s.rec.id} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
                  stroke={nearest?.road.id === s.rec.id ? '#c8102e' : '#64748b'}
                  strokeWidth={nearest?.road.id === s.rec.id ? 4 : 2} strokeLinecap="round">
                  <title>{`${s.rec.name.en} · ${s.rec.id}`}</title>
                </line>
              ))}

              {layers.drains && drainLines.map((s) => (
                <line key={s.rec.id} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
                  stroke="#0891b2" strokeWidth="1.5" strokeDasharray="5 3">
                  <title>{`${s.rec.name.en} · ${s.rec.id}`}</title>
                </line>
              ))}

              {layers.buildings && buildingPts.map((b) => {
                const flagged = taxMode && b.due >= Number(minDue || 0)
                return (
                  <rect key={b.rec.id} x={b.x - 3} y={b.y - 3} width="6" height="6" rx="1"
                    fill={flagged ? '#c8102e' : '#0f7b41'}
                    stroke={flagged ? '#7f1d1d' : 'none'} strokeWidth={flagged ? 1.5 : 0}
                    onClick={(e) => { e.stopPropagation(); setSelected({ kind: 'building', rec: b.rec }) }}
                    style={{ cursor: 'pointer' }}>
                    <title>{`${b.rec.holdingNo} · ৳ ${b.due.toLocaleString('en-US')}`}</title>
                  </rect>
                )
              })}

              {layers.containments && containmentPts.map((c) => (
                <circle key={c.rec.id} cx={c.x} cy={c.y} r="3.4" fill="#7c3aed" opacity=".85"
                  onClick={(e) => { e.stopPropagation(); setSelected({ kind: 'containment', rec: c.rec }) }}
                  style={{ cursor: 'pointer' }}>
                  <title>{`${c.rec.id} · ${c.rec.type}`}</title>
                </circle>
              ))}

              {layers.stations && stationPts.map((s) => (
                <g key={s.rec.id} onClick={(e) => { e.stopPropagation(); setSelected({ kind: 'station', rec: s.rec }) }}
                  style={{ cursor: 'pointer' }}>
                  <polygon points={`${s.x},${s.y - 7} ${s.x + 6},${s.y + 5} ${s.x - 6},${s.y + 5}`} fill="#d97706" />
                  <title>{s.rec.name.en}</title>
                </g>
              ))}

              {layers.plants && plantPts.map((t) => (
                <g key={t.rec.id} onClick={(e) => { e.stopPropagation(); setSelected({ kind: 'plant', rec: t.rec }) }}
                  style={{ cursor: 'pointer' }}>
                  <circle cx={t.x} cy={t.y} r="9" fill="#c8102e" opacity=".9" />
                  <text x={t.x} y={t.y + 4} textAnchor="middle" fill="#fff" style={{ fontSize: 9, fontWeight: 700 }}>P</text>
                  <text x={t.x} y={t.y + 24} textAnchor="middle" className="ct-axis">{t.rec.name.en}</text>
                </g>
              ))}

              {/* nearest-road probe */}
              {pin && (
                <>
                  {nearest && <line x1={pin.x} y1={pin.y} x2={nearest.cx} y2={nearest.cy} stroke="#c8102e" strokeWidth="1.5" strokeDasharray="4 3" />}
                  <circle cx={pin.x} cy={pin.y} r="5" fill="none" stroke="#c8102e" strokeWidth="2" />
                  <circle cx={pin.x} cy={pin.y} r="1.6" fill="#c8102e" />
                </>
              )}
            </g>
          </svg>

          <div className="maplegend">
            {LAYER_DEFS.filter((l) => layers[l.key] && l.key !== 'wards').map((l) => (
              <span key={l.key}><i style={{ background: l.color }} />{lang === 'bn' ? l.bn : l.en}</span>
            ))}
            {tab === 'tools' && (
              <span className="muted">
                {lang === 'bn' ? '· টুলস ট্যাবে মানচিত্রে ক্লিক করুন' : '· click the map while the Tools tab is open'}
              </span>
            )}
          </div>
        </section>
      </div>

      {selected && (
        <div className="modal-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null) }}>
          <div className="modal modal-sm">
            <header className="modal-head">
              <h3 className="mb-0">{selected.rec.id}</h3>
              <button className="icon-btn" onClick={() => setSelected(null)} aria-label="Close">✕</button>
            </header>
            <div className="modal-body">
              <dl className="kv">
                {Object.entries(selected.rec).filter(([k]) => k !== 'id').slice(0, 9).map(([k, v]) => (
                  <div key={k} style={{ display: 'contents' }}>
                    <dt>{k}</dt>
                    <dd>{v && typeof v === 'object' ? p(v) : String(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      )}

      <Alert tone="info">
        {lang === 'bn'
          ? 'এটি একটি পরিকল্পিত (স্কিমেটিক) মানচিত্র — বাস্তব স্থানাঙ্কের পরিবর্তে ওয়ার্ড গ্রিডে অবস্থান দেখানো হয়েছে, ফলে কোনো বাহ্যিক টাইল সার্ভার ছাড়াই এটি কাজ করে।'
          : 'This is a schematic map — features are placed on a ward grid rather than real coordinates, so it works with no external tile server.'}
      </Alert>
    </>
  )
}
