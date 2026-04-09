import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

// ── IDs de las tres bases de datos ───────────────────────────────────────────
export const DB = {
  sops:    '6d7b2b96-566f-4c9c-aabb-329789feae5c',
  faqs:    'fdf80135-d1e9-4c07-b329-ccc049a45a50',
  culture: '02b15e9b-e4c1-4d28-8177-f4b18c84d700',
}

// ── Config visual de cada serie ──────────────────────────────────────────────
export const seriesConfig = {
  Treatments:      { key: 'T', color: '#185fa5', bg: '#e6f1fb', owner: 'Alicia' },
  Hygiene:         { key: 'H', color: '#854f0b', bg: '#faeeda', owner: 'Alicia' },
  'Studio Ops':    { key: 'S', color: '#534ab7', bg: '#eeedfe', owner: 'Manu'   },
  'Client Journey':{ key: 'C', color: '#0f6e56', bg: '#e1f5ee', owner: 'Manu'  },
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function richText(arr) {
  if (!Array.isArray(arr)) return ''
  return arr.map(r => r.plain_text || '').join('')
}

function getProp(props, name) {
  const p = props[name]
  if (!p) return ''
  if (p.type === 'title')      return richText(p.title)
  if (p.type === 'rich_text')  return richText(p.rich_text)
  if (p.type === 'select')     return p.select?.name || ''
  if (p.type === 'number')     return p.number ?? ''
  return ''
}

async function queryDB(dbId, sorts = []) {
  const results = []
  let cursor = undefined
  do {
    const res = await notion.databases.query({
      database_id: dbId,
      sorts,
      start_cursor: cursor,
      page_size: 100,
    })
    results.push(...res.results)
    cursor = res.has_more ? res.next_cursor : undefined
  } while (cursor)
  return results
}

// ── SOPs ─────────────────────────────────────────────────────────────────────
export async function getAllSOPs() {
  const rows = await queryDB(DB.sops, [
    { property: 'Series',     direction: 'ascending' },
    { property: 'Sort Order', direction: 'ascending' },
  ])

  return rows.map(page => {
    const p = page.properties
    const series = getProp(p, 'Series')
    const name   = getProp(p, 'Name')
    return {
      id:        page.id.replace(/-/g, ''),
      pageId:    page.id,
      code:      getProp(p, 'Code'),
      title:     name.replace(/^SOP-[A-Z]+\d+[a-z]?\s*[—\-–]\s*/i, '').trim(),
      fullTitle: name,
      series,
      seriesKey: seriesConfig[series]?.key || 'S',
      status:    getProp(p, 'Status'),
      owner:     getProp(p, 'Owner'),
      icon:      page.icon?.emoji || '📋',
      notionUrl: page.url,
    }
  })
}

// ── FAQs ─────────────────────────────────────────────────────────────────────
export async function getAllFAQs() {
  const rows = await queryDB(DB.faqs, [
    { property: 'Sort Order', direction: 'ascending' },
  ])

  return rows.map(page => {
    const p = page.properties
    return {
      id:       page.id.replace(/-/g, ''),
      pageId:   page.id,
      question: getProp(p, 'Question'),
      category: getProp(p, 'Category'),
      urgency:  getProp(p, 'Urgency'),
      icon:     page.icon?.emoji || '❓',
      notionUrl: page.url,
    }
  })
}

// ── Culture ──────────────────────────────────────────────────────────────────
export async function getAllCulture() {
  const rows = await queryDB(DB.culture, [
    { property: 'Sort Order', direction: 'ascending' },
  ])

  return rows.map(page => {
    const p = page.properties
    return {
      id:       page.id.replace(/-/g, ''),
      pageId:   page.id,
      title:    getProp(p, 'Title'),
      type:     getProp(p, 'Type'),
      icon:     page.icon?.emoji || '🧭',
      notionUrl: page.url,
    }
  })
}

// ── Contenido de una página individual ──────────────────────────────────────
export async function getPageContent(pageId) {
  const page = await notion.pages.retrieve({ page_id: pageId })

  const allBlocks = []
  let cursor = undefined
  do {
    const res = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
      start_cursor: cursor,
    })
    allBlocks.push(...res.results)
    cursor = res.has_more ? res.next_cursor : undefined
  } while (cursor)

  const sections = {}
  let currentSection = null
  let currentItems   = []

  for (const block of allBlocks) {
    const text = getBlockText(block)

    if (block.type === 'heading_2' || block.type === 'heading_3') {
      if (currentSection) sections[currentSection] = currentItems
      currentSection = text.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_')
      currentItems   = []
    } else if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
      currentItems.push({ type: 'bullet', text })
    } else if (block.type === 'callout') {
      currentItems.push({ type: 'callout', text, emoji: block.callout?.icon?.emoji || '💡' })
    } else if (block.type === 'paragraph' && text.trim()) {
      currentItems.push({ type: 'paragraph', text })
    } else if (block.type === 'table') {
      const rows = await notion.blocks.children.list({ block_id: block.id, page_size: 50 })
      const data = rows.results.map(r => r.table_row?.cells?.map(c => richText(c)) || [])
      currentItems.push({ type: 'table', data })
    } else if (block.type === 'divider') {
      currentItems.push({ type: 'divider' })
    }
  }
  if (currentSection && currentItems.length) sections[currentSection] = currentItems

  return { sections, rawBlocks: allBlocks, icon: page.icon?.emoji }
}

function getBlockText(block) {
  const data = block[block.type]
  if (!data?.rich_text) return ''
  return richText(data.rich_text)
}
