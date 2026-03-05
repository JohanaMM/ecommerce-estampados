import React from "react";
import './LastProduct.css'
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'


function LastProduct() {


     const [lastProduct, setLastProduct] = useState([]);
  
     useEffect(function(){
          console.log('%cse montó el componente LastProduct en LastProduct', 'color: green');
          fetch('http://localhost:3000/api/products')
          .then(response => response.json())
          .then(data => {

               
               let productsArray = data.products
          

               let mostRecentDate = new Date(Math.max.apply(null, productsArray.map( element => {
               return new Date(element.created_date);
               })));
               let mostRecentProduct = productsArray.filter( element => {
               let d = new Date( element.created_date );
               return d.getTime() === mostRecentDate.getTime();
               })[0];

               setLastProduct(mostRecentProduct)


          })
          .catch(error => console.log(error))
          }, [])

          useEffect(() => {
               console.log('%cse actualizó el componente LastProduct en LastProduct', 'color: yellow');
          }, [lastProduct])

          useEffect(() => {
               return() => console.log('%cse desmontó el componente LastProduct en LastProduct', 'color: red')
          },[])


          console.log("checking if the last recent product was stored correctly", lastProduct.name)


          return(
          <>
               <div className="last_product_container">
               <img className="last-product-img" src={`http://localhost:3000/img/${lastProduct.img}`} alt="last-product-img" />
                    <div className="last-product-text-container">
                         <h1>Ultimo producto:</h1>
                         { lastProduct === '' && <p>Cargando...</p> }
                         <NavLink to={`product-details/${lastProduct.id}`}><h2>{lastProduct.name}</h2></NavLink>
                    </div>
               </div> 
          </>
          );
}

export default LastProduct;
     

    
    
