import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import CombosCarousel from "../components/home/CombosCarousel";
import Benefits from "../components/home/Benefits";

function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <CombosCarousel />
      <Benefits />
    </>
  );
}

export default Home;
