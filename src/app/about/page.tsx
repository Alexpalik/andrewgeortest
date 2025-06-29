'use client'

import styles from './page.module.css'

export default function AboutUs() {
  return (
    <main>
      {/* Hero Banner */}
      <div className={styles.pageBanner}>
        <img 
          src="https://cdn11.bigcommerce.com/s-fw54kk4zpe/images/stencil/2560w/image-manager/hero-image-about-us.png" 
          alt="About Us Banner"
        />
      </div>

      {/* Header Section with Background */}
      <section className={styles.headerSection}>
        <div className={styles.container}>
          <h1 className={styles.mainTitle}>About us</h1>
          <div className={styles.quote}>
            <p className={styles.quoteText}>
            Here the registry becomes an interactive tool of communication between you and your guests, a platform to express emotions, to give and to support. You can create your own list in the simple steps below
            </p>
           
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className={styles.aboutSection}>
        <div className={styles.container}>
          <div className={styles.contentContainer}>
            {/* First Content Block - Centered */}
            <div className={`${styles.contentBlock} ${styles.centeredContent}`}>
              <p className={styles.bodyText}>
              The next most important days are those filled with moments of reciprocated love and care between you and your loved ones.
              </p>
              <p className={styles.bodyText}>
              And we all have special days when we particularly feel the need to express or receive love, recognition and ultimate support.
              </p>
              <p className={styles.bodyText}>
              There are two kinds of “distances” for those who want to celebrate an important moment with friends and relatives: First, the geographical distance. Second, the emotional distance due to hesitation, which often does not allow us to express our feelings freely. Those kinds of “distances” we aspire to cover at Grantdays.
              </p>
              <p className={styles.bodyText}>
              Either you wish to give as a giver, or you expect to receive as a receiver, you are welcome to GrantDays village, a place where gifting takes a deeper dimension, the one of GRANTING.
              </p>
            </div>

            {/* Single Image Section */}
            <div className={styles.singleImageContainer}>
              <img 
                src="https://cdn11.bigcommerce.com/s-fw54kk4zpe/images/stencil/2560w/image-manager/about-us1.png" 
                alt="About Us Image"
              />
            </div>

            {/* Second Content Block - Centered */}
            <div className={`${styles.contentBlock} ${styles.centeredContent}`}>
              <h2 className={styles.sectionTitle}>At GrantDays we celebrate the special days of our life</h2>
              <p className={styles.bodyText}>
              Those days that each of us considers unique and every gift we receive or offer can be turned into a generous sponsorship, since we genuinely believe that giving is an expression of strong emotions and selfless support.    
              </p> 
                
              <p className={styles.bodyText}>
              After many discussions, a lot of analysis and searching of many relevant cases, we found that unhindered and taboo-free communication between the person who celebrates/the organiser and the guests can elevate the process and become the fertiliser needed to cultivate the fertile ground of strong bonds between them. An interactive communication in which the former can share their needs and preferences and the latter can choose or counter-suggest how to contribute.
              So, we invite you to put on your most “Grant” mood and join us in a special narrative about the vision and idea behind GrantDays!
              </p>

              
              <div className={styles.brushImageContainer} style={{display:'none'}}>
                <img 
                  src="/images/BRUSH 2.png" 
                  alt="Grant διάθεση message"
                  className={styles.brushImage}
                />
                <div className={styles.brushTextOverlay}>
                  Σε προσκαλούμε λοιπόν να φορέσεις την πιο «Grant» διάθεσή σου και να μας ακολουθήσεις σε μία ιδιαίτερη αφήγηση σχετικά με το όραμα και την ιδέα που κρύβεται μέσα στην GrantDays!
                </div>
              </div>
            </div> 
              



            {/* Story Section */}
            <div className={styles.storySection}>
              <div className={styles.storyHeader}>
                <h2 className={styles.storyTitle}>Our Story</h2>
              </div>
              
              <div className={styles.storyContent}>
                <div style={{fontSize: '1.25rem', color:'#063B67' , fontWeight:'500'}} className={styles.bodyText}>How it all started…</div>

                <p className={styles.bodyText} style={{marginBottom:0}}>
                At some point, some of us have been invited to the wedding of a friend or a relative and been politely asked to participate in their wedding list in case we wished to contribute to their new beginning with a little help.
                </p>
                <p className={styles.bodyText} style={{marginBottom:0}}>
                Some of us have visited the pre-selected shop and chosen one of the gifts in the list or deposited an amount in the bank account written at the bottom of the invitation. Some of us might have felt a bit uncomfortable when we could only contribute as much, either because that was what we could afford at that time or because that was what we simply wanted to contribute.
                </p>
                <p className={styles.bodyText} style={{marginBottom:0}}>
                Some of us were the couple who got married and although we needed financial support, like almost every couple for their new beginning, we felt somewhat uncomfortable asking our family and friends for it. Perhaps we also felt quite stressed and frustrated that we had to put so much effort into creating our own "wedding registry" because there was no "one place that had it all" for our guests to choose their gift easily and conveniently.
                </p>
                <p className={styles.bodyText} style={{marginBottom:0}}>
                And at other milestone moments in our lives, some of us have wondered… "Is a wedding the only big event worthy of love and support?"
                </p>
                <p className={styles.bodyText} style={{marginBottom:0}}>
                Our tradition has it that people come together to celebrate important moments, new beginnings, big achievements or recognitions… Beautiful tradition!
                </p>
                <p className={styles.bodyText} style={{marginBottom:0}}>
                At GrantDays we believe that beautiful traditions should be protected and continued…
                </p>
              </div>

              <div className={styles.beliefStatement} style={{display:'none'}}>
                <p>Στην GrantDays πιστεύουμε ότι οι όμορφες παραδόσεις πρέπει να</p>
                <p>διαφυλάσσονται και να συνεχίζονται...</p>
              </div>
            </div>

            {/* Final Image */}
            <div className={styles.finalImageContainer}>
              <img 
                src="https://cdn11.bigcommerce.com/s-fw54kk4zpe/images/stencil/2560w/image-manager/aboutus-2.png" 
                alt="Final Image"
              />
            </div>

            {/* Final Section */}
            <div className={styles.finalSection}>
              <div className={styles.finalTitle}>We are here for you</div>
              <p className={styles.bodyText} style={{marginBottom:0}}>
              Therefore... We are here to add a creative spin, unleash the potential of the traditional “wedding list” and create something much bigger, inspired by emotions and love, without taboos and personal constraints.
              </p>
              <p className={styles.bodyText}>
              We are here to help you create any type of registry (gift list) you need, focusing on the charismatic human values of giving and support… or on what we like to call GRANTING!
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
