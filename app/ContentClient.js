'use client'
import Link from 'next/link'

export default function ContentClient({ title, icon, badge, badgeUrgent, sections, notionUrl, backLabel, backHref, accentColor = '#4d6dff' }) {
  const mainSections = buildMainSections(sections || {})

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 16px 60px' }}>
      {/* Header */}
      <div style={{ background: accentColor, margin: '0 -16px', padding: '16px 16px 20px', borderRadius: '0 0 20px 20px', marginBottom: 20 }}>
        <Link href={backHref || '/'} style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, display: 'block', marginBottom: 12 }}>
          {backLabel || '← Back'}
        </Link>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: 28, flexShrink: 0 }}>{icon}</span>
          <div>
            {badge && (
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.2)', color: '#fff', display: 'inline-block', marginBottom: 6 }}>
                {badgeUrgent ? '⚠️ ' : ''}{badge}
              </span>
            )}
            <h1 style={{ color: '#fff', fontSize: 19, fontWeight: 600, lineHeight: 1.3, margin: 0 }}>{title}</h1>
          </div>
        </div>
      </div>

      {/* Content sections */}
      {mainSections.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #e5e3df', borderRadius: 10, padding: '20px 16px', color: '#888', fontSize: 14 }}>
          Content coming soon. <a href={notionUrl} target="_blank" rel="noreferrer" style={{ color: accentColor }}>View in Notion ↗</a>
        </div>
      ) : (
        mainSections.map((section, si) => (
          <div key={si} style={{ marginBottom: 16 }}>
            {section.title && (
              <h2 style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                {section.emoji} {section.title}
              </h2>
            )}
            <div style={{ background: '#fff', border: '1px solid #e5e3df', borderRadius: 10, padding: '14px 16px' }}>
              {section.items.map((item, ii) => renderItem(item, ii, accentColor))}
            </div>
          </div>
        ))
      )}

      {/* Notion link */}
      {notionUrl && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <a href={notionUrl} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#bbb', textDecoration: 'underline' }}>
            View & edit in Notion ↗
          </a>
        </div>
      )}
    </div>
  )
}

function renderItem(item, key, accentColor) {
  if (item.type === 'paragraph') {
    return <p key={key} style={{ fontSize: 14, color: '#333', lineHeight: 1.7, marginBottom: 8 }}>{item.text}</p>
  }
  if (item.type === 'bullet') {
    const isWarning = item.text.includes('⚠️') || item.text.includes('⛔') || item.text.includes('🚫')
    return (
      <div key={key} style={{ padding: '7px 12px', background: key % 2 === 0 ? '#fafaf8' : '#fff', borderRadius: 6, fontSize: 14, lineHeight: 1.5, marginBottom: 3, borderLeft: `3px solid ${isWarning ? '#da5346' : 'transparent'}` }}>
        {item.text}
      </div>
    )
  }
  if (item.type === 'callout') {
    const isWarning = ['⚠️','⛔','🚫'].includes(item.emoji)
    return (
      <div key={key} style={{ background: isWarning ? '#fff9f8' : '#f4f2ee', borderLeft: `3px solid ${isWarning ? '#da5346' : accentColor}`, borderRadius: '0 6px 6px 0', padding: '10px 14px', marginBottom: 8, fontSize: 14 }}>
        <span style={{ marginRight: 6 }}>{item.emoji}</span>{item.text}
      </div>
    )
  }
  if (item.type === 'table' && item.data?.length > 0) {
    const [header, ...rows] = item.data
    return (
      <div key={key} style={{ overflowX: 'auto', marginBottom: 10 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          {header && <thead><tr>{header.map((cell, ci) => (
            <th key={ci} style={{ padding: '8px 10px', background: '#f4f2ee', border: '1px solid #e5e3df', textAlign: 'left', fontWeight: 600 }}>{cell}</th>
          ))}</tr></thead>}
          <tbody>{rows.map((row, ri) => (
            <tr key={ri}>{row.map((cell, ci) => (
              <td key={ci} style={{ padding: '7px 10px', border: '1px solid #e5e3df', background: ri % 2 === 0 ? '#fff' : '#fafaf8', verticalAlign: 'top' }}>{cell}</td>
            ))}</tr>
          ))}</tbody>
        </table>
      </div>
    )
  }
  return null
}

const SKIP = ['quick', 'non_negotiable', 'do_not', 'don_t', 'at_a_glance']
const EMOJIS = { purpose: '🎯', step: '🪜', pre_: '🪜', post: '✅', client: '🗣️', overview: '📋', assessment: '🔍', non_neg: '🚫' }

function buildMainSections(sections) {
  return Object.entries(sections)
    .filter(([key, items]) => !SKIP.some(s => key.includes(s)) && items.length > 0)
    .map(([key, items]) => {
      const emoji = Object.entries(EMOJIS).find(([k]) => key.includes(k))?.[1] || '📋'
      const title = key.replace(/_/g, ' ').replace(/^\d+\s*/, '').trim().replace(/\b\w/g, c => c.toUpperCase())
      return { title, emoji, items }
    })
}
