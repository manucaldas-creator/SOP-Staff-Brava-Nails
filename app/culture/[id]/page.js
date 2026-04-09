import { getAllCulture, getPageContent } from '../../../lib/notion'
import ContentClient from '../../ContentClient'

export const revalidate = 300

export async function generateStaticParams() {
  try { const c = await getAllCulture(); return c.map(x => ({ id: x.id })) } catch { return [] }
}

export default async function CulturePage({ params }) {
  let item = null, content = null
  try {
    const all = await getAllCulture()
    item = all.find(c => c.id === params.id)
    if (!item) return <div style={{ padding: 32 }}>Not found. <a href="/" style={{ color: '#4d6dff' }}>← Back</a></div>
    content = await getPageContent(item.pageId)
  } catch(e) {
    return <div style={{ padding: 32 }}>Error loading page. <a href="/" style={{ color: '#4d6dff' }}>← Back</a></div>
  }
  return <ContentClient title={item.title} icon={item.icon} badge={item.type} sections={content.sections} notionUrl={item.notionUrl} backLabel="← Culture" backHref="/?tab=culture" accentColor="#534ab7" />
}
