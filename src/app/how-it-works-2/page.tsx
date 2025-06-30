'use client'

import styles from './page.module.css'
import Link from 'next/link'

export default function HowItWorks2() {
  return (
    <main>
      {/* Hero Banner */}
      <div className={styles.pageBanner}>
      <img 
          src="https://cdn11.bigcommerce.com/s-fw54kk4zpe/product_images/uploaded_images/hero-image-how-it-works-1.png"
          alt="How It Works Hero"
          className="w-full"
          style={{ maxHeight: '400px', objectFit: 'cover' }}
        />
      </div>

      {/* Header Section */}
      <section className={styles.headerSection}>
        <div className={styles.container}>
          <h1 className={styles.mainTitle}>How the Registry works</h1>
          <p className={styles.subtitle}>
            Here the registry becomes an interactive tool of communication between you and
            your guests, a platform to express emotions, to give and to support.
            You can create your own list in the simple steps below
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          {/* Register Section */}
          <div className={styles.contentBlock} style={{ borderTop: '1px solid #E2E8F0', paddingTop: '40px' }}>
            <h2 className={styles.sectionTitle} >Register easily, fast and completely free of charge</h2>
            <p className={styles.bodyText}>
              By registering on GrantDays online platform you can create the registry you want, save all your wishes,
              customize your personal settings, enjoy benefits and offers, and of course manage your list from its creation to
              its completion and acquisition.
            </p>
          </div>

          {/* Create Registry Section */}
          <div className={styles.contentBlock}>
            <h2 className={styles.sectionTitle}>Create your personal Gift registry for the event you want to celebrate</h2>
            <p className={styles.bodyText}>
              Choose the type of registry you wish to create. You can choose one of the basic and most popular types of
              registries (wedding, baptism, baby shower, birthday, student life) or create your own personal type of list
              depending on the event you want to organize or the occasion you want to celebrate.
            </p>
          </div>

          {/* Step Title */}
          <h3 className={styles.stepTitle} style={{textAlign:'left'}}>HOW TO MAKE YOU LIST</h3>

          {/* Add Gifts Section */}
          <div className={styles.contentBlock}>
            <h2 className={styles.sectionTitle}>Add the gifts you want through a comprehensive range of products, services and activities</h2>
            <p className={styles.bodyText}>
              The GrantDays online village invites you to browse the categories of products, services and activities we have
              carefully selected and which we update according to the latest trends and preferences. You can search for
              your favourite brands and products or refer to our <span style={{color:'#61C5C3'}}>product pages</span> for ideas and countless options. By filling in
              the relevant form with your initial thoughts, needs or preferences, GrantDays team will automatically give you
              the best ideas. If you have limited time or are in the mood for more inspiration, you can also start
              your registry by browsing <span style={{color:'#61C5C3'}}>Inspiration & Recommendations </span>by GrantDays and making any adjustments you
              want.
            </p>
            <p className={styles.bodyText}>
              Apart from adding specific products, services or activities, you always have the option to add <span style={{color:'#61C5C3'}}>GrantDays gift
              cards </span> to your registry, which you can redeem with future purchases whenever you wish.
            </p>
            <p className={styles.bodyText}>
              Moreover, you can add the option of <span style={{color:'#61C5C3'}}>Group Gifting</span> to your registry, which allows your guests to collectively
              participate and contribute to the purchase of higher value gifts, unique travel getaways and honeymoons, as
              well as long-life utility goods.
            </p>
            <p className={styles.bodyText}>
              You can also choose whether you want your registry to be Public (accessible to everyone) or Shareable
              (accessible only to your guests). In the case of a public registry, your approval will be requested for anyone
              who might be interested in contributing in addition to your own guests.
            </p>
            <p className={styles.bodyText}>
              After creating your registry we will ask you how you want to receive your gifts: partial shipment/delivery of the
              gifts (with the purchase of each gift) or total shipment/delivery of all gifts (upon completion and closing of
              the registry).
            </p>
          </div>

          {/* Communicate Registry Section */}
          <div className={styles.contentBlock}>
            <h2 className={styles.sectionTitle}>Communicate your registry to your loved ones</h2>
            <p className={styles.bodyText}>
              Share the event you are hosting or the occasion you want to celebrate and invite your loved ones to
              participate in the registry you have prepared. With the relevant options you can:
            </p>
            <div className={styles.listItem}>
              <span className={styles.listItemBullet}>•</span>
              <p className={styles.listItemText}>
              <span style={{color:'#61C5C3'}}>Create your own invitation</span> by choosing from our team's ready-made ideas and suggestions for the design
                and content of the invitation.
              </p>
            </div>
            <div className={styles.listItem}>
              <span className={styles.listItemBullet}>•</span>
              <p className={styles.listItemText}>
                Send your invitation to both those who will be able to attend and those who will not be able to attend, by
                including the WE CONNECT feature, a free GrantDays service that enables guests who cannot physically
                attend to participate via videoconference. <span style={{color:'#61C5C3'}}>Learn more here</span>
              </p>
            </div>
            <div className={styles.listItem}>
              <span className={styles.listItemBullet}>•</span>
              <p className={styles.listItemText}>
                Forward your invitations with bulk SMS and emails that GrantDays handles for free. You can also simply
                forward your registry link (URL) through your personal account (social media, email or SMS).
              </p>
            </div>
          </div>

          {/* Follow Updates Section */}
          <div className={styles.contentBlock}>
            <h2 className={styles.sectionTitle}>Follow our updates on your guests' selections and make any adjustments you wish to your registry</h2>
            <p className={styles.bodyText}>
              Give your guests time to browse the content of the registry you have created and choose how to participate.
              We take care of updating you every time a gift is purchased, but of course you can log in at any time to check
              your registry status (what has been purchased, what is still available, etc.). As long as you keep your registry
              open you can still make changes to the gift options that are still for purchase.
            </p>
            <p className={styles.bodyText}>
              Important to know! With every new update on an individual gift purchased we give you the benefit of Smart
              Change. Here, within 2 days of our notification, you can choose to replace that gift with a GrantDays gift card
              of the same value. Simply because you may have changed your mind and we want whatever's gifted to you to
              be useful and enjoyable. The above does not apply to Group Gifting purchases, for obvious reasons.
            </p>
          </div>

          {/* Close Registry Section */}
          <div className={styles.contentBlock}>
            <h2 className={styles.sectionTitle}>Close your registry and complete the receipt of your gifts</h2>
            <p className={styles.bodyText}>
              Check to see if you have gathered the purchases you need and close your list whenever you want (no later
              than 3 months after the date of the event you're hosting).
            </p>
          </div>

          {/* Step Title - Repeated */}
          <h3 className={styles.stepTitle}>HOW TO MAKE YOU LIST</h3>

          {/* Communicate Registry Section - Repeated */}
          <div className={styles.contentBlock}>
            <h2 className={styles.sectionTitle}>Communicate your registry to your loved ones</h2>
            <p className={styles.bodyText}>
              Share the event you are hosting or the occasion you want to celebrate and invite your loved ones to
              participate in the registry you have prepared. With the relevant options you can:
            </p>
            <div className={styles.listItem}>
              <span className={styles.listItemBullet}>•</span>
              <p className={styles.listItemText}>
              <span style={{color:'#61C5C3'}}>Create your own invitation</span> by choosing from our team's ready-made ideas and suggestions for the design
                and content of the invitation.
              </p>
            </div>
            <div className={styles.listItem}>
              <span className={styles.listItemBullet}>•</span>
              <p className={styles.listItemText}>
                Send your invitation to both those who will be able to attend and those who will not be able to attend, by
                including the WE CONNECT feature, a free GrantDays service that enables guests who cannot physically
                attend to participate via videoconference. <span style={{color:'#61C5C3'}}>Learn more here.</span>
              </p>
            </div>
            <div className={styles.listItem}>
              <span className={styles.listItemBullet}>•</span>
              <p className={styles.listItemText}>
                Forward your invitations with bulk SMS and emails that GrantDays handles for free. You can also simply
                forward your registry link (URL) through your personal account (social media, email or SMS).
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 