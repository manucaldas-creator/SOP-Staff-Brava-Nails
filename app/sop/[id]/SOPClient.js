'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function SOPClient({ sop, seriesConfig }) {
  const [scriptLang, setScriptLang] = useState('both')
  const cfg = seriesConfig[sop.series] || seriesConfig['S']

  // Extract bilingual scripts from callout blocks that contain EN/DE markers
  const scripts = extractScripts(sop.rawBlocks || [])

  // Extract quick ref bullets (last bulleted section or section with "quick" in heading)
  const quickRef = extractQuickRef(sop.sections)

  // Extract don'ts
  const donts = extractDonts(sop.sections)

  // Build main content sections (exclude quick-ref and donts sections)
  const mainSections = buildMainSections(sop.sections)

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 16px 60px' }}>
      {/* Top bar */}
      <div style={{
        background: '#4d6dff', margin: '0 -16px',
        padding: '16px 16px 20px', borderRadius: '0 0 20px 20px', marginBottom: 20,
      }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, display: 'block', marginBottom: 12 }}>
          ← Back to hub
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>{sop.icon}</span>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 2 }}>{sop.code}</div>
            <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 600, lineHeight: 1.2 }}>{sop.title}</h1>
          </div>
        </div>
      </div>

      {/* Main content sections */}
      {mainSections.map((section, si) => (
        <Section key={si} title={section.title} emoji={section.emoji}>
          {section.items.map((item, ii) => renderItem(item, ii, cfg))}
        </Section>
      ))}

      {/* Don'ts */}
      {donts.length > 0 && (
        <Section title="Do NOT" emoji="🚫">
          {donts.map((d, i) => (
            <div key={i} style={{
              padding: '9px 12px 9px 36px', position: 'relative',
              background: '#fff9f8', borderRadius: 6, marginBottom: 4,
              fontSize: 14, color: '#333', borderLeft: '3px solid #da5346',
            }}>
              <span style={{ position: 'absolute', left: 10, top: 9, color: '#da5346' }}>✗</span>
              {d}
            </div>
          ))}
        </Section>
      )}

      {/* Scripts */}
      {scripts.length > 0 && (
        <Section title="Bilingual scripts" emoji="🗣️">
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {['both', 'en', 'de'].map(l => (
              <button key={l} onClick={() => setScriptLang(l)} style={{
                padding: '5px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
                border: '1px solid #e5e3df',
                background: scriptLang === l ? '#4d6dff' : '#fff',
                color: scriptLang === l ? '#fff' : '#555',
              }}>{l === 'both' ? 'EN + DE' : l.toUpperCase()}</button>
            ))}
          </div>
          {scripts.map((sc, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e5e3df', borderRadius: 10, overflow: 'hidden', marginBottom: 8 }}>
              {sc.moment && (
                <div style={{ padding: '8px 14px', background: '#f4f2ee', fontSize: 12, color: '#666', fontWeight: 500 }}>
                  {sc.moment}
                </div>
              )}
              {(scriptLang === 'both' || scriptLang === 'en') && sc.en && (
                <div style={{ padding: '10px 14px', borderBottom: scriptLang === 'both' && sc.de ? '1px solid #f0eeea' : 'none' }}>
                  <span style={{ fontSize: 11, color: '#4d6dff', fontWeight: 500, display: 'block', marginBottom: 3 }}>🇬🇧 EN</span>
                  <span style={{ fontSize: 14 }}>"{sc.en}"</span>
                </div>
              )}
              {(scriptLang === 'both' || scriptLang === 'de') && sc.de && (
                <div style={{ padding: '10px 14px' }}>
                  <span style={{ fontSize: 11, color: '#854f0b', fontWeight: 500, display: 'block', marginBottom: 3 }}>🇩🇪 DE</span>
                  <span style={{ fontSize: 14 }}>"{sc.de}"</span>
                </div>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Quick ref */}
      {quickRef.length > 0 && (
        <Section title="Quick-reference card" emoji="⚡">
          <div style={{ background: '#4d6dff', borderRadius: 10, padding: '16px' }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 10 }}>
              {sop.code} — {sop.title}
            </div>
            {quickRef.map((item, i) => (
              <div key={i} style={{
                color: '#fff', fontSize: 14, padding: '6px 0',
                borderBottom: i < quickRef.length - 1 ? '1px solid rgba(255,255,255,0.15)' : 'none',
                display: 'flex', gap: 8,
              }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>→</span>
                {item}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#999', marginTop: 8, textAlign: 'center' }}>
            Print and laminate for your station.
          </p>
        </Section>
      )}

      {/* Notion link */}
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <a href={sop.notionUrl} target="_blank" rel="noreferrer"
          style={{ fontSize: 13, color: '#999', textDecoration: 'underline' }}>
          View & edit in Notion ↗
        </a>
      </div>
    </div>
  )
}

function Section({ title, emoji, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>{emoji}</span> {title}
      </h2>
      <div style={{ background: '#fff', border: '1px solid #e5e3df', borderRadius: 10, padding: '14px 16px' }}>
        {children}
      </div>
    </div>
  )
}

function renderItem(item, key, cfg) {
  if (item.type === 'paragraph') {
    return <p key={key} style={{ fontSize: 14, color: '#333', lineHeight: 1.6, marginBottom: 6 }}>{item.text}</p>
  }
  if (item.type === 'bullet') {
    return (
      <div key={key} style={{
        padding: '7px 12px', background: key % 2 === 0 ? '#fafaf8' : '#fff',
        borderRadius: 6, fontSize: 14, lineHeight: 1.5, marginBottom: 3,
        borderLeft: item.text.includes('⚠️') || item.text.includes('⛔') ? '3px solid #da5346' : '3px solid transparent',
      }}>
        {item.text}
      </div>
    )
  }
  if (item.type === 'callout') {
    const isWarning = ['⚠️', '⛔', '🚫'].includes(item.emoji)
    return (
      <div key={key} style={{
        background: isWarning ? '#fff9f8' : '#f4f2ee',
        borderLeft: `3px solid ${isWarning ? '#da5346' : '#4d6dff'}`,
        borderRadius: '0 6px 6px 0', padding: '10px 14px', marginBottom: 8, fontSize: 14,
      }}>
        <span style={{ marginRight: 6 }}>{item.emoji}</span>{item.text}
      </div>
    )
  }
  if (item.type === 'table' && item.data?.length > 0) {
    const [header, ...rows] = item.data
    return (
      <div key={key} style={{ overflowX: 'auto', marginBottom: 10 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          {header && (
            <thead>
              <tr>
                {header.map((cell, ci) => (
                  <th key={ci} style={{
                    padding: '8px 10px', background: '#f4f2ee',
                    border: '1px solid #e5e3df', textAlign: 'left', fontWeight: 600,
                  }}>{cell}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{
                    padding: '7px 10px', border: '1px solid #e5e3df',
                    background: ri % 2 === 0 ? '#fff' : '#fafaf8',
                    verticalAlign: 'top',
                  }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  return null
}

// ── Helpers ──────────────────────────────────────────

function extractScripts(blocks) {
  const scripts = []
  // Look for consecutive paragraphs or callouts that contain EN/DE markers
  let i = 0
  while (i < blocks.length) {
    const block = blocks[i]
    const text = getBlockText(block)
    if (text.match(/^(🇬🇧|EN:|English:)/i) || text.match(/^(🇩🇪|DE:|German:|Deutsch:)/i)) {
      // Found a script block
      const script = {}
      if (text.match(/^(🇬🇧|EN:|English:)/i)) {
        script.en = text.replace(/^(🇬🇧|EN:|English:)\s*/i, '').replace(/^["']|["']$/g, '')
      } else {
        script.de = text.replace(/^(🇩🇪|DE:|German:|Deutsch:)\s*/i, '').replace(/^["']|["']$/g, '')
      }
      i++
      // Check next block for the other language
      if (i < blocks.length) {
        const next = getBlockText(blocks[i])
        if (next.match(/^(🇩🇪|DE:|German:|Deutsch:)/i) && !script.de) {
          script.de = next.replace(/^(🇩🇪|DE:|German:|Deutsch:)\s*/i, '').replace(/^["']|["']$/g, '')
          i++
        } else if (next.match(/^(🇬🇧|EN:|English:)/i) && !script.en) {
          script.en = next.replace(/^(🇬🇧|EN:|English:)\s*/i, '').replace(/^["']|["']$/g, '')
          i++
        }
      }
      if (script.en || script.de) scripts.push(script)
      continue
    }
    i++
  }

  // Fallback: look in callouts for quoted bilingual text
  if (scripts.length === 0) {
    for (const block of blocks) {
      const text = getBlockText(block)
      const enMatch = text.match(/EN[:\s]+[""]([^""]+)[""]/i) || text.match(/English[:\s]+[""]([^""]+)[""]/i)
      const deMatch = text.match(/DE[:\s]+[""]([^""]+)[""]/i) || text.match(/Deutsch[:\s]+[""]([^""]+)[""]/i)
      if (enMatch || deMatch) {
        scripts.push({
          en: enMatch?.[1] || '',
          de: deMatch?.[1] || '',
          moment: '',
        })
      }
      // Look for inline bilingual quote in callout
      const inlineEN = text.match(/[""]([^""]{10,})[""]\s*\/\s*[""]([^""]{10,})[""]/)
      if (inlineEN) {
        scripts.push({ en: inlineEN[1], de: inlineEN[2], moment: '' })
      }
    }
  }

  return scripts
}

function extractQuickRef(sections) {
  const quickKey = Object.keys(sections).find(k => k.includes('quick'))
  if (!quickKey) return []
  return sections[quickKey]
    .filter(i => i.type === 'bullet')
    .map(i => i.text)
}

function extractDonts(sections) {
  const dontKey = Object.keys(sections).find(k =>
    k.includes('non_negotiable') || k.includes('do_not') || k.includes('don_t') || k.includes('dont')
  )
  if (!dontKey) return []
  return sections[dontKey]
    .filter(i => i.type === 'bullet' || i.type === 'callout')
    .map(i => i.text)
}

const SKIP_SECTIONS = ['quick', 'non_negotiable', 'do_not', 'don_t', 'dont']
const SECTION_EMOJIS = {
  'purpose': '🎯', 'at_a_glance': '🔖', 'step': '🪜', 'pre': '🪜',
  'post': '✅', 'client': '🗣️', 'brava': '⭐', 'overview': '📋', 'assessment': '🔍',
}

function buildMainSections(sections) {
  return Object.entries(sections)
    .filter(([key]) => !SKIP_SECTIONS.some(s => key.includes(s)))
    .filter(([, items]) => items.length > 0)
    .map(([key, items]) => {
      const emoji = Object.entries(SECTION_EMOJIS).find(([k]) => key.includes(k))?.[1] || '📋'
      const title = key.replace(/_/g, ' ').replace(/^\d+\s*/, '').trim()
        .replace(/\b\w/g, c => c.toUpperCase())
      return { title, emoji, items }
    })
}

function getBlockText(block) {
  const type = block.type
  const data = block[type]
  if (!data?.rich_text) return ''
  return data.rich_text.map(r => r.plain_text || '').join('')
}
