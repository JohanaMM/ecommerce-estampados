import React, { useState, useEffect } from "react";
import { API_PRODUCTS, API_USERS } from "../../config";
import "./totals.css";

function Totals() {
  const [productsTotal, setProductsTotal] = useState(0);
  const [users, setUsersTotal] = useState([]);
  const [countByCategory, setCountByCategory] = useState({});

  useEffect(() => {
    fetch(API_PRODUCTS)
      .then((res) => res.json())
      .then((data) => setProductsTotal(data.products?.length ?? 0))
      .catch(() => setProductsTotal(0));
  }, []);

  useEffect(() => {
    fetch(API_USERS)
      .then((res) => res.json())
      .then((data) => setUsersTotal(data.users ?? []))
      .catch(() => setUsersTotal([]));
  }, []);

  useEffect(() => {
    fetch(API_PRODUCTS)
      .then((res) => res.json())
      .then((data) => setCountByCategory(data.countByCategory ?? {}))
      .catch(() => setCountByCategory({}));
  }, []);


  return (
    <section className="totals">
      <div className="total-products">
        <h2>Total de productos:</h2>
        <p>{productsTotal}</p>
      </div>
      <div className="total-products">
        <h2>Total de usuarios:</h2>
        <p>{users.length}</p>
      </div>
      <div className="total-products">
        <h2>Total por categoría:</h2>
        {Object.entries(countByCategory).map(([name, total]) => (
          <p key={name}>{name}: {total}</p>
        ))}
      </div>
    </section>
  );
}

export default Totals;