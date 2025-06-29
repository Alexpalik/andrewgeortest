'use client'

import styles from './page.module.css'
import Image from 'next/image'

export default function Benefits() {
  // Benefits data structure
  const benefits = [
    {
      id: 'all-in-one',
      title: 'All in One Place',
      description: 'Everything you need for your special event, from inspiration to thoughtful collections of products, travel & experience gifts and gift cards with special features.'
    },
    {
      id: 'gifting-options',
      title: 'Endless Gifting Options & Attractive Pricing',
      description: 'A limitless source of products and experiences at various price levels that can meet your every need and desire.'
    },
    {
      id: 'travel-experiences',
      title: 'Unique Travel Experiences',
      description: 'Attractive packages and a booking engine we partner with to help you search for your next travel.'
    },
    {
      id: 'gift-cards',
      title: 'GrantDays Gift Cards',
      description: 'A smart feature to allow the registrant to collect digital vouchers which can redeem with future purchases whenever they wish and the guest to offer "digital" cash instead of purchasing a specific gift.'
    },
    {
      id: 'prepaid-cards',
      title: 'Prepaid Gift Cards for High Value Purchases',
      description: 'Ask your guests to contribute totally or even partially to the purchase of items and services of high value and utility (such as car, motorcycle or travels)! After all, as Aristotle said "Well Begun is Half Done".'
    },
    {
      id: 'group-gifting',
      title: 'Group Gifting - A special service',
      description: 'Allow your guests to jointly contribute what they wish and can for the purchase of one gift in your registry (a feature especially for the higher priced items in your registry).'
    },
    {
      id: 'smart-change',
      title: 'Smart Change',
      description: 'Replace an individual gift purchase with a GrantDays gift card of same value, in case you changed your mind (guests won\'t be notified and their contribution stays documented).'
    },
    {
      id: 'group-activity',
      title: 'Group Activity Registry',
      description: 'A special type of registry to organize a group event or activity where all can participate in the acquisition of the required group and individual equipment (e.g. corporate team-building activity with friends etc.).'
    },
    {
      id: 'processes',
      title: 'Processes That Stand Out',
      description: 'Quick & easy registry creation. Various registry collections for inspiration. Personalized design and free sharing of your invitation & registry via SMS & emails. Free organization of a teleconference with your loved ones who won\'t be able to join you. Constant updates on your list status.'
    },
    {
      id: 'personalized-registry',
      title: 'Personalized Registry',
      description: 'Have a registry that reflects your style: create the type of registry you want, get inspiration and ideas as per the needs and preferences you share with us, personalize the design of your page (e.g. choose background, add your image), personalize your invitations.'
    },
    {
      id: 'personalized-service',
      title: 'Personalized Service & Support',
      description: 'Tell us a little bit about the event you are planning, your desires, needs and style. GrantDays Advisory team will always be at your disposal.'
    },
    {
      id: 'announce-share',
      title: 'Beautiful & Simple to Announce & Share',
      description: 'We always love to remind you and your guests that sharing is caring. Feel free to communicate without hesitation with your guests and send them a personal invitation to your special event and your registry.'
    },
    {
      id: 'tracking',
      title: 'Always-on Tracking',
      description: 'You can review anytime the status of your registry, but we will also notify you every time your guests buy you a gift.'
    },
    {
      id: 'thank-you',
      title: 'Free Thank You Note',
      description: 'Because all your guests deserve at minimum a "thank you" note for sharing their love and support. We take care of that every time a gift is purchased.'
    },
    {
      id: 'registry-bonus',
      title: 'Registry Bonus',
      description: 'Enjoy our special discounts for unselected gifts on your registry you might still want to personally purchase, or for your next registry!'
    },
    {
      id: 'guest-reward',
      title: 'Guest Gift Reward',
      description: 'If you have contributed your gift as a guest to an existing registry at GrantDays, enjoy a) a gift reward for your contribution and b) a discount for creating your own new registry.'
    },
    {
      id: 'secure-payment',
      title: 'Secure Payment',
      description: 'Secure online transactions with the highest confidentiality and personal data protection.'
    },
    {
      id: 'easy-returns',
      title: 'Easy Returns',
      description: 'Simplified and easy process of returns, simply by enclosing the return form in your package.'
    },
    {
      id: 'support',
      title: 'Support',
      description: 'For any questions or help needed, we\'re more than happy to assist you. Contact us at info@grantdays.eu or +357 22 210299.'
    },
    
    
   
    
   
    
    
   
    
  ]

  return (
    <main>
      {/* Hero Banner */}
      <div className={styles.pageBanner}>
        <img 
          src="/images/bg2.png" 
          alt="Gift box with pink ribbon"
        />
      </div>

      {/* Header Section */}
      <section className={styles.headerSection}>
        <div className={styles.container}>
          <h1 className={styles.mainTitle}>Discover all your benefits</h1>
          <p className={styles.subtitle}>
            Discover all the benefits you can enjoy on Grantdays platform, whether you are a
            registrant, a guest or an individual visitor
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <div className={styles.container}>
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit) => (
              <div key={benefit.id} className={styles.benefitItem}>
                <div className={styles.benefitIcon}>
                  <img 
                    src={`/images/icons/${benefit.id}.svg`} 
                    alt={`${benefit.title} icon`}
                  />
                </div>
                <div className={styles.benefitContent}>
                  <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                  <p className={styles.benefitDescription}>{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className={styles.ctaButton}>Mάθε περισσότερα</button>
        </div>
      </section>
    </main>
  )
} 