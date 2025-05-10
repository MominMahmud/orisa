import HeroPage from './components/Hero/HeroPage';
import Categories from './components/Categories/Categories';
import SnapScrollContainer from './components/SnapScrollContainer/SnapScrollContainer';
import FirstExample from './components/FirstExample/FirstExample';
import SecondExample from './components/SecondExample/SecondExample';
import ThirdExample from './components/ThirdExample/ThirdExample';
function App() {

  return (
    <SnapScrollContainer direction="y">
    <HeroPage />
    <Categories />
    <FirstExample />
    <SecondExample />
    <ThirdExample />
  </SnapScrollContainer>
  );
}

export default App;