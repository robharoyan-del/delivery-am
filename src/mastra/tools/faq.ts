/**
 * getFAQs + getContactInfo tools.
 *
 * Current impl: static data.
 * Future: connect to PostgreSQL FAQ table, Notion, or Contentful.
 * RAG future: embed FAQ Q&A pairs, query with vector similarity for best match.
 */

import { tool } from 'ai'
import { z }    from 'zod'
import type { FaqEntry, FaqResponse, ContactInfo } from './types'

// TODO: Replace with: const faqs = await db.select().from(faqTable).orderBy(faqTable.order)
const FAQS: FaqEntry[] = [
  {
    id: '1', topic: 'how-it-works',
    q: 'How does package forwarding work?',
    a: 'You get a personal warehouse address (with a unique suite number) in the country you want to shop from. Use that address at checkout when ordering from any online store. We receive the package, consolidate it if needed, handle customs, and ship it to you in Armenia.',
  },
  {
    id: '2', topic: 'countries',
    q: 'Which countries can I shop from?',
    a: 'We have warehouses in **USA**, **China**, **Germany**, **UK**, **Italy**, and **UAE**. You get a personal suite address in each location.',
  },
  {
    id: '3', topic: 'shipping-time',
    q: 'How long does shipping take?',
    a: 'Delivery times by country:\n- 🇺🇸 USA: 5–7 days (air) / 10–14 days (standard)\n- 🇨🇳 China: 7–10 days (air)\n- 🇩🇪 Germany: 4–6 days\n- 🇬🇧 UK: 4–6 days\n- 🇮🇹 Italy: 7–10 days\n- 🇦🇪 UAE: 3–5 days (fastest)',
  },
  {
    id: '4', topic: 'customs',
    q: 'Do you handle customs?',
    a: 'Yes. We handle customs clearance on your behalf. Duties and taxes may apply depending on the declared value and type of goods.',
  },
  {
    id: '5', topic: 'suite-number',
    q: 'What is a suite number?',
    a: 'Your suite number is a unique 4-digit identifier linked to your account. Always include it in the shipping address when ordering from international stores so we can match packages to your account.',
  },
  {
    id: '6', topic: 'tracking',
    q: 'How do I track my package?',
    a: 'Once your package arrives at our warehouse and is shipped onward, you can track it from your **Dashboard** under the Parcels section.',
  },
  {
    id: '7', topic: 'kyc',
    q: 'What is KYC and why do I need it?',
    a: 'KYC (Know Your Customer) is an identity verification step required for customs clearance. Upload your government-issued ID in **Settings → Identity**.',
  },
  {
    id: '8', topic: 'account',
    q: 'How do I create an account?',
    a: 'Click **Sign Up** on the homepage, enter your name, email, and password. You\'ll immediately get access to your personal warehouse suite addresses.',
  },
  {
    id: '9', topic: 'payment',
    q: 'How do payments work?',
    a: 'You can top up your balance from the Dashboard. Shipping fees are deducted from your balance when your parcel is dispatched.',
  },
  {
    id: '10', topic: 'prohibited',
    q: 'Are there prohibited items?',
    a: 'We cannot ship dangerous goods, flammables, lithium batteries over certain capacity, weapons, or counterfeit products. Contact support for specific questions.',
  },
]

// TODO: Replace with database or CMS query for contact info
const CONTACT: ContactInfo = {
  email:   'support@delivery.am',
  phone:   '+374 11 000 000',
  address: 'Yerevan, Armenia',
  hours:   'Monday–Friday, 9:00–18:00 (Yerevan time, UTC+4)',
  social:  {
    instagram: 'https://instagram.com/delivery.am',
    telegram:  'https://t.me/deliveryam',
  },
}

// ── Tools ─────────────────────────────────────────────────────────────────────

export const getFAQs = tool({
  description: 'Returns frequently asked questions and answers about Delivery.am services.',
  inputSchema: z.object({
    topic: z.string().optional().describe('Optional keyword to filter FAQs (e.g. "customs", "tracking", "kyc")'),
  }),
  execute: async ({ topic }): Promise<FaqResponse> => {
    const faqs = topic
      ? FAQS.filter(f =>
          f.topic.includes(topic.toLowerCase()) ||
          f.q.toLowerCase().includes(topic.toLowerCase()) ||
          f.a.toLowerCase().includes(topic.toLowerCase())
        )
      : FAQS
    return { faqs: faqs.length ? faqs : FAQS, topic: topic ?? null }
  },
})

export const getContactInfo = tool({
  description: 'Returns contact information for the Delivery.am support team — email, phone, address, hours.',
  inputSchema: z.object({}),
  execute: async (): Promise<ContactInfo> => CONTACT,
})
