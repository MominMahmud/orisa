import React, { useEffect, useRef, useState } from "react";
import styles from "./BackgroundGradient.module.scss";

const BackgroundGradient: React.FC = () => {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);

  useEffect(() => {
    function move() {
      if (!interactiveRef.current) return;
      setCurX((prev) => prev + (tgX - prev) / 20);
      setCurY((prev) => prev + (tgY - prev) / 20);
      interactiveRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
    }
    move();
  }, [tgX, tgY, curX, curY]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (interactiveRef.current) {
      const rect = interactiveRef.current.getBoundingClientRect();
      setTgX(event.clientX - rect.left);
      setTgY(event.clientY - rect.top);
    }
  };

  return (
    <div className={styles.gradientBgContainer} onMouseMove={handleMouseMove}>
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className={styles.gradientsContainer}>
        <div className={`${styles.gradient} ${styles.first}`}></div>
        <div className={`${styles.gradient} ${styles.second}`}></div>
        <div className={`${styles.gradient} ${styles.third}`}></div>
        <div className={`${styles.gradient} ${styles.fourth}`}></div>
        <div className={`${styles.gradient} ${styles.fifth}`}></div>
        <div ref={interactiveRef} className={`${styles.gradient} ${styles.pointer}`}></div>
      </div>
    </div>
  );
};

export default BackgroundGradient; 