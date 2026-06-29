/**
 * navigateUser tool — returns page URLs to guide users.
 *
 * Future: add dynamic routes, locale-aware URLs, auth-state-aware routes.
 */

import { tool }  from 'ai'
import { z }     from 'zod'
import type { NavResult, PageKey } from './types'

// TODO: Replace with CMS-driven navigation or database config
const NAV_MAP: Record<PageKey, NavResult> = {
  home:      { url: '/',           label: 'Home'            },
  dashboard: { url: '/dashboard',  label: 'Dashboard'       },
  settings:  { url: '/settings',   label: 'Account Settings'},
  contact:   { url: '/contact',    label: 'Contact Us'      },
  privacy:   { url: '/privacy',    label: 'Privacy Policy'  },
  terms:     { url: '/terms',      label: 'Terms of Service'},
}

export const navigateUser = tool({
  description: 'Returns the URL for a specific page on the Delivery.am website to help the user navigate.',
  inputSchema: z.object({
    page: z
      .enum(['home', 'dashboard', 'settings', 'contact', 'privacy', 'terms'])
      .describe('The page to navigate to'),
  }),
  execute: async ({ page }): Promise<NavResult> => {
    return NAV_MAP[page as PageKey] ?? NAV_MAP.home
  },
})
