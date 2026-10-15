import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import CarCard from "../components/CarCard";

export default function Home() {
    const { cars } = useApp();
    const featured = cars[4]; // Audi R8 V10 Performance, once loaded

    return (
        <>
            {featured && (
                <section
                    className="hero"
                    style={
                        featured.image
                            ? {
                                  backgroundImage: `linear-gradient(90deg, rgba(18,19,22,.96) 0%, rgba(18,19,22,.85) 35%, rgba(18,19,22,.35) 65%, rgba(18,19,22,.05) 100%), url(${featured.image})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                              }
                            : undefined
                    }
                >
                    <div className="hero-tag">FEATURED VEHICLE</div>
                    <h1>{featured.name}</h1>
                    <p>{featured.desc}</p>
                    <div className="price" style={{ fontSize: 26, marginBottom: 20 }}>
                        {featured.price.toLocaleString("en-US")} €
                    </div>
                    <Link className="btn" to={`/car/${featured.id}`}>
                        View vehicle
                    </Link>
                    {!featured.image && (
                        <svg className="car-art" viewBox="0 0 400 180">
                            <ellipse cx="200" cy="150" rx="180" ry="14" fill="#000" opacity=".35" />
                            <path d="M40 120 L60 90 Q90 60 140 58 L260 58 Q310 60 340 95 L360 120 L360 130 L40 130 Z" fill="#3a3d45" />
                            <path d="M120 90 L150 65 L245 65 L280 90 Z" fill="#1b1d22" />
                            <rect x="30" y="110" width="340" height="20" rx="8" fill="#e0472c" />
                            <circle cx="105" cy="132" r="26" fill="#101114" stroke="#7a7d84" strokeWidth="4" />
                            <circle cx="295" cy="132" r="26" fill="#101114" stroke="#7a7d84" strokeWidth="4" />
                        </svg>
                    )}
                </section>
            )}
            <div className="section-head">
                <h2>Trending</h2>
                <Link className="btn ghost small" to="/catalog">
                    View all
                </Link>
            </div>
            <div className="grid">
                {cars.slice(0, 4).map((c) => (//shows the page only 4 cars at the home page
                    <CarCard key={c.id} car={c} />
                ))}
            </div>
        </>
    );
}
