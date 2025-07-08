'use client';
import Link from 'next/link';

export default function GiftCardsSection() {
  return (
    <>
      <div className="cardsGrid">
        {/* Left Box */}
        <div className="card" style={{ backgroundImage: "url('/images/WEDDING 2.png')" }}>
          <div className="cardContent">
            <h2 className="cardTitle">τι άλλο θα μπορούσαμε<br />να βαλουμε εδώ?</h2>
            <p className="cardSubtitle">With Ciseco you will get freeship & savings combo...</p>
          </div>
        </div>
        {/* Right Box */}
        <div className="card" style={{ backgroundImage: "url('/images/WEDDING 4.png')" }}>
          <div className="cardContent">
            <h2 className="cardTitle">Δωροκάρτα Grant days<br />διαχρονική και<br />ανεκτίμητη</h2>
            <p className="cardSubtitle">With Ciseco you will get freeship & savings combo...</p>
            <div className="cardCtas">
                <Link href="/wishlist" legacyBehavior>
                <a className="ctaBlue">ΠΡΟΣΘΗΚΗ ΣΤΗ ΛΙΣΤΑ</a>
                </Link>
                <Link href="/cart" legacyBehavior>
                <a className="ctaWhite">ΠΡΟΣΘΗΚΗ ΣΤΟ ΚΑΛΑΘΙ</a>
                </Link>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .cardsGrid {
          display: flex;
          gap: 25px;
          justify-content: center;
          
          margin-left: auto;
          margin-right: auto;
    
        }
        .card {
          width: 950px;
          height: 700px;
          background-size: cover;
          background-position: center;
          position: relative;
          display: flex;
          align-items: flex-start;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        }
        .cardContent {
          padding: 48px;
          color: #fff;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .cardTitle {
          font-size: 2.8rem;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 16px;
          font-family: 'Gotham', Arial, sans-serif;
        }
        .cardSubtitle {
        max-width: 400px;
          font-size: 1.2rem;
          font-weight: 400;
          margin-bottom: 32px;
          color: #fff;
          opacity: 0.85;
        }
        .cardCtas {
         position:absolute;
         bottom:50px;
          display: flex;
          gap: 16px;
        }
        .ctaBlue {
          background: #063B67;
          color: #fff;
          padding: 12px 28px;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.2s;
        }
        .ctaBlue:hover {
          background: #052d4a;
        }
        .ctaWhite {
          background: #fff;
          color: #063B67;
          padding: 12px 28px;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }
        .ctaWhite:hover {
          background: #f0f8ff;
          color: #052d4a;
        }
        @media (max-width: 2000px) {
          .card {
            
            max-width: 950px;
            min-width: 320px;
            height: 50vw;
            max-height: 700px;
            min-height: 300px;
          }
        }
        @media (max-width: 1200px) {
          .cardsGrid {
            flex-direction: column;
            align-items: center;
          }
          .card {
            width: 90vw;
            height: 60vw;
            max-width: 700px;
            max-height: 500px;
          }
        }
        @media (max-width: 700px) {
          .cardContent {
            padding: 18px;
          }
          .cardTitle {
            font-size: 1.3rem;
          }
          .cardSubtitle {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </>
  );
} 