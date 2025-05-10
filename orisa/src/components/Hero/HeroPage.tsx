// orisa/src/components/HeroPage.tsx
import styles from './HeroPage.module.scss';
import logo from '../../assets/react.svg'; 

const HeroPage = () => (
  <div className={styles.heroBg}>
    <video
      className={styles.bgVideo}
      src="/background.mp4"
      autoPlay
      loop
      muted
      playsInline
    />
    <header className={styles.header}>
      <div className={styles.logoWrap}>
        <img src={logo} alt="Terra Labs Logo" className={styles.logo} />
        <span>Terra Labs</span>
      </div>
      <a href="#" className={styles.login}>Login</a>
    </header>
    <main className={styles.main}>
      <h1 className={styles.title}>
      Conversational Search for the Physical World
      </h1>
    </main>
  </div>
);

export default HeroPage;
