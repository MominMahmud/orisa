import { useState } from 'react';
import styles from './Card.module.scss';

const Card = ({ title, subtitle, cards }: { title: string, subtitle: string, cards: any[] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  return (
    <div className={styles.cardsContainer}>
      <div className={styles.headerContainer}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={styles.sectionLabel}>{subtitle}</div>
      </div>
      
      <div className={styles.cardsWrapper}>
        {cards.map((card, index) => (
          <div 
            key={index}
            className={`${styles.card} ${hoveredIndex === index ? styles.expanded : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ backgroundImage: `url(${card.imageUrl})` }}
          >
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;