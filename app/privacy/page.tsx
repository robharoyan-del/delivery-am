import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from '../static-page.module.css'

export const metadata = {
  title: 'Privacy Policy — Delivery.am',
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>Legal</p>
            <h1 className={styles.title}>Privacy Policy</h1>
            <p className={styles.subtitle}>
              How we collect, use, and protect your personal information.
            </p>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Information We Collect</h2>
            <p className={styles.text}>
              When you register with Delivery.am, we collect your name, email address, and optionally your phone number. When you add a parcel, we collect shipment details including tracking numbers, declared values, and country of origin.
            </p>
            <p className={styles.text}>
              For identity verification (KYC), we collect government-issued ID documents and selfie photos. These are stored securely and used solely for verification purposes in compliance with Armenian customs regulations.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>How We Use Your Information</h2>
            <p className={styles.text}>
              We use your information to provide our parcel forwarding service, process customs declarations, send shipment status updates, and improve our platform. We do not sell your personal data to third parties.
            </p>
            <p className={styles.text}>
              Your warehouse address is generated from your user ID and is used to identify your parcels at our warehouse facilities. Your declared parcel values are used for customs duty calculation as required by Armenian law.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Data Storage & Security</h2>
            <p className={styles.text}>
              Your data is stored on secure servers provided by Supabase, located in the EU. All data is encrypted in transit using TLS and at rest using AES-256 encryption. KYC documents are stored in a private, access-controlled storage bucket accessible only to you and authorized staff.
            </p>
            <p className={styles.text}>
              We retain your account data for as long as your account is active. You may request deletion of your account and all associated data at any time by contacting support@delivery.am.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Cookies</h2>
            <p className={styles.text}>
              We use only essential cookies required for authentication and session management. We do not use advertising or tracking cookies.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Your Rights</h2>
            <p className={styles.text}>
              You have the right to access, correct, or delete your personal data at any time. You can update most information directly in your account settings. For data deletion requests or other inquiries, contact us at support@delivery.am.
            </p>
          </div>

          <p className={styles.updated}>Last updated: June 2026</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
