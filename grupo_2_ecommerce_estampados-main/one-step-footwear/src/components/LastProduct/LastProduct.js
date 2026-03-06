import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { API_PRODUCTS, IMG_BASE_URL } from "../../config";
import "./LastProduct.css";

function LastProduct() {
  const location = useLocation();
  const [lastProduct, setLastProduct] = useState(null);
  const fromListState = { fromList: location.pathname + location.search };

  useEffect(() => {
    fetch(API_PRODUCTS)
      .then((res) => res.json())
      .then((data) => {
        const productsArray = data.products || [];
        if (productsArray.length === 0) return;
        const mostRecentTime = Math.max(
          ...productsArray.map((p) => new Date(p.created_date).getTime())
        );
        const mostRecent = productsArray.find(
          (p) => new Date(p.created_date).getTime() === mostRecentTime
        );
        setLastProduct(mostRecent);
      })
      .catch(() => setLastProduct(null));
  }, []);

  if (!lastProduct) {
    return (
      <div className="last_product_container">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="last_product_container">
      <img
        className="last-product-img"
        src={`${IMG_BASE_URL}/${lastProduct.img}`}
        alt={lastProduct.name}
      />
      <div className="last-product-text-container">
        <h1>Último producto:</h1>
        <NavLink to={`/product-details/${lastProduct.id}`} state={fromListState}>
          <h2>{lastProduct.name}</h2>
        </NavLink>
      </div>
    </div>
  );
}

export default LastProduct;

