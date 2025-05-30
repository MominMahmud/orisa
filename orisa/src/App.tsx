// App.tsx
import { useRef } from 'react';
import HeroPage from './components/Hero/HeroPage';
import Categories from './components/Categories/Categories';
import type { SnapScrollContainerHandle } from "./components/SnapScrollContainer/SnapScrollContainer";
import Demo from './components/Demo/Demo';
import Form from './components/Form/Form';
import { Toaster } from 'react-hot-toast';
function App() {
  const ref = useRef<SnapScrollContainerHandle>(null);

  const handleGoToSecondSection = () => {
    ref.current?.goToSection(3);
  };


  return (

    <>
    {/* <SnapScrollContainer direction="y" ref={ref}> */}
      <HeroPage gotoSection={handleGoToSecondSection} />
        <Categories />
        <Demo />
        <Form />
      {/* </SnapScrollContainer> */}
      <Toaster />
    </>
  );
}

export default App;
