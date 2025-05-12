// orisa/src/components/HeroPage.tsx
import styles from './HeroPage.module.scss';
import logo from '../../assets/react.svg'; 

const HeroPage = ({ gotoSection }: { gotoSection: (section: string) => void }) => (
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
        <span>Titan</span>
      </div>
      <a href="#" className={styles.login}>Login</a>
    </header>
    <main className={styles.main}>
      <h1 className={styles.title}>
      Conversational Search for the Physical World
      </h1>
      <button onClick={() => gotoSection('demo')} className={styles.btn}>Join Waitlist</button>
    </main>
  </div>
);

export default HeroPage;
