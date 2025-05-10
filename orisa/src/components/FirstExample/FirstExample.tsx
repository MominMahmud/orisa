import styles from "./FirstExample.module.scss";
import BackgroundGradientTwo from "../BackgroundGradientTwo/BackgroundGradientTwo";
import Section from "../shared/Section/Section";

const images = [
  "/img1.png",
  "/img2.png"
];

const FirstExample = () => {


  return (
    <div className={styles.exampleBg}>
      <BackgroundGradientTwo />
      <div className={styles.centeredSection}>
        <Section
          heading="Find me coastal areas within 5km of a highway that have a population density of less than 1000 people per square kilometer"
          subheading="A beautiful home with a private garden."
          image1={images[0]}
          image2={images[1]}
          imagePosition="left"
        >
        </Section>
      </div>
    </div>
  );
};

export default FirstExample;