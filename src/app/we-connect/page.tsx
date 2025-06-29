'use client'

import styles from './page.module.css'

export default function WeConnect() {
  return (
    <div data-page-url="/we-connect">
      {/* Hero Banner */}
      <div className={styles.heroBanner}>
        <img 
          src="https://grnds-registry-sandbox.s3.amazonaws.com/media/registries/264/2644c41a-bb03-4bdc-87c6-5c8599f2fb5a/hero-image-we%20connect%201.png"
          alt="We Connect - Couple waving at laptop"
          className={styles.heroImage}
        />
      </div>

      <section className="section">
        <div className="container container-small">
          <article className="page-content">
            <div className="container container-small">
              <h1 className={styles.mainTitle}>We Connect</h1>
              
              <p className={styles.centeredText}>
                Are you sad that some of your loved ones are or will be far away and will not be
                <br />
                able to celebrate with you the special event you are organizing?
              </p>

              <p className={styles.centeredText}>
                Send them along with the invitation, the surprise of eventually being able to overcome any
                <br />
                obstacle and live this special moment with you!
              </p>

              <p className={styles.centeredText}>
                So don't feel that way... at least not about the part you can change.
              </p>

              <p className={styles.centeredText}>
                Discover <strong>WE CONNECT</strong> service, a free GrantDays service that enables you to connect via
                <br />
                videoconference with the guests who are miles away.
              </p>

              <p className={styles.centeredText}>
                Follow below simple steps to activate and enjoy its benefits.
              </p>

              <div className={styles.stepsContainer}>
                <div className={styles.stepItem}>
                  <p className={styles.stepText}>
                    <span className={styles.highlight}>Activate</span> the service in your <strong>Event Settings</strong>.
                  </p>
                </div>

                <div className={styles.stepItem}>
                  <p className={styles.stepText}>
                    <span className={styles.highlight}>Inform your guests</span> about the possibility of videoconference the day of your event. You can select and 
                    edit the default text when you send out the digital invitation to your event and registry (Invitations at 
                    your Event Settings).
                  </p>
                </div>

                <div className={styles.stepItem}>
                  <p className={styles.stepText}>
                    <span className={styles.highlight}>GrantDays team will contact you to</span>
                  </p>
                  <ul className={styles.bulletList}>
                    <li>set-up the videoconference,</li>
                    <li>send a reminder to your guests with the videoconference link and</li>
                    <li>help you manage the videoconference during your event, as per the instructions and preferences you will define.</li>
                  </ul>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
} 