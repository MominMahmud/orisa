import styles from "./SecondExample.module.scss";
import Section from "../shared/Section/Section";
import BackgroundGradient from "../BackgroundGradient/BackgroundGradient";

const images = [
  "../../../public/img3.png",
  "../../../public/img4.png"
];

const SecondExample = () => {


  return (
    <div className={styles.exampleBg}>
      <BackgroundGradient />
      <div className={styles.centeredSection}>
        <Section
          heading="List suburban zones within 2km of a railway line where average household income exceeds $50,000"
          image1={images[0]}
          image2={images[1]}
          imagePosition="right"
        >
        </Section>
      </div>
    </div>
  );
};

export default SecondExample;