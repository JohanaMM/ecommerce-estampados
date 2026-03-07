import React from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import "./Footer.css";

const INSTAGRAM_URL = process.env.REACT_APP_INSTAGRAM_URL || "https://www.instagram.com/";
const TIKTOK_URL = process.env.REACT_APP_TIKTOK_URL || "https://www.tiktok.com/";
const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER || "5491163693624";
const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola! Quiero hacer una consulta.")}`;

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-inner">
        <p className="footer-brand">Seguinos en redes</p>
        <div className="footer-social" role="list">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
            aria-label="Instagram"
            role="listitem"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
            aria-label="WhatsApp"
            role="listitem"
          >
            <FaWhatsapp size={24} />
          </a>
          <a
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
            aria-label="TikTok"
            role="listitem"
          >
            <SiTiktok size={24} />
          </a>
        </div>
        <p className="footer-copy">
          © {new Date().getFullYear()} — Estampados y personalización
        </p>
      </div>
    </footer>
  );
}

export default Footer;
