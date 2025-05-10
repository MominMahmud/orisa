import styles from './Categories.module.scss';
import BackgroundGradient from '../BackgroundGradient/BackgroundGradient';
import Card from '../shared/Card/Card';

const propertyCardsData = {
  title: "Full-stack GIS agent customized for real-world analytics",
  subtitle: "Customized for",
  cards: [
    {
      title: "Real Estate",
      imageUrl: "https://images.unsplash.com/photo-1571979622878-622d38ec238c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D",
    },
    {
      title: "Insurance",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5zdXJhbmNlfGVufDB8fDB8fHww",
    },
    {
      title: "Climate Risk",
      imageUrl: "https://images.unsplash.com/photo-1657650505255-65ec65adb8aa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2xpbWF0ZSUyMHJpc2t8ZW58MHx8MHx8fDA%3D",
    },
    {
      title: "Mining",
      imageUrl: "https://images.unsplash.com/photo-1523848309072-c199db53f137?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TWluaW5nfGVufDB8fDB8fHww",
    }
  ]
};

const Categories = () => (
  <div className={styles.categoriesWrapper}>
    <BackgroundGradient />
    <div className={styles.centeredText}>
    <Card 
        title={propertyCardsData.title} 
        subtitle={propertyCardsData.subtitle} 
        cards={propertyCardsData.cards} 
      />
    </div>
  </div>
);

export default Categories;
