import styles from './FeaturesSection.module.scss';

const features = [
  {
    icon: 'public/data_color.png',
    text: 'Rapid data aggregation and processing',
  },
  {
    icon: 'public/model_color.png',
    text: 'State of the art deep learning models streamlining analysis',
  },
  {
    icon: 'public/nlp_color.png',
    text: 'Intuitive natural language interface',
  },
  {
    icon: 'public/privacy_color.png',
    text: 'Enterprise-ready with data privacy and governance controls',
  },
];

const FeaturesSection = () => (
  <section className={styles.featuresSection}>
    <div className={styles.featuresTitle}>
    Full-stack GIS agent customized for real-world analytics
    </div>
    <div className={styles.featuresGrid}>
      {features.map((feature, idx) => (
        <div className={styles.featureItem} key={idx}>
          <img className={styles.featureIconImage} src={feature.icon} alt={feature.text} />
          <div className={styles.featureText}>{feature.text}</div>
        </div>
      ))}
    </div>
  </section>
);

export default FeaturesSection; 