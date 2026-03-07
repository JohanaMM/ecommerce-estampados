import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./CategoryCarousel.css";

const CATEGORIES = [
  { slug: "remeras", name: "Remeras", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80" },
  { slug: "buzos", name: "Buzos", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80" },
  { slug: "pad-mouse", name: "Pad Mouse", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80" },
  { slug: "tazas", name: "Tazas", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80" },
  { slug: "termos", name: "Termos", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80" },
];

function CategoryCarousel() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const step = 280;
    scrollRef.current.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="category-carousel-wrap">
      <h2 className="category-carousel-title">Explorar por categoría</h2>
      <div className="category-carousel">
        <button
          type="button"
          className="category-carousel-btn category-carousel-btn--prev"
          onClick={() => scroll(-1)}
          aria-label="Anterior"
        >
          <FaChevronLeft size={20} />
        </button>

        <div className="category-carousel-scroll" ref={scrollRef}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products/${cat.slug}`}
              className="category-card"
            >
              <div
                className="category-card-img"
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              <span className="category-card-name">{cat.name}</span>
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="category-carousel-btn category-carousel-btn--next"
          onClick={() => scroll(1)}
          aria-label="Siguiente"
        >
          <FaChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}

export default CategoryCarousel;
