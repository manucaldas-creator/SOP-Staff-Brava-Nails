import { getAllFAQs, getPageContent } from '../../../lib/notion'
import ContentClient from '../../ContentClient'

export const revalidate = 300

export async function generateStaticParams() {
  try { const f = await getAllFAQs(); return f.map(x => ({ id: x.id })) } catch { return [] }
}

export default async function FAQPage({ params }) {
  let item = null, content = null
  try {
    const all = await getAllFAQs()
    item = all.find(f => f.id === params.id)
    if (!item) return <div style={{ padding: 32 }}>FAQ not found. <a href="/" style={{ color: '#4d6dff' }}>← Back</a></div>
    content = await getPageContent(item.pageId)
  } catch(e) {
    return <div style={{ padding: 32 }}>Error loading FAQ. <a href="/" style={{ color: '#4d6dff' }}>← Back</a></div>
  }
  return <ContentClient title={item.question} icon={item.icon} badge={item.category} badgeUrgent={item.urgency === 'Urgent'} sections={content.sections} notionUrl={item.notionUrl} backLabel="← FAQs" backHref="/?tab=faqs" accentColor="#4d6dff" />
}
