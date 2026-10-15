import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import CarCard from "../components/CarCard";
//reads the cars and tracks search,filter and sort selections

export default function Catalogue() {
    const { cars } = useApp();
    const [q, setQ] = useState("");
    const [type, setType] = useState("");
    const [fuel, setFuel] = useState("");
    const [sort, setSort] = useState("pop");

    const types = useMemo(() => [...new Set(cars.map((c) => c.type))], [cars]);
    //when user changes their search,types,fuel or sort 
    //useMemo will recalculates and target for the new information
    const fuels = useMemo(() => [...new Set(cars.map((c) => c.fuel))], [cars]);
    //and Catalogue.jsx will display the matching cars
    const filtered = useMemo(() => {
        let list = cars.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) && (!type || c.type === type) && (!fuel || c.fuel === fuel));
        if (sort === "asc") list = [...list].sort((a, b) => a.price - b.price);//low to high
        if (sort === "desc") list = [...list].sort((a, b) => b.price - a.price);//high to low
        return list;
    }, [cars, q, type, fuel, sort]);

    return (
        <>
            <div className="section-head">
                <h2>Catalog</h2>
            </div>
            <div className="filters">
                <input placeholder="Search for a model..." value={q} onChange={(e) => setQ(e.target.value)} />
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">All types</option>
                    {types.map((t) => (
                        <option key={t}>{t}</option>
                    ))}
                </select>
                <select value={fuel} onChange={(e) => setFuel(e.target.value)}>
                    <option value="">All fuel types</option>
                    {fuels.map((f) => (
                        <option key={f}>{f}</option>
                    ))}
                </select>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="pop">Popular</option>
                    <option value="asc">Price: low to high</option>
                    <option value="desc">Price: high to low</option>
                </select>
            </div>
            {filtered.length === 0 ? (
                <div className="empty">No vehicles match these criteria.</div>
            ) : (
                <div className="grid">
                    {filtered.map((c) => (
                        //display the matching cars using -> CarCard.jsx
                        <CarCard key={c.id} car={c} />
                    ))}
                </div>
            )}
        </>
    );
}
