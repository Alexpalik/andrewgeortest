'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function HowItWorks() {
  const [activeAccordion, setActiveAccordion] = useState('')

  return (
    <div data-page-url="/how-it-works" className="how-it-works">
      {/* Hero Banner */}
      <div className="page-banner">
        <img 
          src="https://cdn11.bigcommerce.com/s-fw54kk4zpe/product_images/uploaded_images/hero-image-how-it-works-1.png"
          alt="How It Works Hero"
          className="w-full"
          style={{ maxHeight: '400px', objectFit: 'cover' }}
        />
      </div>

      {/* Main Content */}
      <div className="text-gray container mb-20 md:mb-50 mt-5 md:mt-10 px-4 md:px-0">
        <div className="text-container text-center py-12 md:py-24" style={{ maxWidth: '855px', margin: '0 auto' }}>
          <h1 className="text-3xl md:text-5xl font-medium text-[#063B67] " style={{ fontFamily: 'Source Serif 4, serif' }}>Πώς λειτουργεί η Λίστα (Δώρων)</h1>
          <p className="text-gray-700 mt-8 text-base md:text-xl leading-relaxed">
            Εδώ η λίστα γίνεται ένα διαδραστικό εργαλείο επικοινωνίας
            <span className="hidden md:inline"><br /></span>
            ανάμεσα σε εσένα και τους καλεσμένους σου, μια πλατφόρμα εκδήλωσης
            <span className="hidden md:inline"><br /></span>
            συναισθημάτων, προσφοράς και υποστήριξης.
            <span className="hidden md:inline"><br /></span>
            Μπορείς να δημιουργήσεις τη δική σου λίστα με τα παρακάτω απλά βήματα:
          </p>
          
          {/* Video Section */}
          <div className="mt-8 relative mx-auto" style={{ paddingBottom: '56.25%', height: 0, maxWidth: '100%' }}>
            <iframe 
              src="https://www.youtube.com/embed/uMkPaeC1fNw?si=LvfmTrCKm6ecpXb7&autoplay=1&mute=1"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>

        {/* Accordion Section */}
        <div className="accordion mt-8 md:mt-12">
          {/* First Accordion Item */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button 
                className={`accordion-button ${activeAccordion !== 'collapseOne' ? 'collapsed' : ''}`}
                type="button"
                onClick={() => setActiveAccordion(activeAccordion === 'collapseOne' ? '' : 'collapseOne')}
                style={{ fontFamily: 'Source Serif 4, serif' }}
              >
                <span className="bg-brush " style={{ fontFamily: 'Source Serif 4, serif' }}>Για τη δημιουργία λίστας δώρων</span>
              </button>
            </h2>
            <div 
              className={`accordion-collapse ${activeAccordion === 'collapseOne' ? 'show' : ''}`}
            >
              <div className="accordion-body">
                <div className="text-container">
                  <h5 className="mb-0 text-medium text-[#063B67] " style={{ fontFamily: 'Source Serif 4, serif' }}>Κάνε εγγραφή εύκολα, γρήγορα και εντελώς δωρεάν</h5>
                  <p className="text-justify text-gray-700">
                    Με την εγγραφή σου στην διαδικτυακή πλατφόρμα της GrantDays έχεις τη δυνατότητα να δημιουργήσεις τη λίστα δώρων που θέλεις, να αποθηκεύσεις όλες σου τις επιθυμίες, να προσαρμόσεις τις προσωπικές σου ρυθμίσεις, να απολαύσεις πλεονεκτήματα και προσφορές, και φυσικά να διαχειριστείς τη λίστα σου από τη δημιουργία της μέχρι την ολοκλήρωση και απόκτησή της.
                  </p>

                  <h5 className="mb-0 text-medium text-[#063B67] " style={{ fontFamily: 'Source Serif 4, serif' }}>Δημιούργησε την προσωπική σου λίστα Δώρων για το event που θέλεις να γιορτάσεις</h5>
                  <p className="text-justify text-gray-700">
                    Επέλεξε το είδος της λίστας δώρων που επιθυμείς να δημιουργήσεις. Μπορείς να επιλέξεις ένα από τα βασικά και πιο δημοφιλή είδη λίστας (γάμος, βάπτιση, baby shower, γενέθλια, φοιτητική ζωή) ή να δημιουργήσεις το δικό σου προσωπικό είδος λίστας ανάλογα με το event που θέλεις να διοργανώσεις ή την περίσταση που θέλεις να γιορτάσεις.
                  </p>
                  
                  <Link href="https://registry.grantdays.eu/create-registry?lang=el" className="button button--skeleton">
                    ΦΤΙΑΞΕ ΤΗ ΛΙΣΤΑ ΣΟΥ
                  </Link>

                  <h5 className="mb-0 text-medium text-[#063B67] " style={{ fontFamily: 'Source Serif 4, serif' }}>Πρόσθεσε τα δώρα που επιθυμείς μέσα από μια ολοκληρωμένη γκάμα προϊόντων, υπηρεσιών και δραστηριοτήτων</h5>
                  <p className="text-justify text-gray-700">
                    Το διαδικτυακό χωριό της GrantDays σε προσκαλεί να περιηγηθείς στις κατηγορίες προϊόντων, υπηρεσιών και δραστηριοτήτων που έχουμε προσεκτικά επιλέξει και τις οποίες ανανεώνουμε σύμφωνα με τελευταία trends, τάσεις και προτιμήσεις. Μπορείς να αναζητήσεις τα αγαπημένα σου brands και προϊόντα ή να ανατρέξεις στις <Link href="https://grantdays.eu/categories" className="text-blue-600 underline">προϊοντικές σελίδες</Link> μας για ιδέες και αμέτρητες επιλογές. Συμπληρώνοντας τη σχετική φόρμα με τις αρχικές σου σκέψεις, ανάγκες ή προτιμήσεις η ομάδα της GrantDays θα σου δώσει αυτόματα τις καλύτερες ιδέες. Αν έχεις περιορισμένο χρόνο ή διάθεση για περισσότερη έμπνευση, μπορείς επίσης να ξεκινήσεις τη λίστα σου ανατρέχοντας σε <Link href="https://grantdays.eu/inspirations/" className="text-blue-600 underline">Ιδέες & Προτάσεις</Link> της GrantDays και κάνοντας ό,τι προσαρμογές θέλεις.
                    <br /><br />
                    Πέρα από την προσθήκη συγκεκριμένων προϊόντων, υπηρεσιών ή δραστηριοτήτων, έχεις πάντα την επιλογή να συμπληρώσεις τη λίστα σου με <strong>δωροκάρτες GrantDays</strong>, τις οποίες μπορείς να εξαργυρώσεις με μελλοντικές αγορές όποτε εσύ το επιθυμείς.
                    <br /><br />
                    Επιπλέον, μπορείς να προσθέσεις στη λίστα σου τη δυνατότητα του <strong>Ομαδικού Δώρου</strong>, με την οποία επιτρέπεις στους καλεσμένους σου να συμμετέχουν ομαδικά στην απόκτηση δώρων μεγαλύτερης αξίας, μοναδικών ταξιδιωτικών αποδράσεων και ταξιδίων του μέλιτος, καθώς και αγαθών μεγάλης διάρκειας ζωής και χρησιμότητας.
                    <br /><br />
                    Μπορείς επίσης να επιλέξεις αν επιθυμείς η λίστα σου να είναι <strong>Δημόσια</strong> (προσβάσιμη σε όλους) ή <strong>Κοινοποιήσιμη</strong> (προσβάσιμη μόνο στους καλεσμένους σου). Στην περίπτωση της δημόσιας λίστας δώρων, θα ζητείται η έγκριση σου για κάθε ενδιαφερόμενο πέραν των δικών σου καλεσμένων.
                    <br /><br />
                    Μετά τη δημιουργία της λίστας σου θα σε ρωτήσουμε για τον τρόπο με τον οποίο θέλεις να παραλάβεις τα δώρα σου: τμηματική αποστολή/παράδοση των δώρων (με την αγορά κάθε δώρου) ή συνολική αποστολή/παράδοση όλων των δώρων (με την ολοκλήρωση και το κλείσιμο της λίστας).
                  </p>

                  <h5 className="mb-0 text-medium text-[#063B67] " style={{ fontFamily: 'Source Serif 4, serif' }}>Επικοινώνησε τη λίστα σου στους αγαπημένους σου</h5>
                  <p className="text-justify text-gray-700">
                    Κοινοποίησε το event που διοργανώνεις ή την περίσταση που θέλεις να γιορτάσεις και κάλεσε τους αγαπημένους σου να συμμετέχουν στη λίστα δώρων που έχεις ετοιμάσει. Με τις ανάλογες επιλογές μπορείς:
                  </p>
                  <ul className="list-bulleted ml-4">
                    <li className="text-justify text-gray-700">
                      Nα δημιουργήσεις τη δική σου <Link href="https://grantdays.eu/invitations/" className="text-blue-600 underline">πρόσκληση</Link> διαλέγοντας από τις έτοιμες ιδέες και προτάσεις της ομάδας μας για το σχέδιο και περιεχόμενο της πρόσκλησης.
                    </li>
                    <li className="text-justify text-gray-700">
                      Να στείλεις την πρόσκλησή σου και σε αυτούς που θα μπορέσουν και σε αυτούς που δεν θα μπορέσουν να παρευρεθούν, εντάσσοντας σ'αυτήν τη δυνατότητα του <strong>WE CONNECT</strong>, μια δωρεάν υπηρεσία της GrantDays που επιτρέπει σε όσους καλεσμένους δεν καταφέρουν να παρευρεθούν, να συμμετέχουν με την διαδικασία της τηλεδιάσκεψης. <Link href="https://grantdays.eu/we-connect/" className="text-blue-600 underline">Μάθε περισσότερα εδώ</Link>.
                    </li>
                    <li className="text-justify text-gray-700">
                      Nα προωθήσεις τις προσκλήσεις σου με μαζική αποστολή SMS και emails που αναλαμβάνει δωρεάν η GrantDays. Μπορείς επίσης να προωθήσεις απλά το σύνδεσμο (URL) της λίστας σου μέσα από τον προσωπικό σου λογαριασμό (social media, email ή SMS).
                    </li>
                  </ul>

                  <h5 className="mb-0 text-medium text-[#063B67] " style={{ fontFamily: 'Source Serif 4, serif' }}>Παρακολούθησε τις ενημερώσεις μας για τις επιλογές των καλεσμένων σου και κάνε στη λίστα σου όποια διόρθωση επιθυμείς</h5>
                  <p className="text-justify text-gray-700">
                    Δώσε τον χρόνο στους καλεσμένους σου να επεξεργαστούν το περιεχόμενο της λίστας που έχεις δημιουργήσει και να επιλέξουν τον τρόπο συμμετοχής τους. Αναλαμβάνουμε να σε ενημερώνουμε κάθε φορά που ένα δώρο αγοράζεται, αλλά φυσικά μπορείς συνδεθείς άνα πάσα στιγμή για να ελέγξεις την κατάσταση της λίστας σου (τι έχει αγοραστεί, τι είναι ακόμα διαθέσιμο κλπ.). Όσο διατηρείς τη λίστα σου ανοιχτή μπορείς ακόμα να κάνεις αλλαγές στις επιλογές δώρων που είναι ακόμα προς αγορά.
                    <br /><br />
                    <strong>Σημαντικό να γνωρίζεις!</strong> Σε κάθε νέα ενημέρωση για ένα ατομικό δώρο που αγοράζεται σου δίνουμε το πλεονέκτημα της <strong>Έξυπνης Αλλαγής.</strong> Εδώ, εντός 2 ημερών από την ενημέρωσή μας, μπορείς να επιλέξεις να αντικαταστήσεις το συγκεκριμένο δώρο με μια δωροκάρτα GrantDays ίδιας αξίας. Απλά γιατί μπορεί να άλλαξες γνώμη και εμείς θέλουμε ό,τι σου δωρίζεται να σου είναι χρήσιμο και να το χαρείς. Το παραπάνω δεν ισχύει για αγορές Ομαδικού δώρου για ευνόητους λόγους.
                  </p>

                  <h5 className="mb-0 text-medium text-[#063B67] " style={{ fontFamily: 'Source Serif 4, serif' }}>Κλείσε τη λίστα σου και παρέλαβε τα δώρα σου</h5>
                  <p className="text-justify text-gray-700">
                    Τσέκαρε αν έχεις συγκεντρώσει τις αγορές που χρειάζεσαι και κλείσε τη λίστα σου όποτε το επιθυμείς (το αργότερο μέχρι 3 μήνες μετά την ημερομηνία του event που διοργανώνεις).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Second Accordion Item */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button 
                className={`accordion-button ${activeAccordion !== 'collapseTwo' ? 'collapsed' : ''}`}
                type="button"
                onClick={() => setActiveAccordion(activeAccordion === 'collapseTwo' ? '' : 'collapseTwo')}
                style={{ fontFamily: 'Source Serif 4, serif' }}
              >
                <span className="bg-brush " style={{ fontFamily: 'Source Serif 4, serif' }}>Για τη δημιουργία λίστας Ομαδικής Δραστηριότητας</span>
              </button>
            </h2>
            <div 
              className={`accordion-collapse ${activeAccordion === 'collapseTwo' ? 'show' : ''}`}
            >
              <div className="accordion-body">
                <div className="text-container">
                  <h5 className="mb-0 text-medium text-[#063B67] " style={{ fontFamily: 'Source Serif 4, serif' }}>Κάνε εγγραφή εύκολα, γρήγορα και εντελώς δωρεάν</h5>
                  <p className="text-justify text-gray-700">
                    Με την εγγραφή σου στην διαδικτυακή πλατφόρμα της GrantDays έχεις τη δυνατότητα να δημιουργήσεις τη λίστα αγορών που χρειάζεται για την ομαδική δραστηριότητα που θέλεις να οργανώσεις.
                  </p>

                  <h5 className="mb-0 text-medium text-[#063B67] " style={{ fontFamily: 'Source Serif 4, serif' }}>Δημιούργησε μια λίστα Ομαδικής Δραστηριότητας</h5>
                  <p className="text-justify text-gray-700">
                    Το Let's Event είναι ένας νέος και έξυπνος τρόπος να «ξεσηκώσεις» τους φίλους, συναδέλφους ή συμπαίκτες σου να συμμετέχουν σε μια ομαδική δραστηριότητα. Επέλεξε <Link href="https://grantdays.eu/lets-event/" className="text-blue-600 underline">Let's Event</Link> από το μενού ειδών λίστας στην GrantDays και ονόμασε τη λίστα σου όπως εσύ επιθυμείς.
                  </p>

                  <Link href="https://registry.grantdays.eu/create-registry?lang=el" className="button button--skeleton">
                    ΦΤΙΑΞΕ ΤΗ ΛΙΣΤΑ ΣΟΥ
                  </Link>

                  <h5 className="mb-0 text-medium text-[#063B67] " style={{ fontFamily: 'Source Serif 4, serif' }}>Πρόσθεσε στη λίστα ό,τι χρειάζεστε για την ομαδική δραστηριότητα που διοργανώνεις</h5>
                  <p className="text-justify text-gray-700">
                    Η συγκεκριμένη λίστα έχει ενημερωτικό χαρακτήρα και βοηθάει κάθε καλεσμένο σου να αποκτήσει μόνο ό,τι χρειάζεται για τη συμμετοχή του στην δραστηριότητα που ετοιμάζεις. Το διαδικτυακό χωριό της GrantDays σου προσφέρει μια ευρεία γκάμα επιλογών για οποιοδήποτε εξοπλισμό ή υπηρεσία θέλεις να εντάξεις στην ομαδική δραστηριότητα. Μπορείς να αναζητήσεις τα αγαπημένα σου brands και προϊόντα ή να ανατρέξεις στις <Link href="https://grantdays.eu/categories" className="text-blue-600 underline">προϊοντικές σελίδες</Link> μας για ιδέες και αμέτρητες επιλογές.
                  </p>

                  <p className="text-justify text-gray-700">
                    Επιπλέον, μπορείς να ενεργοποιήσεις τη δυνατότητα του <strong>Ομαδικού Δώρου</strong>, με την οποία επιτρέπεις σε όλους τους συμμετέχοντες να αγοράσουν ομαδικά κάποια από τα είδη της λίστας σου. Ο εξοπλισμός που αγοράζεται ατομικά παραδίδεται στον αγοραστή, ενώ σε περίπτωση ομαδικής αγοράς πρέπει να οριστεί ο παραλήπτης.
                  </p>

                  <h5 className="mb-0 text-medium text-[#063B67] " style={{ fontFamily: 'Source Serif 4, serif' }}>Κάλεσε όσους επιθυμείς να συμμετέχουν στην ομαδική δραστηριότητα που διοργανώνεις</h5>
                  <p className="text-justify text-gray-700">
                    Εδώ έχεις τη δυνατότητα να οργανώσεις γρήγορα και αποτελεσματικά την ομάδα σου ώστε να ενημερωθεί και να συνεισφέρει, αν χρειάζεται, στην απόκτηση του απαιτούμενου εξοπλισμού, υπηρεσίας ή δραστηριότητας. Κοινοποίησε την ομαδική δραστηριότητα που διοργανώνεις και κάλεσε όσους επιθυμείς να πάρουν μέρος. Με τις σχετικές επιλογές μπορείς:
                  </p>
                  <ul className="list-bulleted ml-4">
                    <li className="text-justify text-gray-700">
                      Να δημιουργήσεις τη δική σου <Link href="https://grantdays.eu/invitations/" className="text-blue-600 underline">πρόσκληση</Link> διαλέγοντας από τις έτοιμες ιδέες και προτάσεις της ομάδας μας για το σχέδιο και περιεχόμενο της πρόσκλησης.
                    </li>
                    <li className="text-justify text-gray-700">
                      Να προωθήσεις τις προσκλήσεις σου με μαζική αποστολή SMS και emails που αναλαμβάνει δωρεάν η GrantDays ή να προωθήσεις απλά το σύνδεσμο (link) της λίστας σου μέσα από τον προσωπικό σου λογαριασμό (social media, email ή SMS).
                    </li>
                  </ul>

                  <h5 className="mb-0 text-medium text-[#063B67] " style={{ fontFamily: 'Source Serif 4, serif' }}>Παρακολούθησε τις ενημερώσεις μας για τις αγορές της ομάδας σου και κάνε στη λίστα σου όποια διόρθωση επιθυμείς</h5>
                  <p className="text-justify text-gray-700">
                    Δώσε τον χρόνο σε όλους τους συμμετέχοντες να επεξεργαστούν το περιεχόμενο της λίστας που έχεις δημιουργήσει και να συμμετέχουν στην απόκτηση του απαιτούμενου εξοπλισμού, υπηρεσίας ή δραστηριότητας. Αναλαμβάνουμε να σε ενημερώνουμε κάθε φορά που ένα είδος αγοράζεται, αλλά φυσικά μπορείς συνδεθείς άνα πάσα στιγμή για να ελέγξεις την κατάσταση της λίστας σου (τι έχει αγοραστεί, τι είναι ακόμα διαθέσιμο κλπ.). Όσο διατηρείς τη λίστα σου ανοιχτή μπορείς ακόμα να κάνεις αλλαγές στο τι χρειάζεται να αγοραστεί.
                  </p>

                  <h5 className="mb-0 text-medium text-[#063B67] " style={{ fontFamily: 'Source Serif 4, serif' }}>Κλείσε τη λίστα σου όποτε το επιθυμείς</h5>
                  <p className="text-justify text-gray-700">
                    Μπορείς να κλείσεις τη λίστα σου όποτε θεωρείς ότι οι αγορές έχουν ολοκληρωθεί, ή θα κλείσει αυτόματα την ημερομηνία της ομαδικής δραστηριότητας.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Third Accordion Item */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button 
                className={`accordion-button ${activeAccordion !== 'collapseThree' ? 'collapsed' : ''}`}
                type="button"
                onClick={() => setActiveAccordion(activeAccordion === 'collapseThree' ? '' : 'collapseThree')}
                style={{ fontFamily: 'Source Serif 4, serif' }}
              >
                <span className="bg-brush " style={{ fontFamily: 'Source Serif 4, serif' }}>Εάν έχεις δεχτεί πρόσληση σε λίστα Δώρων ή Ομαδικής Δραστηριότητας</span>
              </button>
            </h2>
            <div 
              className={`accordion-collapse ${activeAccordion === 'collapseThree' ? 'show' : ''}`}
            >
              <div className="accordion-body">
                <div className="text-container">
                  <h5 className="mb-0 text-medium text-[#063B67] " style={{ fontFamily: 'Source Serif 4, serif' }}>Μπες στη λίστα στην οποία σε έχουν καλέσει</h5>
                  <p className="text-justify text-gray-700">
                    Ακολούθησε το σύνδεσμο της πρόσκλησης που έχεις λάβει ή αναζήτησε τη λίστα πληκτρολογώντας στην αναζήτηση το όνομα του διοργανωτή.
                  </p>

                  <h5 className="mb-0 text-medium text-[#063B67] " style={{ fontFamily: 'Source Serif 4, serif' }}>Περιηγήσου στη λίστα και επέλεξε τον τρόπο συμμετοχής σου</h5>
                  <p className="text-justify text-gray-700">
                    Αν είσαι καλεσμένος σε λίστα Δώρων, μπορείς να διαλέξεις το δώρο που θέλεις να προσφέρεις.
                  </p>
                  <p className="text-justify text-gray-700">
                    Αν είσαι καλεσμένος σε λίστα Ομαδικής Δραστηριότητας, μπορείς να συμμετέχεις ατομικά ή συλλογικά στην αγορά του εξοπλισμού ή της υπηρεσίας που χρειάζονται για να απολαύσετε την ομαδική δραστηριότητα. Η συγκεκριμένη λίστα έχει ενημερωτικό χαρακτήρα και βοηθάει κάθε καλεσμένο να αποκτήσει μόνο ό,τι χρειάζεται. Το πιο σημαντικό για τον διοργανωτή είναι η ενεργή συμμετοχή σου στην δραστηριότητα.
                  </p>
                  <p className="text-justify text-gray-700">
                    Ο κάτοχος της λίστας θα ενημερωθεί για τις επιλογές σου και εσύ θα λάβεις αντίστοιχη ενημέρωση για την κατάσταση της αγοράς σου.
                  </p>

                  <h5 className="mb-0 text-medium text-[#063B67] " style={{ fontFamily: 'Source Serif 4, serif' }}>Κάνε εγγραφή εύκολα, γρήγορα και εντελώς δωρεάν. Αν έχεις ήδη λογαριασμό GrantDays, συνδέσου απευθείας</h5>
                  <p className="text-justify text-gray-700">
                    Με την εγγραφή σου στην διαδικτυακή πλατφόρμα της GrantDays, ο κάτοχος της λίστας ενημερώνεται για την προσωπική σου συμμετοχή και εσύ αποκτάς αυτόματα:
                  </p>
                  <ul className="list-bulleted ml-4">
                    <li className="text-justify text-gray-700">Ευκαιρία να απολαύσεις πλεονεκτήματα και προσφορές μέσα από την ενεργή συμμετοχή σου.</li>
                    <li className="text-justify text-gray-700">Δυνατότητα να δημιουργήσεις τη δική σου λίστα Δώρων ή λίστα Ομαδικής Δραστηριότητας.</li>
                    <li className="text-justify text-gray-700">Δυνατότητα να κάνεις άμεσες, προσωπικές αγορές μέσα από μια ευρεία γκάμα επιλογών.</li>
                  </ul>

                  <Link href="https://registry.grantdays.eu/find-registry?lang=el" className="button button--skeleton">
                    ΑΝΑΖΗΤΗΣΕ ΜΙΑ ΛΙΣΤΑ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 