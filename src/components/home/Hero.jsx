import { Link } from "react-router-dom";
import heroImage from "../../assets/images/hero/hero.png";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-wrapper">

        <img
          src={heroImage}
          alt="Full Drinks"
          className="hero-image"
        />

        <Link
          to="/combos"
          className="hero-combos-button"
          aria-label="Ver combos"
        />

      </div>
    </section>
  );
}

export default Hero;
