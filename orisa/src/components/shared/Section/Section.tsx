import React from "react";
import styles from "./Section.module.scss";
import Typewriter from "../TypeWriter/TypeWriter";

type SectionProps = {
  heading: string;
  children?: React.ReactNode;
  image1: string;
  image2?: string;
  imagePosition?: "left" | "right";
  imageAlt?: string;
  imageText?: string; // Text overlay on image
};

const Section: React.FC<SectionProps> = ({
  heading,
  children,
  image1,
  image2,
  imagePosition = "left",
  imageAlt = "",
  imageText = "Hover to reveal",
}) => {
  const imageBlock = (
    <div className={styles.imageWrapper}>
      <img
        src={image1}
        alt={imageAlt}
        className={`${styles.image} ${styles.imageBase}`}
      />
      {image2 && (
        <img
          src={image2}
          alt={imageAlt}
          className={`${styles.image} ${styles.imageTransition}`}
        />
      )}
      <div className={styles.imageText}>{imageText}</div>
    </div>
  );

  const textBlock = (
    <div className={styles.textBlock}>
      <Typewriter text={heading} />
      {children && <div className={styles.content}>{children}</div>}
    </div>
  );

  return (
    <section className={styles.section}>
      {imagePosition === "left" ? (
        <>
          {imageBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {imageBlock}
        </>
      )}
    </section>
  );
};

export default Section;
