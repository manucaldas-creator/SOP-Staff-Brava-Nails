'use client'
import { useState } from 'react'
import Link from 'next/link'

const seriesOrder  = ['T', 'H', 'S', 'C']
const seriesLabels = { T: 'Treatments', H: 'Hygiene', S: 'Studio Ops', C: 'Client Journey' }
const categoryColors = {
  Client: '#185fa5', Hygiene: '#854f0b', Scheduling: '#534ab7',
  Payments: '#0f6e56', Emergencies: '#da5346', Language: '#0f6e56',
}
const categoryBg = {
  Client: '#e6f1fb', Hygiene: '#faeeda', Scheduling: '#eeedfe',
  Payments: '#e1f5ee', Emergencies: '#fff0ee', Language: '#e1f5ee',
}

export default function HomeClient({ sops, faqs, culture, seriesConfig }) {
  const [tab, setTab]         = useState('sops')
  const [search, setSearch]   = useState('')
  const [activeSeries, setActiveSeries] = useState('ALL')
  const [openFaq, setOpenFaq] = useState(null)
  const [openVal, setOpenVal] = useState(null)

  const liveSops = sops.filter(s => s.status === 'Live').length

  // ── filtered SOPs
  const filteredSops = sops.filter(s => {
    const matchSeries = activeSeries === 'ALL' || s.seriesKey === activeSeries
    const q = search.toLowerCase()
    const matchSearch = !q || s.title.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
    return matchSeries && matchSearch
  })

  const grouped = seriesOrder.reduce((acc, k) => {
    const items = filteredSops.filter(s => s.seriesKey === k)
    if (items.length) acc[k] = items
    return acc
  }, {})

  // ── filtered FAQs
  const filteredFaqs = faqs.filter(f =>
    !search || f.question.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 0 60px' }}>

      {/* ── Header ── */}
      <div style={{ background: '#4d6dff', padding: '20px 16px 0', borderRadius: '0 0 20px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>★ Brava Staff Hub</span>
          <a href="https://www.notion.so/db0ddee2004b4ebbaa52fedd0b6799db" target="_blank" rel="noreferrer"
            style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>Edit in Notion ↗</a>
        </div>
        <input
          type="text" placeholder="Search..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '11px 16px', borderRadius: 10, border: 'none', background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 15, outline: 'none', marginBottom: 16 }}
        />
        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: 0 }}>
          {[['sops','SOPs'], ['faqs','FAQs'], ['culture','Culture']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500,
              background: tab === key ? '#fff' : 'transparent',
              color: tab === key ? '#4d6dff' : 'rgba(255,255,255,0.75)',
              borderRadius: tab === key ? '10px 10px 0 0' : 0,
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>

        {/* ══ TAB: SOPs ══ */}
        {tab === 'sops' && <>
          {/* Stats */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            {[{ n: liveSops, label: 'Live' }, { n: sops.length, label: 'Total' }, { n: 4, label: 'Series' }].map(s => (
              <div key={s.label} style={{ flex: 1, background: '#fff', border: '1px solid #e5e3df', borderRadius: 10, padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 600, color: '#4d6dff' }}>{s.n}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Series filter */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {['ALL', ...seriesOrder].map(s => {
              const active = activeSeries === s
              const name = seriesLabels[s]
              const cfg  = seriesConfig[name]
              return (
                <button key={s} onClick={() => setActiveSeries(s)} style={{
                  padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
                  border: active ? 'none' : '1px solid #e5e3df',
                  background: active ? (cfg?.bg || '#4d6dff') : '#fff',
                  color: active ? (cfg?.color || '#fff') : '#555',
                  fontWeight: active ? 500 : 400,
                }}>
                  {s === 'ALL' ? 'All' : name}
                </button>
              )
            })}
          </div>

          {/* SOP groups */}
          {Object.keys(grouped).length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>No SOPs found.</div>
          )}
          {seriesOrder.filter(k => grouped[k]).map(k => {
            const name = seriesLabels[k]
            const cfg  = seriesConfig[name]
            return (
              <div key={k} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 13 }}>{k}</div>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{name}</span>
                  <span style={{ fontSize: 12, color: '#999', marginLeft: 'auto' }}>Owner: {cfg.owner}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {grouped[k].map(sop => (
                    sop.status === 'Live'
                      ? <Link key={sop.id} href={`/sop/${sop.id}`} style={{ textDecoration: 'none' }}><SopCard sop={sop} cfg={cfg} /></Link>
                      : <SopCard key={sop.id} sop={sop} cfg={cfg} dimmed />
                  ))}
                </div>
              </div>
            )
          })}
        </>}

        {/* ══ TAB: FAQs ══ */}
        {tab === 'faqs' && <>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>Quick answers to common situations. Tap to expand.</p>
          {filteredFaqs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>No FAQs found.</div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {filteredFaqs.map((faq, i) => (
              <div key={faq.id} style={{ background: '#fff', border: `1px solid ${faq.urgency === 'Urgent' ? '#f0c8c8' : '#e5e3df'}`, borderRadius: 10, overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                  width: '100%', background: faq.urgency === 'Urgent' ? '#fff9f8' : 'none',
                  border: 'none', padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', cursor: 'pointer',
                }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{faq.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{faq.question}</div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                      {faq.category && (
                        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: categoryBg[faq.category] || '#f0f0f0', color: categoryColors[faq.category] || '#555' }}>
                          {faq.category}
                        </span>
                      )}
                      {faq.urgency === 'Urgent' && (
                        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: '#fff0ee', color: '#da5346' }}>⚠️ Urgent</span>
                      )}
                    </div>
                  </div>
                  <span style={{ color: '#4d6dff', fontSize: 20, fontWeight: 300, flexShrink: 0 }}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 16px 14px 48px', borderTop: '1px solid #f0eeea' }}>
                    <Link href={`/faq/${faq.id}`} style={{ fontSize: 13, color: '#4d6dff', display: 'block', paddingTop: 12 }}>
                      Read full answer →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>}

        {/* ══ TAB: Culture ══ */}
        {tab === 'culture' && <>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>Who we are and how we show up every day.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {culture.map((val, i) => (
              <div key={val.id} style={{ background: '#fff', border: '1px solid #e5e3df', borderRadius: 10, overflow: 'hidden' }}>
                <button onClick={() => setOpenVal(openVal === i ? null : i)} style={{
                  width: '100%', background: 'none', border: 'none', padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', cursor: 'pointer',
                }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{val.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{val.title}</div>
                    {val.type && (
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: '#eeedfe', color: '#534ab7', marginTop: 4, display: 'inline-block' }}>
                        {val.type}
                      </span>
                    )}
                  </div>
                  <span style={{ color: '#4d6dff', fontSize: 20, fontWeight: 300, flexShrink: 0 }}>{openVal === i ? '−' : '+'}</span>
                </button>
                {openVal === i && (
                  <div style={{ padding: '0 16px 14px 52px', borderTop: '1px solid #f0eeea' }}>
                    <Link href={`/culture/${val.id}`} style={{ fontSize: 13, color: '#4d6dff', display: 'block', paddingTop: 12 }}>
                      Read in full →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>}

      </div>
    </div>
  )
}

function SopCard({ sop, cfg, dimmed }) {
  const isLive = sop.status === 'Live'
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e3df', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, opacity: dimmed ? 0.45 : 1 }}>
      <span style={{ fontSize: 20, flexShrink: 0 }}>{sop.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ fontWeight: 500, fontSize: 12, color: cfg.color }}>{sop.code}</span>
          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: isLive ? '#e1f5ee' : '#f0eeea', color: isLive ? '#0f6e56' : '#999' }}>
            {sop.status}
          </span>
        </div>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sop.title}</div>
      </div>
      {isLive && <span style={{ color: '#bbb', fontSize: 18, flexShrink: 0 }}>›</span>}
    </div>
  )
}
