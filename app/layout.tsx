import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { LanguageProvider } from '@/lib/i18n'
import AuthModal from '@/components/AuthModal'

export const metadata: Metadata = {
  title: 'Delivery.am — Shop Worldwide, Receive in Armenia',
  description:
    'Your personal warehouse address abroad. Order from anywhere — we handle customs and deliver straight to your door in Armenia.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <AuthProvider>
            {children}
            <AuthModal />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
