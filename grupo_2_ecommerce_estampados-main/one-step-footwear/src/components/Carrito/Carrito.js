import React, { useContext, useState, useEffect, useRef } from "react";
import { CartContext } from "../../context/CartContext";
import CartItemCard from "../CartItemCard/CartItemCard";
import { API_PAYMENTS, API_SHIPPING, API_USERS, API_ORDERS, MERCADOPAGO_DOMAIN } from "../../config";
import { useNavigate } from "react-router-dom";
import { PROVINCIAS, CIUDADES, LOCALIDADES_POR_CIUDAD } from "../../data/ubicaciones";
import { FaArrowLeft, FaTruck, FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
import "./Carrito.css";

const CHECKOUT_STORAGE_KEY = "oneStep_cartCheckout";

const emptyAddress = () => ({
  first_name: "",
  last_name: "",
  phone: "",
  address_street: "",
  address_number: "",
  address_depto: "",
  address_province: "",
  address_ciudad: "",
  address_localidad: "",
  address_postal_code: "",
});

const localidadesForCiudad = (ciudad) => (LOCALIDADES_POR_CIUDAD[ciudad] || []);

const AddressForm = ({ data, onChange, showName = true }) => (
  <div className="shipping-form-grid">
    {showName && (
      <>
        <div className="shipping-field">
          <label>Nombre</label>
          <input value={data.first_name || ""} onChange={(e) => onChange("first_name", e.target.value)} placeholder="Nombre" />
        </div>
        <div className="shipping-field">
          <label>Apellido</label>
          <input value={data.last_name || ""} onChange={(e) => onChange("last_name", e.target.value)} placeholder="Apellido" />
        </div>
      </>
    )}
    {showName && (
      <div className="shipping-field shipping-field--full">
        <label>Teléfono de contacto</label>
        <input
          type="tel"
          inputMode="numeric"
          value={data.phone || ""}
          onChange={(e) => {
            const onlyNumbers = e.target.value.replace(/\D/g, "");
            onChange("phone", onlyNumbers);
          }}
          placeholder="Ej: 1112345678"
        />
      </div>
    )}
    <div className="shipping-field shipping-field--full">
      <label>Calle</label>
      <input value={data.address_street || ""} onChange={(e) => onChange("address_street", e.target.value)} placeholder="Calle" />
    </div>
    <div className="shipping-field">
      <label>Número</label>
      <input value={data.address_number || ""} onChange={(e) => onChange("address_number", e.target.value)} placeholder="Nº" />
    </div>
    <div className="shipping-field">
      <label>Depto / Casa</label>
      <input value={data.address_depto || ""} onChange={(e) => onChange("address_depto", e.target.value)} placeholder="Depto, piso, casa" />
    </div>
    <div className="shipping-field">
      <label>Provincia</label>
      <select value={data.address_province || ""} onChange={(e) => onChange("address_province", e.target.value)}>
        <option value="">Seleccionar provincia</option>
        {PROVINCIAS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>
    <div className="shipping-field">
      <label>Ciudad</label>
      <select value={data.address_ciudad || ""} onChange={(e) => onChange("address_ciudad", e.target.value)}>
        <option value="">Seleccionar ciudad</option>
        {CIUDADES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
    <div className="shipping-field">
      <label>Localidad</label>
      <select value={data.address_localidad || ""} onChange={(e) => onChange("address_localidad", e.target.value)} disabled={!data.address_ciudad}>
        <option value="">Seleccionar localidad</option>
        {localidadesForCiudad(data.address_ciudad).map((loc) => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>
    </div>
    <div className="shipping-field">
      <label>Código postal</label>
      <input value={data.address_postal_code || ""} onChange={(e) => onChange("address_postal_code", e.target.value)} placeholder="CP" />
    </div>
  </div>
);

function Carrito() {
  const navigate = useNavigate();
  const { cart, updateCart, removeFromCart, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(emptyAddress());
  const [shipToOther, setShipToOther] = useState(false);
  const [shippingForm, setShippingForm] = useState(emptyAddress());
  const [carrierMethod, setCarrierMethod] = useState(null);
  const [shippingPrices, setShippingPrices] = useState({ andreani: null, correo: null, moto: null });
  const [shippingLoading, setShippingLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [transferInfo, setTransferInfo] = useState(null);
  const [profileSaved, setProfileSaved] = useState(false);
  const profileLoadedRef = useRef(false);
  const userHasEditedFormRef = useRef(false);
  const hasRestoredRef = useRef(false);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const DISCOUNT_TRANSFER = 0.1;
  const selectedShippingPrice = carrierMethod ? (shippingPrices[carrierMethod] ?? 0) : 0;
  const subtotalWithShipping = total + selectedShippingPrice;
  const totalWithDiscount = paymentMethod === "transfer" ? subtotalWithShipping * (1 - DISCOUNT_TRANSFER) : subtotalWithShipping;

  const addressForQuote = shipToOther ? shippingForm : form;

  useEffect(() => {
    const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  useEffect(() => {
    if (cart.length === 0 || hasRestoredRef.current) return;
    try {
      const raw = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);
      if (!raw) return;
      const state = JSON.parse(raw);
      hasRestoredRef.current = true;
      if (state.step != null && state.step >= 2) setStep(state.step);
      if (state.form && typeof state.form === "object") setForm({ ...emptyAddress(), ...state.form });
      if (state.shippingForm && typeof state.shippingForm === "object") setShippingForm({ ...emptyAddress(), ...state.shippingForm });
      if (state.shipToOther != null) setShipToOther(!!state.shipToOther);
      if (state.carrierMethod != null) setCarrierMethod(state.carrierMethod);
      if (state.paymentMethod != null) setPaymentMethod(state.paymentMethod);
      userHasEditedFormRef.current = true;
    } catch (e) {
      /* ignore */
    }
  }, [cart.length]);

  useEffect(() => {
    if (step === 1) {
      profileLoadedRef.current = false;
      return;
    }
    if (step === 2 && user && user.id && !profileLoadedRef.current) {
      profileLoadedRef.current = true;
      fetch(`${API_USERS}/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (userHasEditedFormRef.current) return;
          const fromApi = {
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            phone: data.phone || "",
            address_street: data.address_street || "",
            address_number: data.address_number || "",
            address_depto: data.address_depto || "",
            address_province: data.address_province || "",
            address_ciudad: data.address_ciudad || (data.address_city || "").split(",")[0]?.trim() || "",
            address_localidad: data.address_localidad || (data.address_city || "").split(",")[1]?.trim() || (data.address_city || "").trim() || "",
            address_postal_code: data.address_postal_code || "",
          };
          setForm(fromApi);
        })
        .catch(() => {});
    }
  }, [step, user]);

  useEffect(() => {
    if (cart.length === 0) {
      try {
        sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
      } catch (e) {}
      return;
    }
    if (step >= 2) {
      try {
        sessionStorage.setItem(
          CHECKOUT_STORAGE_KEY,
          JSON.stringify({
            step,
            form,
            shippingForm,
            shipToOther,
            carrierMethod,
            paymentMethod,
          })
        );
      } catch (e) {
        /* ignore */
      }
    }
  }, [step, form, shippingForm, shipToOther, carrierMethod, paymentMethod, cart.length]);

  useEffect(() => {
    if (paymentMethod === "transfer" && !transferInfo) {
      fetch(`${API_PAYMENTS}/transfer-info`)
        .then((res) => res.json())
        .then(setTransferInfo)
        .catch(() => setTransferInfo({ cvu: "", alias: "", titular: "", banco: "", whatsappLink: "" }));
    }
  }, [paymentMethod, transferInfo]);

  useEffect(() => {
    const hasAddress = addressForQuote.address_street && addressForQuote.address_ciudad && addressForQuote.address_localidad;
    if (!hasAddress) {
      setShippingPrices({ andreani: null, correo: null, moto: null });
      return;
    }
    setShippingLoading(true);
    const methods = ["andreani", "correo", "moto"];
    Promise.all(
      methods.map((method) =>
        fetch(`${API_SHIPPING}/quote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: addressForQuote, shippingMethod: method }),
        })
          .then((r) => r.json())
          .then((data) => ({ method, price: data.price != null ? data.price : null }))
          .catch(() => ({ method, price: null }))
      )
    ).then((results) => {
      const next = { andreani: null, correo: null, moto: null };
      results.forEach(({ method, price }) => { next[method] = price; });
      setShippingPrices(next);
    }).finally(() => setShippingLoading(false));
  }, [shipToOther, addressForQuote.address_street, addressForQuote.address_ciudad, addressForQuote.address_localidad]);

  const updateForm = (field, value) => {
    userHasEditedFormRef.current = true;
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "address_ciudad") next.address_localidad = "";
      return next;
    });
  };
  const updateShippingForm = (field, value) => {
    setShippingForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "address_ciudad") next.address_localidad = "";
      return next;
    });
  };

  const saveProfile = () => {
    if (!user || !user.id) return;
    setLoading(true);
    setProfileSaved(false);
    fetch(`${API_USERS}/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (res.ok) {
          setProfileSaved(true);
          setTimeout(() => setProfileSaved(false), 4000);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleCheckoutMercadoPago = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_PAYMENTS}/create_preference`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
        credentials: "include",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const msg = [data.error, data.detail].filter(Boolean).join(": ") || `Error ${response.status}`;
        throw new Error(msg);
      }
      if (data.id) {
        window.location.href = `https://www.mercadopago.${MERCADOPAGO_DOMAIN}/checkout/v1/redirect?pref_id=${data.id}`;
      } else {
        throw new Error(data.error || "No se recibió ID de preferencia");
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert(error.message || "No se pudo iniciar el pago. Revisa la consola del servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Tu Carrito</h1>
        <span className="cart-count">
          {cart.length} {cart.length === 1 ? "producto" : "productos"}
        </span>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Tu carrito está vacío actualmente.</p>
        </div>
      ) : step === 1 ? (
        <div className="cart-container">
          <div className="cart-items-list">
            {cart.map((item) => (
              <CartItemCard
                key={item.lineId ?? item.id}
                item={item}
                updateCart={updateCart}
                removeFromCart={removeFromCart}
              />
            ))}
          </div>
          <div className="cart-summary">
            <h3>Resumen</h3>
            <div className="summary-row">
              <span>Total:</span>
              <span className="summary-total">${total.toLocaleString()}</span>
            </div>
            <button type="button" className="btn-checkout" onClick={() => setStep(2)}>
              Continuar a envío y pago
            </button>
          </div>
        </div>
      ) : (
        <div className="cart-checkout-step">
          <button
            type="button"
            className="cart-back-step"
            onClick={() => {
              setStep(1);
              setPaymentMethod(null);
              setCarrierMethod(null);
            }}
          >
            <FaArrowLeft /> Volver al carrito
          </button>

          <div className="checkout-options">
            <section className="checkout-section">
              <h3>Datos de envío</h3>
              <p className="checkout-hint">Usamos la dirección de tu perfil. Podés modificarla y guardarla.</p>
              <AddressForm data={form} onChange={updateForm} showName={true} />
              {user && user.id && (
                <button type="button" className="btn-save-profile" onClick={saveProfile} disabled={loading}>
                  {loading ? "Guardando…" : "Guardar en mi perfil"}
                </button>
              )}
              {user && profileSaved && (
                <p className="profile-saved-ok" role="alert">
                  Se guardaron tus datos correctamente.
                </p>
              )}

              <label className="checkout-checkbox">
                <input type="checkbox" checked={shipToOther} onChange={(e) => setShipToOther(e.target.checked)} />
                <span>Enviar a otra dirección</span>
              </label>
              {shipToOther && (
                <div className="shipping-other-box">
                  <h4>Dirección de envío</h4>
                  <AddressForm data={shippingForm} onChange={updateShippingForm} showName={false} />
                </div>
              )}
            </section>

            <section className="checkout-section">
              <h3>Forma de envío</h3>
              <p className="checkout-hint">Elegí el correo o mensajería. Los precios se muestran según tu dirección.</p>
              <div className="checkout-radios">
                <label className="checkout-radio">
                  <input
                    type="radio"
                    name="carrier"
                    checked={carrierMethod === "andreani"}
                    onChange={() => setCarrierMethod("andreani")}
                  />
                  <span className="checkout-radio-label">
                    <FaTruck /> Andreani
                    <span className="checkout-price">
                      {shippingLoading ? "…" : shippingPrices.andreani != null ? `$${shippingPrices.andreani.toLocaleString()}` : ""}
                    </span>
                  </span>
                </label>
                <label className="checkout-radio">
                  <input
                    type="radio"
                    name="carrier"
                    checked={carrierMethod === "correo"}
                    onChange={() => setCarrierMethod("correo")}
                  />
                  <span className="checkout-radio-label">
                    <FaTruck /> Correo Argentino
                    <span className="checkout-price">
                      {shippingLoading ? "…" : shippingPrices.correo != null ? `$${shippingPrices.correo.toLocaleString()}` : ""}
                    </span>
                  </span>
                </label>
                <label className="checkout-radio">
                  <input
                    type="radio"
                    name="carrier"
                    checked={carrierMethod === "moto"}
                    onChange={() => setCarrierMethod("moto")}
                  />
                  <span className="checkout-radio-label">
                    <FaTruck /> Moto mensajería
                    <span className="checkout-price">
                      {shippingLoading ? "…" : shippingPrices.moto != null ? `$${shippingPrices.moto.toLocaleString()}` : ""}
                    </span>
                  </span>
                </label>
              </div>
            </section>

            <section className="checkout-section">
              <h3>Forma de pago</h3>
              <div className="checkout-radios">
                <label className="checkout-radio">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "transfer"}
                    onChange={() => setPaymentMethod("transfer")}
                  />
                  <span className="checkout-radio-label">
                    <FaMoneyBillWave /> Transferencia bancaria <span className="checkout-badge">10% OFF</span>
                  </span>
                </label>
                <label className="checkout-radio">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "mercadopago"}
                    onChange={() => setPaymentMethod("mercadopago")}
                  />
                  <span className="checkout-radio-label">
                    <FaCreditCard /> Mercado Pago
                  </span>
                </label>
              </div>
            </section>

            {paymentMethod && (
              <div className="checkout-totals">
                {selectedShippingPrice > 0 && (
                  <>
                    <div className="summary-row">
                      <span>Subtotal productos:</span>
                      <span>${total.toLocaleString()}</span>
                    </div>
                    <div className="summary-row">
                      <span>Envío:</span>
                      <span>${selectedShippingPrice.toLocaleString()}</span>
                    </div>
                  </>
                )}
                <div className="summary-row">
                  <span>{paymentMethod === "transfer" ? "Total (10% desc.):" : "Total:"}</span>
                  <span className="summary-total">${Math.round(totalWithDiscount).toLocaleString()}</span>
                </div>
              </div>
            )}

            {paymentMethod === "transfer" && (
              <div className="transfer-box">
                <h4>Datos para la transferencia</h4>
                <p className="transfer-note">Realizá la transferencia por el monto indicado y enviá el comprobante por WhatsApp.</p>
                {transferInfo && (
                  <>
                    <div className="transfer-datos">
                      <div className="transfer-row">
                        <span className="transfer-label">CVU / CBU:</span>
                        <span className="transfer-value">{transferInfo.cvu || "—"}</span>
                        <button
                          type="button"
                          className="transfer-copy"
                          onClick={() => transferInfo.cvu && navigator.clipboard.writeText(transferInfo.cvu)}
                        >
                          Copiar
                        </button>
                      </div>
                      {transferInfo.alias && (
                        <div className="transfer-row">
                          <span className="transfer-label">Alias:</span>
                          <span className="transfer-value">{transferInfo.alias}</span>
                          <button type="button" className="transfer-copy" onClick={() => navigator.clipboard.writeText(transferInfo.alias)}>
                            Copiar
                          </button>
                        </div>
                      )}
                      <div className="transfer-row">
                        <span className="transfer-label">Titular:</span>
                        <span className="transfer-value">{transferInfo.titular || "—"}</span>
                      </div>
                      <div className="transfer-row">
                        <span className="transfer-label">Banco:</span>
                        <span className="transfer-value">{transferInfo.banco || "—"}</span>
                      </div>
                    </div>
                    <div className="transfer-total">
                      <span>Total a transferir (10% desc.):</span>
                      <strong>${Math.round(totalWithDiscount).toLocaleString()}</strong>
                    </div>
                    {transferInfo.whatsappLink ? (
                      <a href={transferInfo.whatsappLink} target="_blank" rel="noopener noreferrer" className="transfer-whatsapp-link">
                        Enviar comprobante por WhatsApp
                      </a>
                    ) : (
                      <p className="transfer-no-whatsapp">Configurá WHATSAPP_LINK en el servidor.</p>
                    )}
                  </>
                )}
                {!transferInfo && <p className="transfer-loading">Cargando datos…</p>}
                <button
                  type="button"
                  className="btn-checkout btn-checkout--transfer"
                  onClick={async () => {
                    const totalToSave = Math.round(totalWithDiscount);
                    if (user && user.id && totalToSave > 0) {
                      try {
                        await fetch(`${API_ORDERS}`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ userId: user.id, total: totalToSave }),
                        });
                      } catch (e) {
                        console.error("Error al registrar la compra:", e);
                      }
                    }
                    try {
                      sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
                    } catch (e) {}
                    setStep(1);
                    if (clearCart) clearCart();
                    navigate("/perfil", { replace: true });
                  }}
                >
                  Finalizar compra
                </button>
              </div>
            )}

            {paymentMethod === "mercadopago" && (
              <div className="checkout-mp-box">
                <p className="checkout-mp-total">
                  Total: <strong>${Math.round(totalWithDiscount).toLocaleString()}</strong>
                </p>
                <button
                  type="button"
                  className="btn-checkout btn-checkout--mp"
                  onClick={handleCheckoutMercadoPago}
                  disabled={loading}
                >
                  {loading ? "Cargando…" : "Pagar con Mercado Pago"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrito;
