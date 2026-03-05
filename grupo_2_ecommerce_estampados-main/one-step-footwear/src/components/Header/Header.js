import React, { useEffect, useState } from 'react';
import Logo from '../../Logo.png';
import { Link, NavLink } from 'react-router-dom';
import './header.css';

function Header() {

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {

    const userLocal = localStorage.getItem("user");
    const userSession = sessionStorage.getItem("user");

    if (userLocal) {
      setUser(JSON.parse(userLocal));
    } else if (userSession) {
      setUser(JSON.parse(userSession));
    }

  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    window.location.href = "/";
  };

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  return (

    <header className='header'>

      <Link to="/" className='header_logo' onClick={closeMenu}>
        <img src={Logo} alt="Logo" />
      </Link>

      {/* hamburguesa */}

      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>


      <nav className={`header_nav ${menuOpen ? "open" : ""}`}>

        <div className='header_links'>

          <NavLink to="/" end onClick={closeMenu}>
            Inicio
          </NavLink>


          <div className="dropdown">

            <div
              className="dropdown-toggle"
              onClick={toggleDropdown}
            >
              Tienda
            </div>

            <div className={`dropdown-content ${dropdownOpen ? "open" : ""}`}>

              <NavLink to="/products/remeras" onClick={closeMenu}>
                Remeras
              </NavLink>

              <NavLink to="/products/buzos" onClick={closeMenu}>
                Buzos
              </NavLink>

              <NavLink to="/products/pad-mouse" onClick={closeMenu}>
                Pad Mouse
              </NavLink>

              <NavLink to="/products/tazas" onClick={closeMenu}>
                Tazas
              </NavLink>

              <NavLink to="/products/termos" onClick={closeMenu}>
                Termos
              </NavLink>

            </div>

          </div>


          <NavLink to="/personaliza" onClick={closeMenu}>
            Personaliza
          </NavLink>

          <NavLink to="/contacto" onClick={closeMenu}>
            Contacto
          </NavLink>

          <NavLink to="/carrito" onClick={closeMenu}>
            Carrito
          </NavLink>


          {user ? (
            <>
              <NavLink to="/perfil" onClick={closeMenu}>
                Hola, {user.first_name}
              </NavLink>

              <button onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={closeMenu}>
                Login
              </NavLink>

              <NavLink to="/register" onClick={closeMenu}>
                Registrarse
              </NavLink>
            </>
          )}

        </div>

      </nav>

    </header>

  );
}

export default Header;