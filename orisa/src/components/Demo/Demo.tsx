import styles from './Demo.module.scss';

const Demo = () => {
  return (
    <video
      className={styles.demoVideo}
      src="/demo.mov"
      autoPlay
      loop
      muted
      playsInline
    />
  );
};

export default Demo;
