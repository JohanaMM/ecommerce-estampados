import React, { useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "../ProductCard/ProductCard";
import { CartContext } from "../../context/CartContext";
import { getMockProductsByCategory } from "../../data/mockProductsByCategory";
import "./CategoryProductsCarousel.css";

const CARD_WIDTH = 280;
const GAP = 20;
const CARDS_PER_PAGE = 3;

function CategoryProductsCarousel({ slug, name, image }) {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef(null);
  const { addToCart } = useContext(CartContext);

  const displayProducts = getMockProductsByCategory(slug);
  const totalCards = 1 + displayProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalCards / CARDS_PER_PAGE));

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const pageWidth = (CARD_WIDTH + GAP) * CARDS_PER_PAGE;
    const page = Math.round(scrollLeft / pageWidth);
    setCurrentPage(Math.min(page, totalPages - 1));
  };

  const scrollToPage = (page) => {
    const el = scrollRef.current;
    if (!el) return;
    const pageIndex = Math.max(0, Math.min(page, totalPages - 1));
    const pageWidth = (CARD_WIDTH + GAP) * CARDS_PER_PAGE;
    const targetScroll = pageIndex * pageWidth;
    setCurrentPage(pageIndex);
    el.scrollTo({ left: targetScroll, behavior: "smooth" });
  };

  const scroll = (dir) => {
    const next = currentPage + dir;
    if (next >= 0 && next < totalPages) scrollToPage(next);
  };

  return (
    <section className="category-products-carousel">
      <div className="category-products-container">
        <button
          type="button"
          className="category-products-arrow category-products-arrow--prev"
          onClick={() => scroll(-1)}
          aria-label="Anterior"
        >
          <FaChevronLeft size={24} />
        </button>
        <button
          type="button"
          className="category-products-arrow category-products-arrow--next"
          onClick={() => scroll(1)}
          aria-label="Siguiente"
        >
          <FaChevronRight size={24} />
        </button>

        <div
          className="category-products-scroll"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          <Link to={`/products/${slug}`} className="category-products-first-card">
            <div
              className="category-products-first-card-img"
              style={{ backgroundImage: `url(${image})` }}
            />
            <span className="category-products-first-card-title">{name}</span>
          </Link>
          {displayProducts.map((product) => (
            <div key={product.id} className="category-products-card-wrap">
              <ProductCard product={product} addToCart={addToCart} />
            </div>
          ))}
        </div>
      </div>

      <Link to={`/products/${slug}`} className="category-products-ver-mas">
        Ver toda la categoría
      </Link>
    </section>
  );
}

export default CategoryProductsCarousel;
