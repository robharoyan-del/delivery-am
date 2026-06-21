import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import styles from '../static-page.module.css'

export const metadata = {
  title: 'Terms of Service — Delivery.am',
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>Legal</p>
            <h1 className={styles.title}>Terms of Service</h1>
            <p className={styles.subtitle}>
              Please read these terms carefully before using Delivery.am.
            </p>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Service Description</h2>
            <p className={styles.text}>
              Delivery.am provides a parcel forwarding service that gives users a personal warehouse address in supported countries (USA, China, Germany, UK, Italy, UAE). We receive parcels on your behalf and ship them to Armenia.
            </p>
            <p className={styles.text}>
              By creating an account, you agree to these terms and confirm that you are at least 18 years old and legally capable of entering into a binding agreement.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Prohibited Items</h2>
            <p className={styles.text}>
              You may not ship items that are illegal under Armenian law or the law of the country of origin. This includes but is not limited to: weapons, narcotics, counterfeit goods, hazardous materials, live animals, and perishable food items.
            </p>
            <p className={styles.text}>
              Delivery.am reserves the right to refuse, return, or dispose of any shipment found to contain prohibited items, at the customer's expense.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Declared Value & Customs</h2>
            <p className={styles.text}>
              You are responsible for accurately declaring the value of your parcels. Armenian customs regulations impose a 15% duty on the declared value of goods exceeding €200 per month. Delivery.am is not liable for customs delays, duties, or seizures resulting from inaccurate declarations.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Liability</h2>
            <p className={styles.text}>
              Delivery.am is not responsible for damage or loss caused by third-party carriers, customs authorities, or force majeure events. Our liability for lost or damaged parcels is limited to the declared value of the shipment, up to a maximum of $200 USD.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Account Termination</h2>
            <p className={styles.text}>
              We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or abuse our service. You may close your account at any time by contacting support@delivery.am.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Changes to Terms</h2>
            <p className={styles.text}>
              We may update these terms from time to time. We will notify registered users of material changes by email. Continued use of the service after notification constitutes acceptance of the updated terms.
            </p>
          </div>

          <p className={styles.updated}>Last updated: June 2026</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
