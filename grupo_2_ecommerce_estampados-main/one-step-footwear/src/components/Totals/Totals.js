import React from "react";
import './totals.css'
import { useState, useEffect } from 'react';

function Totals() {

    const [productsTotal, setProductsTotal] = useState([]);

    useEffect(function(){
        console.log('%cse montó el componente products en Totals', 'color: green');
        fetch('http://localhost:3000/api/products')
        .then(response => response.json())
        .then(data => {
            setProductsTotal(data.products.length)
        })
        .catch(error => console.log(error))
    }, [])

    useEffect(() => {
        console.log('%cse actualizó el componente products en Totals', 'color: yellow');
    }, [productsTotal])

    useEffect(() => {
        return() => console.log('%cse desmontó el componente products en Totals', 'color: red')
    },[])



    const [users, setUsersTotal] = useState([]);

    useEffect(function(){
        console.log('%cse montó el componente users en Totals', 'color: green');
        fetch('http://localhost:3000/api/users')
        .then(response => response.json())
        .then(data => {
            setUsersTotal(data.users)
        })
        .catch(error => console.log(error))
    }, [])

    useEffect(() => {
        console.log('%cse actualizó el componente users en Totals', 'color: yellow');
    }, [users])

    useEffect(() => {
        return() => console.log('%cse desmontó el componente users en Totals', 'color: red')
    },[])


    const [countByCategory, setCountByCategory] = useState([]);

    useEffect(function(){
        console.log('%cse montó el componente countByCategory en Totals', 'color: green');
        fetch('http://localhost:3000/api/products')
        .then(response => response.json())
        .then(data => {
            console.log(data.countByCategory)
            setCountByCategory(data.countByCategory)
        })
        .catch(error => console.log(error))
    }, [])

    useEffect(() => {
        console.log('%cse actualizó el componente countByCategory en Totals', 'color: yellow');
    }, [countByCategory])

    useEffect(() => {
        return() => console.log('%cse desmontó el componente countByCategory en Totals', 'color: red')
    },[])


	return(
        <section className="totals">
		    <div className="total-products">
                <h2>Total de productos:</h2>
                { productsTotal === '' && <p>Cargando...</p> }
                <p>{productsTotal}</p>
            </div>
            <div className="total-products">
                <h2>Total de usuarios:</h2>
                { users.length === '' && <p>Cargando...</p> }
                <p>{users.length}</p>
            </div>
            <div className="total-products">
                <h2>Total de categorías:</h2>
                { countByCategory.Running === '' && <p>Cargando...</p> }
                { countByCategory.Lifestyle === '' && <p>Cargando...</p> }
                <p>Running: {countByCategory.Running}</p>
                <p>Lifestyle: {countByCategory.Lifestyle}</p>
            </div>
        </section>
	);
}

export default Totals;