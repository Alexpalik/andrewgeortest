'use client'

import styles from './page.module.css'

export default function Events() {
  return (
    <>
      {/* Hero Banner - Full Width */}
      <div className={styles.fullWidthBanner}>
        <img 
          src="https://cdn11.bigcommerce.com/s-fw54kk4zpe/images/stencil/original/image-manager/hero-image-events-to-celebrate-1.png?t=1699618332"
          alt="Celebrate Image"
          className="w-full"
          style={{ maxHeight: '500px', objectFit: 'cover' }}
        />
      </div>
      
      <div data-page-url="/events" className={styles.eventsPage}>
        <div className={styles.headerSection}>
          <h1 className={`${styles['text-46']} ${styles.serifHeading}`}>Events</h1>
          
          <div className={styles.centeredText}>
            <p>
              Δημιούργησε τη λίστα δώρων σου για οποιαδήποτε ιδιαίτερη στιγμή στη ζωή σου και 
              άφησε τους καλεσμένους σου να ανακαλύψουν και να σου προσφέρουν τα δώρα που 
              επιθυμείς.
            </p>
          </div>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.leftAlignedText}>
            <p style={{marginBottom: 10}}>
              Στην GrantDays το κάθε event και η κάθε μέρα που θέλεις να γιορτάσεις θεωρούνται μοναδικά. Εδώ, 
              κάθε γεγονός που θέλεις να διοργανώσεις,όσο μικρό ή μεγάλο και αν είναι, το αντιμετωπίζουμε ως ένα 
              «Grant» Event!
              </p> 
              <p>
              Και... η λίστα με τα εορταστικά events είναι ατελείωτη, όπως ατελείωτες είναι και οι προτάσεις για τη 
              δημιουργία λίστας δώρων.
            </p>
            <p>
              Παρακάτω βρες μερικές μόνο ιδέες προς έμπνευση:
            </p>
          </div>
        </div>

        <div className={styles['page-list-container']}>
          <ul>
            <li><a href="https://grantdays.eu/wedding/">Wedding</a></li>
            <li><a href="https://grantdays.eu/student-life/">Student Life</a></li>
            <li><a href="https://grantdays.eu/other/">Mother's Day</a></li>
            <li><a href="https://grantdays.eu/other/">Engagement</a></li>
            <li><a href="https://grantdays.eu/other/">New Beginning!</a></li>
            <li><a href="https://grantdays.eu/other/">Father's Day</a></li>
            <li><a href="https://grantdays.eu/baptism/">Baptism / Name Giving</a></li>
            <li><a href="https://grantdays.eu/other/">New Home</a></li>
            <li><a href="https://grantdays.eu/other/">Christmas</a></li>
            <li><a href="https://grantdays.eu/other/">Newborn Baby</a></li>
            <li><a href="https://grantdays.eu/other/">New Job / New Position</a></li>
            <li><a href="https://grantdays.eu/other/">New Year's Eve/Day</a></li>
            <li><a href="https://grantdays.eu/baby-shower/">Baby Shower</a></li>
            <li><a href="https://grantdays.eu/other/">Business Start up</a></li>
            <li><a href="https://grantdays.eu/other/">Easter</a></li>
            <li><a href="https://grantdays.eu/other/">Bride Shower</a></li>
            <li><a href="https://grantdays.eu/other/">Job Promotion</a></li>
            <li><a href="https://grantdays.eu/other/">Carnival</a></li>
            <li><a href="https://grantdays.eu/birthday/">Birthday</a></li>
            <li><a href="https://grantdays.eu/other/">First Day at School</a></li>
            <li><a href="https://grantdays.eu/other/">Halloween</a></li>
            <li><a href="https://grantdays.eu/other/">Anniversary</a></li>
            <li><a href="https://grantdays.eu/other/">Get Well Soon...</a></li>
            <li><a href="https://grantdays.eu/other/">St. Valentines</a></li>
            <li><a href="https://grantdays.eu/other/">Nameday</a></li>
            <li><a href="https://grantdays.eu/other/">Congratulations</a></li>
            <li><a href="https://grantdays.eu/other/">Thanksgiving</a></li>
            <li><a href="https://grantdays.eu/other/">Graduation</a></li>
            <li><a href="https://grantdays.eu/other/">Just Because...</a></li>
            <li><a href="https://grantdays.eu/other/">Surprise Party</a></li>
            <li><a href="https://grantdays.eu/other/">Welcome...</a></li>
            <li><a href="https://grantdays.eu/other/">For a 'Thank You'...</a></li>
            <li><a href="https://grantdays.eu/lets-event/">Group Activity</a></li>
          </ul>
        </div>

        <div className={styles['button-container']}>
          <a href="https://registry.grantdays.eu/create-registry?lang=el" className={styles['primary-button']}>
            Μάθε περισσότερα
          </a>
        </div>
      </div>
    </>
  )
} 