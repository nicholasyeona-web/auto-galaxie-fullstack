import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import CarSVG from "./CarSVG";

// Shows the car's photo. If there is no photo, or the URL is broken,
// it falls back to the drawn car so the layout never breaks.
export function CarPhoto({ car, className, style }) {
    const [failedSrc, setFailedSrc] = useState(null);

    if (!car.image || failedSrc === car.image) return <CarSVG color={car.color} />;

    return <img src={car.image} alt={car.name} className={className} style={style} loading="lazy" onError={() => setFailedSrc(car.image)} />;
}

export default function CarCard({ car }) {
    const { favorites, toggleFavorite } = useApp();//get shared data from AppContext.jsx
    const isFav = favorites.includes(car.id);//checks whether the current car is already saved

    return (
        <div className="card">
            <Link to={`/car/${car.id}`} className="thumb" style={{ background: `linear-gradient(160deg, ${car.color}22, transparent)` }}>
                <CarPhoto car={car} className="thumb-img" />
            </Link>
            <button
                className={`fav-btn ${isFav ? "active" : ""}`}
                onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(car.id);
                }}
                //-> AppContext.jsx
            >
                {isFav ? "♥" : "♡"}
            </button>
            <div className="card-body">
                <h3>
                    <Link to={`/car/${car.id}`}>{car.name}</Link>
                </h3>
                <div className="meta">
                    {car.year} · {car.km.toLocaleString("en-US")} km · {car.fuel}
                </div>
                <div className="row">
                    <span className="price">{car.price.toLocaleString("en-US")} €</span>
                    <Link to={`/car/${car.id}`} className="btn ghost small">
                        View
                    </Link>
                </div>
            </div>
        </div>
    );
}
