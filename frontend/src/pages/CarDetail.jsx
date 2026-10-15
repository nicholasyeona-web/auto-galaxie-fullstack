import { useParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import CarCard, { CarPhoto } from "../components/CarCard";

export default function CarDetail() {
    const { id } = useParams();
    const { findCar, cars, favorites, cart, toggleFavorite, addToCart } = useApp();
    const car = findCar(id);

    if (!car)
        return (
            <div className="empty">
                Vehicle not found. <Link to="/catalog">Back to catalog</Link>
            </div>
        );

    const isFav = favorites.includes(car.id);
    const inCart = cart.includes(car.id);
    const related = cars.filter((r) => r.type === car.type && r.id !== car.id).slice(0, 4);

    return (
        <>
            <div className="crumb">
                <Link to="/catalog">Catalog</Link> / {car.name}
            </div>
            <div className="detail-hero">
                <div className="detail-photo" style={{ background: `linear-gradient(160deg, ${car.color}22, transparent)` }}>
                    <CarPhoto car={car} />
                </div>
                <div style={{ flex: 1, minWidth: 220 }}>
                    <h1 style={{ margin: "0 0 8px" }}>{car.name}</h1>
                    <div style={{ color: "var(--muted)", marginBottom: 12 }}>{car.desc}</div>
                    <div className="price" style={{ fontSize: 28, marginBottom: 16 }}>
                        {car.price.toLocaleString("en-US")} €
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button className="btn" disabled={inCart} onClick={() => addToCart(car.id)}>
                            {inCart ? "In cart ✓" : "Add to cart"}
                        </button>
                        <button className="btn ghost" onClick={() => toggleFavorite(car.id)}>
                            {isFav ? "♥ Favorite" : "♡ Add to favorites"}
                        </button>
                    </div>
                    <div className="spec-grid">
                        <div className="spec">
                            <div className="k">Year</div>
                            <div className="v">{car.year}</div>
                        </div>
                        <div className="spec">
                            <div className="k">Mileage</div>
                            <div className="v">{car.km.toLocaleString("en-US")} km</div>
                        </div>
                        <div className="spec">
                            <div className="k">Fuel Type</div>
                            <div className="v">{car.fuel}</div>
                        </div>
                        <div className="spec">
                            <div className="k">Horsepower</div>
                            <div className="v">{car.hp} hp</div>
                        </div>
                        <div className="spec">
                            <div className="k">Seats</div>
                            <div className="v">{car.seats}</div>
                        </div>
                        <div className="spec">
                            <div className="k">Type</div>
                            <div className="v">{car.type}</div>
                        </div>
                    </div>
                </div>
            </div>
            {related.length > 0 && (
                <>
                    <div className="section-head">
                        <h2>Similar vehicles</h2>
                    </div>
                    <div className="grid">
                        {related.map((c) => (
                            <CarCard key={c.id} car={c} />
                        ))}
                    </div>
                </>
            )}
        </>
    );
}
