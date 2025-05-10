import React from "react";
import styles from "./BackgroundGradientTwo.module.scss";

const BackgroundGradientTwo: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className={styles.gradientBgContainer}>
    <div className={styles.gradientsContainer}>
      <div className={styles.pitchBlack}></div>
      <div className={`${styles.gradient} ${styles.first}`}></div>
      <div className={`${styles.gradient} ${styles.second}`}></div>
      <div className={`${styles.gradient} ${styles.third}`}></div>
      <div className={`${styles.gradient} ${styles.fourth}`}></div>
      <div className={`${styles.gradient} ${styles.fifth}`}></div>
      <div className={`${styles.gradient} ${styles.pointer}`}></div>
    </div>
    {children}
  </div>
);

export default BackgroundGradientTwo;