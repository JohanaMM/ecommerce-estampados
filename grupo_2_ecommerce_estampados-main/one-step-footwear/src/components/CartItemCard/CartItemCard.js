import { useState } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IMG_BASE_URL } from "../../config";
import "./CartItemCard.css";

function CartItemCard({ item, updateCart, removeFromCart }) {
  const quantity = item.quantity ?? 1;
  const [imgError, setImgError] = useState(false);
  const productLink = `/product-details/${item.id}`;

  const imageSrc =
    imgError || !item.img
      ? null
      : item.isCustom
        ? item.img
        : typeof item.img === "string" && item.img.startsWith("http")
          ? item.img
          : `${IMG_BASE_URL}/${item.img}`;

  const handleQty = (e, diff) => {
    e.preventDefault();
    const newQty = Math.max(1, quantity + diff);
    if (updateCart) updateCart(item.lineId ?? item.id, newQty);
  };

  return (
    <div className="cart-item-card">
      <Link to={productLink} className="cart-item-card__img-link">
        <div className="cart-item-card__img">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={item.name}
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="cart-item-card__img-fallback">{item.name}</span>
          )}
        </div>
      </Link>
      <Link to={productLink} className="cart-item-card__info-link">
        <div className="cart-item-card__info">
          {(item.brand || item.Brand) && (
            <span className="cart-item-card__brand">{item.brand || item.Brand}</span>
          )}
          <h3 className="cart-item-card__name">{item.name}</h3>
          <span className="cart-item-card__price">${Number(item.price).toLocaleString()}</span>
          {(item.size || item.color) && (
            <span className="cart-item-card__variant">
              {item.size && <span>Talle: {item.size}</span>}
              {item.size && item.color && " · "}
              {item.color && <span>Color: {item.color}</span>}
            </span>
          )}
        </div>
      </Link>
      <div className="cart-item-card__actions">
        <div className="cart-item-card__qty">
          <button type="button" className="cart-item-card__qty-btn" onClick={(e) => handleQty(e, -1)} aria-label="Menos">
            <FaMinus size={10} />
          </button>
          <span className="cart-item-card__qty-num">{quantity}</span>
          <button type="button" className="cart-item-card__qty-btn" onClick={(e) => handleQty(e, 1)} aria-label="Más">
            <FaPlus size={10} />
          </button>
        </div>
        {removeFromCart && (
          <button
            type="button"
            className="cart-item-card__btn-remove"
            onClick={() => removeFromCart(item.lineId ?? item.id)}
            aria-label="Quitar del carrito"
          >
            <FaTrash size={14} />
            <span>QUITAR</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default CartItemCard;
