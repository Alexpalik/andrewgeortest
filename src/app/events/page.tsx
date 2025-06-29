'use client'

import styles from './page.module.css'

export default function Events() {
  return (
    <div data-page-url="/events">
      {/* Hero Banner */}
      <div className="page-banner">
        <img 
          src="https://cdn11.bigcommerce.com/s-fw54kk4zpe/images/stencil/original/image-manager/hero-image-events-to-celebrate-1.png?t=1699618332"
          alt="Celebrate Image"
          className="w-full"
          style={{ maxHeight: '500px', objectFit: 'cover' }}
        />
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="page--travelling">
          <div className="container-fluid content">
            <h1 className={`${styles['text-46']} ${styles.serifHeading}`}>Events</h1>
            <div className={styles['text-container']}>
              <p>
                Γιορτάζεις τον γάμο σου ή τον ερχομό ενός μωρού;
                <br />
                Έχεις τα γενέθλιά σου ή διοργανώνεις μια ξεχωριστή εκδήλωση;
                <br />
                Δημιούργησε τη λίστα δώρων σου για οποιαδήποτε ιδιαίτερη στιγμή στη ζωή σου και
                <br />
                άφησε τους καλεσμένους σου να ανακαλύψουν και να σου προσφέρουν τα δώρα που επιθυμείς.
              </p>

              <p>
                Στην GrantDays το κάθε event και η κάθε μέρα που θέλεις να γιορτάσεις θεωρούνται μοναδικά.
                <br />
                Εδώ, κάθε γεγονός που θέλεις να διοργανώσεις, όσο μικρό ή μεγάλο και αν είναι, το αντιμετωπίζουμε ως ένα «Grant» Event!
                <br />
                Και... η λίστα με τα εορταστικά events είναι ατελείωτη, όπως ατελείωτες είναι και οι προτάσεις για τη δημιουργία λίστας δώρων.
              </p>

              <p>
                Παρακάτω βρες μερικές μόνο ιδέες προς έμπνευση:
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles['page-list-container']}>
        <ul>
          <li><a href="https://grantdays.eu/wedding/">Γάμος</a></li>
          <li><a href="https://grantdays.eu/student-life/">Φοιτητική Ζωή</a></li>
          <li><a href="https://grantdays.eu/other/">Γιορτή της Μητέρας</a></li>
          <li><a href="https://grantdays.eu/other/">Αρραβώνας</a></li>
          <li><a href="https://grantdays.eu/other/">Καλορίζικο!</a></li>
          <li><a href="https://grantdays.eu/other/">Γιορτή του Πατέρα</a></li>
          <li><a href="https://grantdays.eu/baptism/">Βάπτιση</a></li>
          <li><a href="https://grantdays.eu/other/">Νέο Σπίτι</a></li>
          <li><a href="https://grantdays.eu/other/">Χριστούγεννα</a></li>
          <li><a href="https://grantdays.eu/other/">Γέννηση Μωρού</a></li>
          <li><a href="https://grantdays.eu/other/">Νέα Δουλειά</a></li>
          <li><a href="https://grantdays.eu/other/">Πρωτοχρονιά</a></li>
          <li><a href="https://grantdays.eu/baby-shower/">Baby Shower</a></li>
          <li><a href="https://grantdays.eu/other/">Εγκαίνια</a></li>
          <li><a href="https://grantdays.eu/other/">Πάσχα</a></li>
          <li><a href="https://grantdays.eu/other/">Bride Shower</a></li>
          <li><a href="https://grantdays.eu/other/">Προαγωγή</a></li>
          <li><a href="https://grantdays.eu/other/">Απόκριες</a></li>
          <li><a href="https://grantdays.eu/birthday/">Γενέθλια</a></li>
          <li><a href="https://grantdays.eu/other/">Πρώτη Μέρα Σχολείο</a></li>
          <li><a href="https://grantdays.eu/other/">Halloween</a></li>
          <li><a href="https://grantdays.eu/other/">Επέτειος</a></li>
          <li><a href="https://grantdays.eu/other/">Περαστικά…</a></li>
          <li><a href="https://grantdays.eu/other/">Αγ. Βαλεντίνος</a></li>
          <li><a href="https://grantdays.eu/other/">Ονομαστική Εορτή</a></li>
          <li><a href="https://grantdays.eu/other/">Συγχαρητήρια</a></li>
          <li><a href="https://grantdays.eu/other/">Thanksgiving</a></li>
          <li><a href="https://grantdays.eu/other/">Αποφοίτηση</a></li>
          <li><a href="https://grantdays.eu/other/">Απλά Επειδή…</a></li>
          <li><a href="https://grantdays.eu/other/">Πάρτυ έκπληξη</a></li>
          <li><a href="https://grantdays.eu/other/">Καλωσόρισμα…</a></li>
          <li><a href="https://grantdays.eu/other/">Για 'Ευχαριστώ'…</a></li>
          <li><a href="https://grantdays.eu/lets-event/">Ομαδική Δραστηριότητα</a></li>
        </ul>
      </div>

      <div className={styles['button-container']}>
        <a href="https://registry.grantdays.eu/create-registry?lang=el" className={styles['primary-button']}>
          ΦΤΙΑΞΕ ΤΗ ΛΙΣΤΑ ΣΟΥ
        </a>
      </div>
    </div>
  )
} 