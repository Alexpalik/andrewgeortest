import styles from './page.module.css';
import GiftCardsSection from "./GiftCardsSection";


export default function GiftsBanner() {
  return (
    <>
      <div className={styles.giftBanner}>
        <img
          src="/images/giftPhoto.png" // Replace with your own image path
          alt="Gift Banner"
          className={styles.giftBannerImage}
        />
        <div className={styles.giftBannerText}>
          Δώρα που γίνονται<br />
          με τη συνεισφορά των<br />
          αγαπημένων σου εύκολα<br />
          και
        </div>
      </div>
      <section className={styles.giftHeaderSection}>
        <div className={styles.giftHeaderContainer}>
          <h1 className={styles.giftMainTitle}>Χρηματικά δώρα</h1>
          <p className={styles.giftSubtitle}>
            Μερικά δώρα δεν χωράνε σε κουτιά, αλλά μπορούν να προσφέρουν χαρά, άνεση ή<br /> ακόμα και στήριξη σε κάτι που έχει αξία για εσένα. Εδώ θα βρεις ιδέες για ψηφιακά <br />δώρα προσαρμοσμένα στις ανάγκες και τις επιθυμίες σου...<br />
            γιατί το καλύτερο δώρο είναι αυτό που ταιριάζει σε σένα.
          </p>
        </div>
      </section>
      <GiftCardsSection />
      
    </>
  );
}