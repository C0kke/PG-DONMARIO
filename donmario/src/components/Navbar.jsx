import { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/Navbar.css';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <nav className="globalNavbar">
            <div className="navbar-inner container-max">
                <div className="navbar-brand">
                    <img className="icon" src="/favicon.ico" alt="Logo" />
                    <Link to="/" onClick={closeMenu} className="brand-name">
                        Maranatha
                    </Link>
                </div>
                <button 
                    className={`hamburger-btn ${isOpen ? 'open' : ''}`} 
                    onClick={toggleMenu}
                    aria-label="Abrir menú"
                >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>
                <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
                    <Link to="/" onClick={closeMenu}>Inicio</Link>
                    <Link to="/catalogo" onClick={closeMenu}>Catálogo</Link>
                    <Link to="/contacto" onClick={closeMenu}>Contacto</Link>
                </div>
            </div>
        </nav>
    );
}