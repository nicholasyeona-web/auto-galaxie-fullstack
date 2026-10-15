import { useApp } from "../context/AppContext";
import CarCard from "../components/CarCard";

export default function Favorites() {
    const { favorites, findCar } = useApp();
    const items = favorites.map(findCar).filter(Boolean);
    //find each car's full object
    //and .filter(Boolean) will removes the missing results, such as cars that can no longer be found

    return (
        <>
            <div className="section-head">
                <h2>Favorites</h2>
            </div>
            {items.length === 0 ? (
                <div className="empty">No favorites yet. Click ♡ on a vehicle.</div>
            ) : (
                <div className="grid">
                    {items.map((c) => (//find the matches id and keeps the cars
                        <CarCard key={c.id} car={c} />
                    ))}
                </div>
            )}
        </>
    );
}
//-> AppContext.jsx