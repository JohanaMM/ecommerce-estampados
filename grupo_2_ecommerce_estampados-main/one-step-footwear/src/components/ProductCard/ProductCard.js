import { useState } from "react";
import { FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { IMG_BASE_URL } from "../../config";
import "./ProductCard.css";

function ProductCard({ product, addToCart }) {
  const location = useLocation();
  const [localQty, setLocalQty] = useState(1);
  const imageSrc = product.isCustom ? product.img : `${IMG_BASE_URL}/${product.img}`;
  const productLink = `/product-details/${product.id}`;
  const fromListState = {
    fromList: location.pathname + location.search,
    quantity: localQty,
  };

  const handleQty = (e, diff) => {
    e.preventDefault();
    setLocalQty((prev) => Math.max(1, prev + diff));
  };

  return (
    <div className="product-card">
      {product.isCustom && <div className="product-badge">Custom</div>}
      <Link to={productLink} className="product-link-wrapper">
        <div className="product-img-wrapper">
          <img src={imageSrc} alt={product.name} loading="lazy" />
        </div>
        <div className="product-info-body">
          <span className="product-brand">{product.brand}</span>
          <h3 className="product-name">{product.name}</h3>
          <span className="product-price">${Number(product.price).toLocaleString()}</span>
        </div>
      </Link>
      <div className="product-actions-bar">
        <div className="qty-selector">
          <button type="button" className="qty-btn" onClick={(e) => handleQty(e, -1)} aria-label="Menos">
            <FaMinus size={10} />
          </button>
          <span className="qty-number">{localQty}</span>
          <button type="button" className="qty-btn" onClick={(e) => handleQty(e, 1)} aria-label="Más">
            <FaPlus size={10} />
          </button>
        </div>
        <Link to={productLink} state={fromListState} className="btn-buy btn-buy--link">
          <FaShoppingCart size={14} />
          <span>COMPRAR</span>
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
