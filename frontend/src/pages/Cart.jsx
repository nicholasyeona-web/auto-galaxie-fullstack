import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { CarPhoto } from "../components/CarCard";

const euro = (n) => `${n.toLocaleString("en-US")} €`;

export default function Cart() {
    const { cart, findCar, removeFromCart, placeOrder, showToast } = useApp();
    const navigate = useNavigate();
    const [placing, setPlacing] = useState(false);

    const items = cart.map(findCar).filter(Boolean);//find each car's full object
    //and .filter(Boolean) will removes the missing results, such as cars that can no longer be found
    const total = items.reduce((sum, c) => sum + c.price, 0);

    const handlePlaceOrder = async () => {//user clicks place order
        setPlacing(true);//updates the loading state and the button becomes display
        try {
            await placeOrder();//calls the order function from appcontext.jsx
            showToast("Order placed!");
            navigate("/account");//if request succeeds it'll displays... 
        } catch (err) {
            showToast(err.message);
        } finally {
            setPlacing(false);
        }
    };

    if (items.length === 0) {
        return (
            <>
                <div className="section-head">
                    <h2>Order Form</h2>
                </div>
                <div className="empty">
                    Your cart is empty. <Link to="/catalog">Browse the catalog</Link>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="section-head">
                <h2>Order Form</h2>
            </div>
            <div className="two-col">
                <div>
                    {items.map((c) => (
                        <div key={c.id} className="card" style={{ flexDirection: "row", flexWrap: "wrap", gap: 16, padding: 16, marginBottom: 14 }}>
                            <div style={{ width: 150, flex: "none" }}>
                                <CarPhoto car={c} style={{ width: "100%", borderRadius: 10 }} />
                            </div>
                            <div style={{ flex: 1, minWidth: 220 }}>
                                <div className="row" style={{ alignItems: "flex-start" }}>
                                    <div style={{ minWidth: 0 }}>
                                        <Link to={`/car/${c.id}`} style={{ fontWeight: 600, fontSize: 16, overflowWrap: "anywhere" }}>
                                            {c.name}
                                        </Link>
                                        <div className="price" style={{ fontSize: 22, marginTop: 4 }}>
                                            {euro(c.price)}
                                        </div>
                                    </div>
                                    <button className="btn ghost small" onClick={() => removeFromCart(c.id)}>
                                        Remove
                                    </button>
                                </div>
                                <div className="spec-grid" style={{ marginTop: 14 }}>
                                    <div className="spec">
                                        <div className="k">Year</div>
                                        <div className="v">{c.year}</div>
                                    </div>
                                    <div className="spec">
                                        <div className="k">Mileage</div>
                                        <div className="v">{c.km.toLocaleString("en-US")} km</div>
                                    </div>
                                    <div className="spec">
                                        <div className="k">Fuel Type</div>
                                        <div className="v">{c.fuel}</div>
                                    </div>
                                    <div className="spec">
                                        <div className="k">Horsepower</div>
                                        <div className="v">{c.hp} hp</div>
                                    </div>
                                    <div className="spec">
                                        <div className="k">Seats</div>
                                        <div className="v">{c.seats}</div>
                                    </div>
                                    <div className="spec">
                                        <div className="k">Type</div>
                                        <div className="v">{c.type}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="summary-box" style={{ alignSelf: "start" }}>
                    <h3 style={{ marginTop: 0 }}>Order summary</h3>
                    {items.map((c) => (
                        <div key={c.id} className="row" style={{ marginBottom: 10, fontSize: 13.5 }}>
                            <span style={{ color: "var(--muted)", minWidth: 0, overflowWrap: "anywhere" }}>{c.name}</span>
                            <span style={{ whiteSpace: "nowrap" }}>{euro(c.price)}</span>
                        </div>
                    ))}
                    <hr style={{ borderColor: "var(--line)", margin: "14px 0" }} />
                    <div style={{ color: "var(--muted)", fontSize: 12.5 }}>
                        Total ({items.length} {items.length === 1 ? "vehicle" : "vehicles"})
                    </div>
                    <div className="big" style={{ color: "var(--accent)" }}>
                        {euro(total)}
                    </div>
                    <button className="btn" style={{ width: "100%", justifyContent: "center", marginTop: 14 }} disabled={placing} onClick={handlePlaceOrder}>
                        {placing ? "Placing order…" : "Place order"}
                    </button>
                </div>
            </div>
        </>
    );
}
