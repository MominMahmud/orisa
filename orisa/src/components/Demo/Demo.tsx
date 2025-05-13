import styles from './Demo.module.scss';

const Demo = () => {
  return (
    <div className={styles.demoContainer}>
      <div className={styles.demoText}>How it works</div>
    <video
      className={styles.demoVideo}
      src="/demo.mp4"
      autoPlay
      controlsList="nodownload"
      loop
      muted
      controls
      playsInline
    />
    </div>
  );
};

export default Demo;
