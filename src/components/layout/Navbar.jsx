import { useState } from "react";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiChevronDown,
} from "react-icons/fi";

import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import logo from "../../assets/images/logo/logo.jpg";
import "./Navbar.css";

function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();

    const cleanSearch = search.trim();

    if (!cleanSearch) return;

    navigate(`/buscar?q=${encodeURIComponent(cleanSearch)}`);
    setSearch("");
  };

  return (
    <header className="main-navbar">
      <div className="navbar-shell">
        <Link to="/" className="brand">
          <img
            src={logo}
            alt="Full Drinks"
            className="brand-logo"
          />
        </Link>

        <nav className="desktop-menu">
          <Link className="active" to="/">
            INICIO
          </Link>

          <a href="#productos" className="menu-with-icon">
            PRODUCTOS
            <FiChevronDown />
          </a>

          <Link to="/combos">COMBOS</Link>

          <a href="#contacto">CONTACTO</a>
        </nav>

        <div className="navbar-right">
          <form className="search-box" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <button
              type="submit"
              className="search-submit"
              aria-label="Buscar"
            >
              <FiSearch />
            </button>
          </form>

          <button className="header-icon" aria-label="Usuario">
            <FiUser />
          </button>

          <button
            className="cart-icon"
            aria-label="Abrir carrito"
            onClick={() => setIsCartOpen(true)}
          >
            <FiShoppingCart />
            <span>{totalItems}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
