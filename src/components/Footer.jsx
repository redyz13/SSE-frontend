import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

import logoNonDaltonici from "../image/Logo.png";
import logoDaltonici from "../image/RentlyFinaleDaltonici.png";
import insta from "../image/Instagram.png";

import "../style/Footer.css";
import "../style/App.css";

const Footer = () => {
    const { isLoggedIn, toggleDaltonico, daltonico } = useAuth();

    const currentLogo = daltonico ? logoDaltonici : logoNonDaltonici;
    const currentYear = new Date().getFullYear();

    const handleFontChange = () => {
        document.body.classList.toggle("openDyslexic");
    };

    const handleColorChange = () => {
        document.body.classList.toggle("blue");
        toggleDaltonico();
    };

    const servicesLinks = [
        { label: "Area Personale", path: isLoggedIn ? "/profilo" : "/login" },
        { label: "Assistenza", path: "/assistenza" },
        { label: "Catalogo", path: "/catalogo" },
        { label: "Home", path: "/" },
    ];

    return (
        <footer className="footer">
            <div className="info-box">
                <div className="logo-container">
                    <div className="logo">
                        <img src={currentLogo} alt="Logo Rently" loading="lazy" />
                    </div>
                    <div className="brand-name">ently</div>
                </div>
                <div className="info">© {currentYear} Rently. All rights reserved.</div>
                <div className="info">Privacy Policy</div>
                <div className="info">Terms of Service</div>
            </div>

            <div className="info-box">
                <div className="info-header">Informazioni di contatto</div>
                <address className="info" style={{ fontStyle: "normal" }}>
                    Rently - GlobalTrade Connect S.R.L.
                    <br />
                    Via delle Stelle, 77 - 20121 Milano, Italia
                </address>

                <Link to="/chi-siamo" className="no-decoration">
                    <div className="info-link">Chi Siamo</div>
                </Link>

                <div className="social">
                    <div className="social-info">Social:</div>
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src={insta} alt="Instagram" loading="lazy" />
                    </a>
                </div>
            </div>

            <div className="info-box-servizi">
                <div className="info-header">Servizi</div>
                {servicesLinks.map((link, index) => (
                    <Link to={link.path} key={index} className="no-decoration">
                        <div className="info-link">{link.label}</div>
                    </Link>
                ))}
            </div>

            <div className="info-box">
                <div className="info-header">Accessibilità</div>
                <button
                    onClick={handleFontChange}
                    className="accessibility-link btn-dyslexic"
                    aria-label="Attiva font per dislessici"
                >
                    Cambia font
                </button>
                <button
                    onClick={handleColorChange}
                    className="accessibility-link"
                    aria-label="Attiva modalità daltonici"
                >
                    Cambia palette
                </button>
            </div>
        </footer>
    );
};

export default Footer;
