import FeaturesSection from '../shared/Section/FeaturesSection';
import styles from './Categories.module.scss';


const Categories = () => (
  <div className={styles.categoriesWrapper}>
    <div className={styles.backgroundGradient} />
    <div className={styles.centeredText}>
      <FeaturesSection />
    </div>
  </div>
);

export default Categories;
