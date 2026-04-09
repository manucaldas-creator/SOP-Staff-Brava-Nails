import { getAllSOPs, getPageContent, seriesConfig } from '../../../lib/notion'
import SOPClient from './SOPClient'

export const revalidate = 300

export async function generateStaticParams() {
  try { const s = await getAllSOPs(); return s.map(x => ({ id: x.id })) } catch { return [] }
}

export default async function SOPPage({ params }) {
  let sop = null, content = null
  try {
    const all = await getAllSOPs()
    sop = all.find(s => s.id === params.id)
    if (!sop) return <div style={{ padding: 32 }}>SOP not found. <a href="/" style={{ color: '#4d6dff' }}>← Back</a></div>
    content = await getPageContent(sop.pageId)
  } catch(e) {
    return <div style={{ padding: 32 }}>Error loading SOP. <a href="/" style={{ color: '#4d6dff' }}>← Back</a></div>
  }
  const cfg = seriesConfig[sop.series] || seriesConfig['Studio Ops']
  return <SOPClient sop={sop} cfg={cfg} sections={content.sections} rawBlocks={content.rawBlocks} />
}
