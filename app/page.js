import { getAllSOPs, getAllFAQs, getAllCulture, seriesConfig } from '../lib/notion'
import HomeClient from './HomeClient'

export const revalidate = 300

export default async function Home() {
  let sops = [], faqs = [], culture = []
  try { sops    = await getAllSOPs()    } catch(e) { console.error('SOPs:', e.message) }
  try { faqs    = await getAllFAQs()    } catch(e) { console.error('FAQs:', e.message) }
  try { culture = await getAllCulture() } catch(e) { console.error('Culture:', e.message) }
  return <HomeClient sops={sops} faqs={faqs} culture={culture} seriesConfig={seriesConfig} />
}
