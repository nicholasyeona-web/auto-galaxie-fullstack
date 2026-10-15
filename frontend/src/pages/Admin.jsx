import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { api } from "../api";

const MIN_YEAR = 1950;
const MAX_YEAR = new Date().getFullYear() + 1;

const emptyForm = {
    name: "",
    type: "",
    fuel: "Gasoline",
    year: new Date().getFullYear(),
    km: 0,
    price: "",
    hp: "",
    seats: 5,
    desc: "",
    image: "",
};

// Resolves true only if the browser can actually load the image.
const canLoadImage = (url) =>
    new Promise((resolve) => {
        const img = new Image();
        const timer = setTimeout(() => resolve(false), 8000);
        img.onload = () => {
            clearTimeout(timer);
            resolve(true);
        };
        img.onerror = () => {
            clearTimeout(timer);
            resolve(false);
        };
        img.src = url;
    });

// Returns a message describing the first problem, or null if the form is fine.
function validateForm(f) {
    const year = Number(f.year);
    const km = Number(f.km);
    const price = Number(f.price);
    const hp = Number(f.hp);
    const seats = Number(f.seats);

    if (!f.name.trim()) return "Please enter the vehicle name.";
    if (!f.type.trim()) return "Please enter the vehicle type.";
    if (!f.fuel.trim()) return "Please enter the fuel type.";
    if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) return `Year must be between ${MIN_YEAR} and ${MAX_YEAR}.`;
    if (!Number.isInteger(km) || km < 0 || km > 1000000) return "Mileage must be between 0 and 1,000,000 km.";
    if (!Number.isInteger(price) || price < 1 || price > 10000000) return "Price must be between 1 and 10,000,000 €.";
    if (!Number.isInteger(hp) || hp < 1 || hp > 3000) return "Horsepower must be between 1 and 3,000.";
    if (!Number.isInteger(seats) || seats < 1 || seats > 9) return "Seats must be between 1 and 9.";

    const image = f.image.trim();
    if (!image) return "A photo is required — please add a photo URL.";
    if (!/^(https?:\/\/|\/)/i.test(image)) return "The photo must be a web address (https://…) or a path starting with /.";
    return null;
}

export default function Admin() {
    const { cars, user, isAdmin, owner, addCar, editCar, removeCar, showToast } = useApp();
    const [tab, setTab] = useState("vehicles"); // "vehicles" | "sales" | "customers"
    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [orders, setOrders] = useState(null);
    const [users, setUsers] = useState(null);

    useEffect(() => {
        if (isAdmin && tab === "sales" && orders === null) {
            //only the admin dashboard requests the data
            api.getAllOrders(owner)
                //it fetches the orders when the sales tab is selected
                .then(setOrders)
                //then stores in orders
                .catch((err) => showToast(err.message));
            // display an error message if request fail
            //-> api.getAllOrders
        }
        if (isAdmin && tab === "customers" && users === null) {
            //when the customers tab is selected
            api.getUsers(owner) //<-calls
                //send a GET request to /api/users
                .then(setUsers)
                .catch((err) => showToast(err.message));
        }
    }, [isAdmin, tab, owner, orders, users, showToast]);

    if (!isAdmin) {
        return <div className="empty">You don't have access to this page.</div>;
    }

    const startEdit = (car) => {
        //when admin doing the edit
        setEditingId(car.id);
        setFormError("");
        setForm({
            name: car.name,
            type: car.type,
            fuel: car.fuel,
            year: car.year,
            km: car.km,
            price: car.price,
            hp: car.hp,
            seats: car.seats,
            desc: car.desc || "",
            image: car.image || "",
        });
        setTab("vehicles");
        //go to editCar
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const resetForm = () => {
        setEditingId(null);
        setForm(emptyForm);
        setFormError("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        if (formError) setFormError("");
    };

    // Whole-number fields can never be negative or decimal — block "-", "+", "e" and ".".
    const blockNonDigits = (e) => {
        if (["-", "+", "e", "E", ".", ","].includes(e.key)) e.preventDefault();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const problem = validateForm(form);
        if (problem) {
            setFormError(problem);
            return;
        }

        const image = form.image.trim();
        setSaving(true);
        setFormError("");

        // A photo only counts if it really loads, so broken links never get saved.
        const loads = await canLoadImage(image);
        if (!loads) {
            setFormError("That photo couldn't be loaded. Check the link opens an image, then try again.");
            setSaving(false);
            return;
        }

        const payload = {
            name: form.name.trim(),
            type: form.type.trim(),
            fuel: form.fuel.trim(),
            year: Number(form.year),
            km: Number(form.km),
            price: Number(form.price),
            hp: Number(form.hp),
            seats: Number(form.seats),
            desc: form.desc.trim(),
            image,
        };

        try {
            if (editingId) {
                //api.createCar
                //send a PUT request to /api/cars/:id
                //when editingId is empty
                await editCar(editingId, payload);
                //the form updates that existing vehicle
                showToast("Vehicle updated");
            } else {
                await addCar(payload);
                //the form creates a new vehicle
                showToast("Vehicle added");
            }
            resetForm();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (car) => {
        if (!window.confirm(`Delete ${car.name}? This can't be undone.`)) return;
        try {
            await removeCar(car.id);
            showToast("Vehicle deleted");
            if (editingId === car.id) resetForm();
        } catch (err) {
            showToast(err.message);
            //then calls the api
        }
    };

    const handleDeleteUser = async (customer) => {
        if (!window.confirm(`Delete the account for ${customer.username} (${customer.email})? This can't be undone.`)) return;
        try {
            await api.deleteUser(customer.id, owner);
            setUsers((prev) => prev.filter((u) => u.id !== customer.id));
            showToast("Account deleted");
        } catch (err) {
            showToast(err.message);
        }
    };

    const paidOrders = (orders || []).filter((o) => o.status === "paid");
    //filter() keeps paid orders
    const totalSales = paidOrders.reduce((sum, o) => sum + o.total, 0);
    //.reduce() adds their totals together

    return (
        <>
            <div className="section-head">
                <h2>Admin</h2>
                <div className="auth-tabs" style={{ maxWidth: 360 }}>
                    <button className={tab === "vehicles" ? "active" : ""} onClick={() => setTab("vehicles")}>
                        Vehicles
                    </button>
                    <button className={tab === "sales" ? "active" : ""} onClick={() => setTab("sales")}>
                        Sales
                    </button>
                    <button className={tab === "customers" ? "active" : ""} onClick={() => setTab("customers")}>
                        Customers
                    </button>
                </div>
            </div>

            {tab === "vehicles" && (
                <>
                    <form onSubmit={handleSubmit} className="summary-box" style={{ marginBottom: 30 }} noValidate>
                        {/* startEdit */}
                        <h3 style={{ marginTop: 0 }}>{editingId ? "Edit vehicle" : "Add a new vehicle"}</h3>
                        {/* //when the admin fills in the form */}
                        <div className="spec-grid">
                            {/* handleSubmit() checks the feilds using validateForm() */}
                            <div className="field">
                                <label>Name</label>
                                <input name="name" value={form.name} onChange={handleChange} maxLength={60} required />
                            </div>
                            <div className="field">
                                <label>Type</label>
                                <input name="type" value={form.type} onChange={handleChange} maxLength={30} required />
                            </div>
                            <div className="field">
                                <label>Fuel</label>
                                <input name="fuel" value={form.fuel} onChange={handleChange} maxLength={20} required />
                            </div>
                            <div className="field">
                                <label>
                                    Year ({MIN_YEAR}–{MAX_YEAR})
                                </label>
                                <input name="year" type="number" min={MIN_YEAR} max={MAX_YEAR} step="1" inputMode="numeric" value={form.year} onChange={handleChange} onKeyDown={blockNonDigits} required />
                            </div>
                            <div className="field">
                                <label>Mileage (km, max 1,000,000)</label>
                                <input name="km" type="number" min="0" max="1000000" step="1" inputMode="numeric" value={form.km} onChange={handleChange} onKeyDown={blockNonDigits} required />
                            </div>
                            <div className="field">
                                <label>Price (€, max 10,000,000)</label>
                                <input name="price" type="number" min="1" max="10000000" step="1" inputMode="numeric" value={form.price} onChange={handleChange} onKeyDown={blockNonDigits} required />
                            </div>
                            <div className="field">
                                <label>Horsepower (max 3,000)</label>
                                <input name="hp" type="number" min="1" max="3000" step="1" inputMode="numeric" value={form.hp} onChange={handleChange} onKeyDown={blockNonDigits} required />
                            </div>
                            <div className="field">
                                <label>Seats (1–9)</label>
                                <input name="seats" type="number" min="1" max="9" step="1" inputMode="numeric" value={form.seats} onChange={handleChange} onKeyDown={blockNonDigits} required />
                            </div>
                            <div className="field" style={{ gridColumn: "1 / -1" }}>
                                {/* check whether if image can actually load with the canLoadImage */}
                                <label>Photo URL (required)</label>
                                <input name="image" value={form.image} onChange={handleChange} placeholder="https://… or /cars/photo.jpg" required />
                            </div>
                        </div>
                        <div className="field">
                            <label>Description ({form.desc.length}/500)</label>
                            <textarea name="desc" rows={4} maxLength={500} value={form.desc} onChange={handleChange} />
                        </div>

                        {formError && (
                            <div role="alert" style={{ color: "var(--accent)", fontSize: 13, marginBottom: 12 }}>
                                {formError}
                            </div>
                        )}

                        <div style={{ display: "flex", gap: 10 }}>
                            {/* addCar(payload)  creates object containing the car data*/}
                            <button className="btn" type="submit" disabled={saving}>
                                {/* api.js */}
                                {saving ? "Checking photo…" : editingId ? "Save changes" : "Add vehicle"}
                            </button>
                            {editingId && (
                                <button className="btn ghost" type="button" onClick={resetForm}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="compare-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Price</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cars.map((c) => (
                                    <tr key={c.id}>
                                        <td>{c.name}</td>
                                        <td>{c.type}</td>
                                        <td>{c.price.toLocaleString("en-US")} €</td>
                                        <td>
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <button className="btn ghost small" onClick={() => startEdit(c)}>
                                                    {/* copies that car's details into the form */}
                                                    Edit
                                                </button>
                                                <button className="btn ghost small" onClick={() => handleDelete(c)}>
                                                    {/* window.confirm() will asks for confirmation */}
                                                    Delete
                                                    {/* removeCar */}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {cars.length === 0 && (
                                    <tr>
                                        <td colSpan={4} style={{ color: "var(--muted)" }}>
                                            No vehicles yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {tab === "sales" && (
                <>
                    <div className="spec-grid" style={{ marginBottom: 24 }}>
                        <div className="spec">
                            <div className="k">Paid orders</div>
                            <div className="v">{paidOrders.length}</div>
                        </div>
                        <div className="spec">
                            <div className="k">Total sales</div>
                            <div className="v">{totalSales.toLocaleString("en-US")} €</div>
                        </div>
                        <div className="spec">
                            <div className="k">All orders (incl. pending)</div>
                            <div className="v">{(orders || []).length}</div>
                        </div>
                    </div>
                    <div className="compare-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order</th>
                                    <th>Customer</th>
                                    <th>Vehicles</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(orders || []).map((o) => (
                                    <tr key={o.id}>
                                        <td>#{o.id.slice(-8).toUpperCase()}</td>
                                        <td>{o.owner}</td>
                                        <td>{o.items.map((i) => i.name).join(", ")}</td>
                                        <td>{o.total.toLocaleString("en-US")} €</td>
                                        <td style={{ color: o.status === "paid" ? "var(--good)" : "var(--muted)" }}>{o.status}</td>
                                    </tr>
                                ))}
                                {orders !== null && orders.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{ color: "var(--muted)" }}>
                                            No orders yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {tab === "customers" && (//-> api.getUsers
                <div className="compare-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {(users || []).map((c) => (
                                <tr key={c.id}>
                                    <td>{c.username}</td>
                                    <td>{c.email}</td>
                                    <td>
                                        <span className="tag" style={{ margin: 0, color: c.role === "admin" ? "var(--accent)" : "var(--muted)" }}>
                                            {c.role}
                                        </span>
                                    </td>
                                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button className="btn ghost small" onClick={() => handleDeleteUser(c)} disabled={c.email === user.email}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users !== null && users.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ color: "var(--muted)" }}>
                                        No customers yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}
