import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { FaShoppingCart, FaPlus, FaMinus, FaArrowLeft } from "react-icons/fa";
import { API_PRODUCTS } from "../../config";
import "./ProductDetails.css";

const PENDING_SELECTION_KEY = "pending_product_selection";
const SIZES = ["S", "M", "L", "XL"];
const COLORS = ["Negro", "Blanco", "Gris", "Azul", "Rojo"];

function ProductDetails() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [productDetail, setProductDetail] = useState(null);
  const [user, setUser] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState([{ size: null, color: null }]);
  const [validationError, setValidationError] = useState("");
  const [showAddedModal, setShowAddedModal] = useState(false);
  const [fromListUrl, setFromListUrl] = useState(location.state?.fromList || "/");

  useEffect(() => {
    if (location.state?.fromList) setFromListUrl(location.state.fromList);
    if (typeof location.state?.quantity === "number" && location.state.quantity >= 1) {
      setQuantity(location.state.quantity);
    }
  }, [location.state?.fromList, location.state?.quantity]);

  useEffect(() => {
    const userLocal = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (userLocal) setUser(JSON.parse(userLocal));
  }, []);

  useEffect(() => {
    fetch(`${API_PRODUCTS}/${id}`)
      .then((response) => response.json())
      .then((data) => setProductDetail(data))
      .catch((error) => console.log(error));
  }, [id]);

  useEffect(() => {
    setSelections(prev => {
      const next = [...prev];
      while (next.length < quantity) next.push({ size: null, color: null });
      return next.slice(0, quantity);
    });
  }, [quantity]);

  useEffect(() => {
    const raw = sessionStorage.getItem(PENDING_SELECTION_KEY);
    if (!raw || !id) return;
    try {
      const pending = JSON.parse(raw);
      if (String(pending.productId) !== String(id)) return;
      if (pending.quantity != null && pending.quantity >= 1) setQuantity(pending.quantity);
      if (pending.selections && Array.isArray(pending.selections)) {
        setSelections(pending.selections.slice(0, pending.quantity || 1));
      } else if (pending.size != null || pending.color != null) {
        setQuantity(1);
        setSelections([{ size: pending.size ?? null, color: pending.color ?? null }]);
      }
      if (pending.fromList) setFromListUrl(pending.fromList);
      sessionStorage.removeItem(PENDING_SELECTION_KEY);
    } catch (_) {}
  }, [id]);

  const setUnitSelection = (index, field, value) => {
    setSelections(prev => {
      const next = [...prev];
      if (!next[index]) next[index] = { size: null, color: null };
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleQuantity = (type) => {
    if (type === "plus") setQuantity((prev) => prev + 1);
    else if (type === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleComprar = () => {
    setValidationError("");
    if (!productDetail) return;

    const missing = selections.slice(0, quantity).findIndex((s, i) => !s.size || !s.color);
    if (missing !== -1) {
      const unit = missing + 1;
      const parts = [];
      if (!selections[missing].size) parts.push("talle");
      if (!selections[missing].size && !selections[missing].color) parts.push("y");
      if (!selections[missing].color) parts.push("color");
      setValidationError(`Unidad ${unit}: debes elegir ${parts.join(" ")}.`);
      return;
    }

    if (!user) {
      sessionStorage.setItem(
        PENDING_SELECTION_KEY,
        JSON.stringify({
          productId: id,
          quantity,
          selections: selections.slice(0, quantity),
          fromList: fromListUrl,
        })
      );
      navigate("/login", {
        state: { from: `/product-details/${id}`, fromList: fromListUrl },
      });
      return;
    }

    selections.slice(0, quantity).forEach((sel) => {
      addToCart({
        ...productDetail,
        size: sel.size,
        color: sel.color,
        quantity: 1,
      });
    });
    setShowAddedModal(true);
  };

  if (!productDetail) return <p className="product-detail-loading">Cargando detalles...</p>;

  return (
    <div className="product-detail-wrapper">
      <div className="product-detail-container">
        <div className="top-navigation">
          <button type="button" className="back-btn-styled" onClick={() => navigate(fromListUrl)}>
            <FaArrowLeft /> Volver a la Tienda
          </button>
        </div>

        <div className="product-img-and-details">
          <div className="product-detail-image-box">
            <img
              className="product-detail-image"
              src={productDetail.img}
              alt={productDetail.name}
            />
          </div>

          <div className="product-detail-info">
            <h1 className="product-detail-title">
              {productDetail.Brand} {productDetail.name}
            </h1>
            <p className="product-detail-description">
              <em>{productDetail.description}</em>
            </p>
            <p className="product-detail-price">
              ${Number(productDetail.price).toLocaleString()}
            </p>

            <div className="selector-group">
              <label>Cantidad de unidades:</label>
              <div className="quantity-control">
                <button type="button" onClick={() => handleQuantity("minus")} aria-label="Menos">
                  <FaMinus />
                </button>
                <span>{quantity}</span>
                <button type="button" onClick={() => handleQuantity("plus")} aria-label="Más">
                  <FaPlus />
                </button>
              </div>
            </div>

            <div className="product-detail-units">
              {selections.slice(0, quantity).map((sel, index) => (
                <div key={index} className="product-detail-unit-card">
                  <h4 className="product-detail-unit-title">Unidad {index + 1}</h4>
                  <div className="product-detail-unit-selectors">
                    <div className="selector-group">
                      <label>Talle:</label>
                      <div className="options">
                        {SIZES.map((size) => (
                          <button
                            key={size}
                            type="button"
                            className={sel.size === size ? "active" : ""}
                            onClick={() => setUnitSelection(index, "size", size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="selector-group">
                      <label>Color:</label>
                      <div className="options">
                        {COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={sel.color === color ? "active" : ""}
                            onClick={() => setUnitSelection(index, "color", color)}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {validationError && (
              <p className="product-detail-validation-error">{validationError}</p>
            )}

            <div className="product-detail-actions">
              <button type="button" className="btn-comprar" onClick={handleComprar}>
                <FaShoppingCart /> COMPRAR
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAddedModal && (
        <div
          className="product-detail-modal-overlay"
          onClick={() => setShowAddedModal(false)}
        >
          <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
            <p className="product-detail-modal__text">Producto agregado al carrito</p>
            <div className="product-detail-modal__actions">
              <button
                type="button"
                className="product-detail-modal__btn product-detail-modal__btn--secondary"
                onClick={() => {
                  setShowAddedModal(false);
                  navigate(fromListUrl);
                }}
              >
                Seguir comprando
              </button>
              <button
                type="button"
                className="product-detail-modal__btn product-detail-modal__btn--primary"
                onClick={() => navigate("/carrito")}
              >
                Ir a carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
