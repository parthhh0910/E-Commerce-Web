import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import AppContext from "../Context/Context";

const Navbar = ({ onSelectCategory }) => {
  const { user, cart, wishlist } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialTheme = () => localStorage.getItem("theme") || "light-theme";
  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for shadow effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Apply theme to body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:8081/api"}`}/products/search?keyword=${value}`
        );
        setSearchResults(res.data);
        setNoResults(res.data.length === 0);
      } catch {
        console.error("Search error");
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };

  const isActive = (path) => location.pathname === path;

  const cartCount = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const wishlistCount = wishlist?.length || 0;

  const categories = ["Laptop", "Audio", "Mobile", "Electronics", "Gaming", "Accessories", "Tablet"];

  // Category icons map
  const catIcons = {
    Laptop: "💻", Audio: "🎧", Mobile: "📱",
    Electronics: "⚡", Gaming: "🎮", Accessories: "🖱️", Tablet: "📱",
  };

  return (
    <>
      <header>
        <nav className={`navbar navbar-expand-lg fixed-top nb-root ${scrolled ? "nb-scrolled" : ""}`}>
          <div className="container-fluid px-4">

            {/* Brand */}
            <a className="nb-brand" href="/">
              <span className="nb-brand__icon">🛒</span>
              <span className="nb-brand__text">HiTeck<span className="nb-brand__accent">Kart</span></span>
            </a>

            {/* Mobile toggler */}
            <button
              className="navbar-toggler nb-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarContent"
              aria-controls="navbarContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarContent">
              {/* Left links */}
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center gap-1">
                <li className="nav-item">
                  <a href="/" className={`nb-link ${isActive("/") ? "nb-link--active" : ""}`}>
                    <i className="bi bi-house me-1"></i>Home
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/add_product" className={`nb-link ${isActive("/add_product") ? "nb-link--active" : ""}`}>
                    <i className="bi bi-plus-circle me-1"></i>Add Product
                  </a>
                </li>

                {/* Categories dropdown */}
                <li className="nav-item dropdown">
                  <a
                    className="nb-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-grid me-1"></i>Categories
                  </a>
                  <ul className="dropdown-menu nb-dropdown">
                    {categories.map((cat) => (
                      <li key={cat}>
                        <button
                          className={`dropdown-item nb-dropdown__item ${selectedCategory === cat ? "nb-dropdown__item--active" : ""}`}
                          onClick={() => handleCategorySelect(cat)}
                        >
                          <span className="nb-dropdown__icon">{catIcons[cat]}</span>
                          {cat}
                        </button>
                      </li>
                    ))}
                    {selectedCategory && (
                      <>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <button className="dropdown-item nb-dropdown__clear" onClick={() => handleCategorySelect("")}>
                            ✕ Clear Filter
                          </button>
                        </li>
                      </>
                    )}
                  </ul>
                </li>
              </ul>

              {/* Right side */}
              <div className="d-flex align-items-center gap-2">

                {/* Search */}
                <div className="nb-search-wrap">
                  <i className="bi bi-search nb-search__icon"></i>
                  <input
                    className="nb-search__input"
                    type="search"
                    placeholder="Search products…"
                    value={input}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                    onFocus={() => input.length >= 1 && setShowSearchResults(true)}
                  />
                  {showSearchResults && (
                    <ul 
                      className="nb-search__results"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {searchResults.length > 0 ? (
                        searchResults.map((r) => (
                          <li key={r.id} className="nb-search__result-item">
                            <a href={`/product/${r.id}`} className="nb-search__result-link">
                              <i className="bi bi-box-seam me-2"></i>{r.name}
                            </a>
                          </li>
                        ))
                      ) : noResults ? (
                        <li className="nb-search__no-result">No product found</li>
                      ) : null}
                    </ul>
                  )}
                </div>

                {/* Theme toggle */}
                <button className="nb-icon-btn nb-theme-btn" onClick={toggleTheme} title="Toggle theme">
                  <i className={`bi ${theme === "dark-theme" ? "bi-sun-fill" : "bi-moon-fill"}`}></i>
                </button>

                {/* Wishlist */}
                <a href="/wishlist" className="nb-icon-btn nb-wishlist-btn" title="Wishlist">
                  <i className="bi bi-heart"></i>
                  {wishlistCount > 0 && <span className="nb-cart-badge">{wishlistCount}</span>}
                </a>

                {/* Cart */}
                <a href="/cart" className="nb-icon-btn nb-cart-btn" title="Cart">
                  <i className="bi bi-cart2"></i>
                  {cartCount > 0 && <span className="nb-cart-badge">{cartCount}</span>}
                </a>

                {/* Profile / Login / Orders */}
                {user ? (
                  <>
                    <a href="/orders" className="nb-icon-btn nb-orders-btn" title="My Orders">
                      <i className="bi bi-box-seam"></i>
                    </a>
                    <a href="/profile" className="nb-profile" title="My Profile">
                      <span className="nb-profile__avatar">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                      <span className="nb-profile__name">{user.name?.split(" ")[0]}</span>
                    </a>
                  </>
                ) : (
                  <a href="/login" className="nb-login-btn">
                    <i className="bi bi-person me-1"></i>Login
                  </a>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
