import styles from "./ThirdExample.module.scss";
import Section from "../shared/Section/Section";
import BackgroundGradientTwo from "../BackgroundGradientTwo/BackgroundGradientTwo";

const images = [
  "../../../public/img5.png",
  "../../../public/img6.png"
];

const ThirdExample = () => {


  return (
    <div className={styles.exampleBg}>
      <BackgroundGradientTwo />
      <div className={styles.centeredSection}>
        <Section
          heading="Find mountain regions within 3km of a hiking trail where elevation is above 1500 meters and population is under 100 per km²."
          image1={images[0]}
          image2={images[1]}
          imagePosition="left"
        >
        </Section>
      </div>
    </div>
  );
};

export default ThirdExample;