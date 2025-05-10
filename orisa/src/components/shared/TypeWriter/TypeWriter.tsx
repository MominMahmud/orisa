import React, { useEffect, useRef, useState } from "react";
import styles from "./TypeWriter.module.scss";

type TypewriterProps = {
  text?: string;
  className?: string;
  typingSpeed?: number;
  onComplete?: () => void;
};

const Typewriter: React.FC<TypewriterProps> = ({
  text = "",
  className = "",
  typingSpeed = 30,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [shouldType, setShouldType] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Intersection Observer logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldType(true);
          observer.disconnect(); // Run only once
        }
      },
      { threshold: 0.5 } // adjust if needed
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!shouldType) return;

    let currentIndex = 0;
    const safeText = text ?? "";
    let active = true;

    const typeChar = () => {
      if (!active) return;

      if (currentIndex <= safeText.length) {
        setDisplayedText(safeText.slice(0, currentIndex));
        currentIndex++;
        setTimeout(typeChar, typingSpeed);
      } else {
        onComplete?.();
      }
    };

    setDisplayedText("");
    typeChar();

    return () => {
      active = false;
    };
  }, [shouldType, text, typingSpeed, onComplete]);

  return (
    <div ref={containerRef} className={`${styles.typewriterWrapper} ${className}`}>
      <span className={styles.typewriterText}>
        {displayedText}
        <span className={styles.cursor} />
      </span>
    </div>
  );
};

export default Typewriter;
