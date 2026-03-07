import React from "react";
import BannerCarousel from "../components/BannerCarousel/BannerCarousel";
import CategoryProductsCarousel from "../components/CategoryProductsCarousel/CategoryProductsCarousel";
import "./Home.css";

const CATEGORIES = [
  { slug: "remeras", name: "Remeras", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80" },
  { slug: "buzos", name: "Buzos", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200&q=80" },
  { slug: "pad-mouse", name: "Pad Mouse", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1200&q=80" },
  { slug: "tazas", name: "Tazas", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=1200&q=80" },
  { slug: "termos", name: "Termos", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1200&q=80" },
];

function Home() {
  return (
    <div className="home-page">
      <BannerCarousel />
      {CATEGORIES.map((cat) => (
        <CategoryProductsCarousel
          key={cat.slug}
          slug={cat.slug}
          name={cat.name}
          image={cat.image}
        />
      ))}
    </div>
  );
}

export default Home;
