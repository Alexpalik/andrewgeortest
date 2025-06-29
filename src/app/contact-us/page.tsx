'use client'

import { useState } from 'react'
import styles from './page.module.css'
import PhoneInput from '@/components/PhoneInput'

export default function ContactUs() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    company: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
  }

  return (
    <section className={styles.contactSection}>
      <div className={styles.container}>
        <h1 className={styles.title}>Contact Us</h1>
        
        <div className={styles.subtitle}>
          <p>Θα χαρούμε να απαντήσουμε σε ερωτήσεις σου.</p>
          <p>Παρακαλούμε συμπλήρωσε την παρακάτω φόρμα αν χρειάζεσαι κάποια βοήθεια.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Ονοματεπώνυμο *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Ονοματεπώνυμο"
                value={formData.fullName}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phone">Τηλέφωνο</label>
              <PhoneInput
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value || "" })}
                placeholder="Τηλέφωνο"
                defaultCountry="GR"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="company">Όνομα Εταιρίας</label>
              <input
                type="text"
                id="company"
                name="company"
                placeholder="Όνομα Εταιρίας"
                value={formData.company}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroupFull}>
            <label htmlFor="message">Σχόλια/Ερωτήσεις *</label>
            <textarea
              id="message"
              name="message"
              placeholder="Πρόσθεσε τα σχόλιά σου εδώ"
              value={formData.message}
              onChange={handleChange}
              rows={8}
              required
              className={styles.textarea}
            />
          </div>

          <div className={styles.recaptchaContainer}>
            <div className={styles.recaptcha}>
              <input type="checkbox" id="notRobot" className={styles.checkbox} />
              <label htmlFor="notRobot">I'm not a robot</label>
              <div className={styles.recaptchaLogo}>
                <div>
                  <span>reCAPTCHA</span>
                  <small>Privacy - Terms</small>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            ΥΠΟΒΟΛΗ ΜΗΝΥΜΑΤΟΣ
          </button>
        </form>
      </div>
    </section>
  )
} 