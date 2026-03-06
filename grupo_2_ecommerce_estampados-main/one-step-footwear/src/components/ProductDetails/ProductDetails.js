import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { FaShoppingCart, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa';
import './ProductDetails.css';

function ProductDetails() {
    const [productDetail, setProductDetail] = useState(null);
    const [selectedSize, setSelectedSize] = useState("M");
    const [selectedColor, setSelectedColor] = useState("Blanco");
    const [quantity, setQuantity] = useState(1);
    
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        fetch(`http://localhost:3000/api/products/${id}`)
            .then(response => response.json())
            .then(data => setProductDetail(data))
            .catch(error => console.log(error));
    }, [id]);

    const handleQuantity = (type) => {
        if (type === "plus") setQuantity(prev => prev + 1);
        else if (type === "minus" && quantity > 1) setQuantity(prev => prev - 1);
    };

    if (!productDetail) return <p className="loading">Cargando detalles...</p>;

    return (
        <section className="product-detail-container">
            {/* BOTÓN VOLVER ESTILIZADO */}
            <div className="top-navigation">
                <button className="back-btn-styled" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Volver a la Tienda
                </button>
            </div>

            <div className="product-img-and-details">
                <div className="image-box">
                    <img className="product-image" src={productDetail.img} alt={productDetail.name} />
                </div>

                <div className="info-box">
                    <h1 className="main-title">{productDetail.Brand} {productDetail.name}</h1>
                    <p className="description"><em>{productDetail.description}</em></p>
                    <p className="price-tag">${productDetail.price}</p>

                    <div className="selectors">
                        <div className="selector-group">
                            <label>Talle:</label>
                            <div className="options">
                                {["S", "M", "L", "XL"].map(size => (
                                    <button 
                                        key={size} 
                                        className={selectedSize === size ? "active" : ""} 
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="selector-group">
                            <label>Cantidad:</label>
                            <div className="quantity-control">
                                <button onClick={() => handleQuantity("minus")}><FaMinus /></button>
                                <span>{quantity}</span>
                                <button onClick={() => handleQuantity("plus")}><FaPlus /></button>
                            </div>
                        </div>
                    </div>

                    <div className="button-actions">
                        <button className="add-to-cart-btn" onClick={() => {
                            addToCart({...productDetail, size: selectedSize, color: selectedColor, quantity});
                            alert("Agregado!");
                        }}>
                            <FaShoppingCart /> AGREGAR AL CARRITO
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProductDetails;