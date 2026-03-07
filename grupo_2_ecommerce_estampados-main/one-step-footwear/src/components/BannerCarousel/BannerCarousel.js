import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./BannerCarousel.css";

const BANNERS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1558769132-cb1aeaedea76?w=1200&q=80",
    title: "Estampados únicos",
    subtitle: "Remeras, buzos y más",
    link: "/product-list",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80",
    title: "Personalizá tu estilo",
    subtitle: "Diseños a tu medida",
    link: "/personaliza",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
    title: "Nuevas colecciones",
    subtitle: "Mirá la tienda",
    link: "/product-list",
  },
];

function BannerCarousel() {
  const [current, setCurrent] = useState(0);

  const goTo = (index) => {
    setCurrent((index + BANNERS.length) % BANNERS.length);
  };

  useEffect(() => {
    const timer = setInterval(() => goTo(current + 1), 5000);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <section className="banner-carousel" aria-label="Carrusel de ofertas">
      <div className="banner-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {BANNERS.map((banner) => (
          <div key={banner.id} className="banner-slide">
            <div
              className="banner-bg"
              style={{ backgroundImage: `url(${banner.image})` }}
            />
            <div className="banner-overlay" />
            <div className="banner-content">
              <h2 className="banner-title">{banner.title}</h2>
              <p className="banner-subtitle">{banner.subtitle}</p>
              {banner.link && (
                <Link to={banner.link} className="banner-cta">
                  Ver más
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="banner-btn banner-btn--prev"
        onClick={() => goTo(current - 1)}
        aria-label="Anterior"
      >
        <FaChevronLeft size={24} />
      </button>
      <button
        type="button"
        className="banner-btn banner-btn--next"
        onClick={() => goTo(current + 1)}
        aria-label="Siguiente"
      >
        <FaChevronRight size={24} />
      </button>

      <div className="banner-dots">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`banner-dot ${i === current ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Ir a slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default BannerCarousel;
