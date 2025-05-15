// orisa/src/components/HeroPage.tsx
import styles from './HeroPage.module.scss';

const HeroPage = ({ gotoSection }: { gotoSection?: (section: string) => void }) => (
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
        <span>Titan AI</span>
      </div>
      <a onClick={() => gotoSection && gotoSection('demo')} className={styles.login}>Sign Up</a>
    </header>
    <main className={styles.main}>
      <h1 className={styles.title}>
      Conversational Search for the Physical World
      </h1>
      <button onClick={() => gotoSection && gotoSection('demo')} className={styles.btn}>Join Waitlist</button>
    </main>
  </div>
);

export default HeroPage;
