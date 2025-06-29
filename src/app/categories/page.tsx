import React from 'react';
import styles from './page.module.css';
import Image from 'next/image';

const categories = [
  {
    label: 'HOME',
    image: '/images/minimalist-interior.jpg',
  },
  {
    label: 'HOUSEHOLD EQUIPMENT',
    image: '/images/dish-house-decor.png',
  },
  {
    label: 'BABY & CHILD',
    image: '/images/baby-room.png',
  },
  {
    label: 'ACCESSORIES',
    image: '/images/accessories.png',
  },
  {
    label: 'ELECTRONIC ENTERTAINMENT',
    image: '/images/electronics.jpg',
  },
  {
    label: 'SPORTS & ACTIVITIES',
    image: '/images/sports.png',
  },
];

export default function CategoriesPage() {
  return (
    <div className={styles.categoriesWrapper}>
      <h1 className={styles.heading}>Product Categories</h1>
      <div className={styles.grid}>
        {categories.map((cat, idx) => (
          <div key={cat.label} className={styles.frameCardWrapper}>
            <div className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image 
                  src={cat.image} 
                  alt={cat.label} 
                  fill 
                  style={{
                    objectFit: cat.image.includes('minimalist-interior.jpg') ? 'cover' : 'contain'
                  }} 
                />
              </div>
              <div className={styles.label}>{cat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 