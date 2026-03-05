import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

function WhatsAppButton() {
  const phoneNumber = "5491163693624"; // Pon tu número aquí
  const message = "Hola! Quiero hacer una consulta.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  // Estilos rápidos para que aparezca sí o sí
  const buttonStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#25d366',
    color: '#fff',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '30px',
    boxShadow: '2px 2px 10px rgba(0,0,0,0.2)',
    zIndex: '10000',
    textDecoration: 'none'
  };

  return (
    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={buttonStyle}>
      <FaWhatsapp />
    </a>
  );
}

export default WhatsAppButton;