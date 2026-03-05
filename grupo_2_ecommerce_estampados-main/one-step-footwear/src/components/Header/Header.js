import React, { useEffect, useState } from 'react';
import Logo from '../../Logo.png';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import './header.css';

function Header() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    
    const checkUser = () => {
      const userLocal = localStorage.getItem("user");
      const userSession = sessionStorage.getItem("user");
      if (userLocal) {
        setUser(JSON.parse(userLocal));
      } else if (userSession) {
        setUser(JSON.parse(userSession));
      } else {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    window.location.href = "/";
  };

  const isShopActive = location.pathname.includes('/products');

  return (
    <header className={`main-header ${scrolled ? 'is-scrolled' : ''}`}>
      <Link to="/" className='nav-logo' onClick={() => setMenuOpen(false)}>
        <img src={Logo} alt="Logo" />
      </Link>

      <div className={`nav-hamburger ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
        <span></span><span></span><span></span>
      </div>

      <nav className={`nav-container ${menuOpen ? "is-open" : ""}`}>
        <div className='nav-menu-links'>
          <NavLink to="/" end onClick={() => setMenuOpen(false)} className="nav-item">Inicio</NavLink>

          <div className={`nav-dropdown ${dropdownOpen ? "expanded" : ""}`}>
            <div className={`nav-dropdown-toggle ${isShopActive ? 'active' : ''}`} onClick={() => setDropdownOpen(!dropdownOpen)}>
              Tienda <FaChevronDown size={10} className="icon-arrow" />
            </div>
            
            <div className="nav-dropdown-list">
              <NavLink to="/products/remeras" onClick={() => setMenuOpen(false)}>Remeras</NavLink>
              <NavLink to="/products/buzos" onClick={() => setMenuOpen(false)}>Buzos</NavLink>
              <NavLink to="/products/pad-mouse" onClick={() => setMenuOpen(false)}>Pad Mouse</NavLink>
              <NavLink to="/products/tazas" onClick={() => setMenuOpen(false)}>Tazas</NavLink>
              <NavLink to="/products/termos" onClick={() => setMenuOpen(false)}>Termos</NavLink>
            </div>
          </div>

          <NavLink to="/personaliza" onClick={() => setMenuOpen(false)} className="nav-item">Personaliza</NavLink>
          <NavLink to="/contacto" onClick={() => setMenuOpen(false)} className="nav-item">Contacto</NavLink>
          
          <NavLink to="/carrito" className="nav-cart" onClick={() => setMenuOpen(false)}>
            <FaShoppingCart size={20} />
          </NavLink>

          <div className="nav-auth">
            {user ? (
              <div className="nav-user-container">
                <Link to="/perfil" className="nav-user-pill">
                  <FaUser size={12} />
                  <span>{user.first_name}</span>
                </Link>
                <button className="nav-logout-btn" onClick={handleLogout} type="button">
                  <FaSignOutAlt size={16} />
                </button>
              </div>
            ) : (
              <NavLink to="/login" className="nav-btn-ingresar" onClick={() => setMenuOpen(false)}>
                Ingresar
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;