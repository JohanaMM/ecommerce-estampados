import React from "react";
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import './ProductDetails.css'


function ProductDetails() {
    

    const [productDetail, setProductDetail] = useState([]);
    const params = useParams();

    useEffect(function(){
        console.log('%cse montó el componente productDetail en productDetails', 'color: green');
        
        fetch(`http://localhost:3000/api/products/${params.id}`)
        .then(response => response.json())
        .then(data => {
            
            
            setProductDetail(data)
        })
        .catch(error => console.log(error))
    }, [])

    useEffect(() => {
        console.log('%cse actualizó el componente productDetail en productDetails', 'color: yellow');
    }, [productDetail])

    useEffect(() => {
        return() => console.log('%cse desmontó el componente productDetail en productDetails', 'color: red')
    },[])

    console.log("checking on what is brought 2", productDetail.description)
    return(
            <section className="product-detail-container">
                { productDetail === '' && <p>Cargando...</p> }
                <h1 className="title">{productDetail.Brand} {productDetail.name}</h1>
                <div className="product-img-and-details">
                    <img className="product-image" src={`${productDetail.img}`} alt="product"/>
                    <div>
                        <p><em>{productDetail.description}</em></p>
                        <p>Precio: ${productDetail.price}</p>
                        <button><a href={`http://localhost:3000/products/productDetails/${params.id}`}>Ir a la tienda</a></button>  
                    </div>
                </div>
            </section>
    )
}

export default ProductDetails;