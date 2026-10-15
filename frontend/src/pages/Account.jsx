import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { api } from "../api";

export default function Account() {
    const { user, login, register, logout, showToast } = useApp();
    const [mode, setMode] = useState("login"); // "login" | "register"
    const [orders, setOrders] = useState([]);

    useEffect(() => {//run when the user value changes
        if (user) {
            api.getMyOrders(user.email)//requests their orders
                .then(setOrders)//save the response in react state
                .catch(() => setOrders([]));
        } else {
            setOrders([]);
        }
    }, [user]);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            logout();
            showToast("You have been logged out");
        }
    };

    if (user) {
        return (
            <>
                <div className="section-head">
                    <h2>
                        Hello, {user.username}
                        {user.role === "admin" && (
                            <span className="tag" style={{ marginLeft: 10 }}>
                                Admin
                            </span>
                        )}
                    </h2>
                    <button className="btn ghost small" onClick={handleLogout}>
                        Log out
                    </button>
                </div>
                <p style={{ color: "var(--muted)" }}>{user.email}</p>

                <div className="section-head" style={{ marginTop: 30 }}>
                    <h3 style={{ margin: 0 }}>Order History</h3>
                </div>
                {orders.length === 0 ? (
                    <div className="empty">
                        No orders yet. <Link to="/catalog">Browse the catalog</Link>
                    </div>
                ) : (
                    orders.map((o) => (
                        <div key={o.id} className="booking-item">
                            <div className="row">
                                <b>Order #{o.id.slice(-8).toUpperCase()}</b>
                                <span className="tag" style={{ margin: 0, color: o.status === "paid" ? "var(--good)" : "var(--muted)" }}>
                                    {o.status}
                                </span>
                            </div>
                            <div style={{ color: "var(--muted)", marginTop: 4 }}>{o.items.map((i) => i.name).join(", ")}</div>
                            <div style={{ marginTop: 4 }}>{o.total.toLocaleString("en-US")} €</div>
                        </div>
                    ))
                )}
            </>
        );
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(e.target.email.value.trim(), e.target.password.value);
        } catch (err) {
            showToast(err.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register(e.target.username.value.trim(), e.target.email.value.trim(), e.target.password.value);
        } catch (err) {
            showToast(err.message);
        }
    };

    return (
        <div className="auth-box">
            {mode === "login" ? (
                <>
                    <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 20 }}>Log in</h2>
                    <form onSubmit={handleLogin}>
                        <div className="field">
                            <label>Email</label>
                            <input name="email" type="email" required />
                        </div>
                        <div className="field">
                            <label>Password</label>
                            <input name="password" type="password" required minLength={6} />
                        </div>
                        <button className="btn" style={{ width: "100%", justifyContent: "center" }}>
                            Log in
                        </button>
                    </form>
                    <p style={{ textAlign: "center", marginTop: 18, marginBottom: 0, fontSize: 13.5, color: "var(--muted)" }}>
                        Don't have an account?{" "}
                        <a onClick={() => setMode("register")} style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }}>
                            Create one
                        </a>
                    </p>
                </>
            ) : (
                <>
                    <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 20 }}>Create account</h2>
                    <form onSubmit={handleRegister}>
                        <div className="field">
                            <label>Username</label>
                            <input name="username" required />
                        </div>
                        <div className="field">
                            <label>Email</label>
                            <input name="email" type="email" required />
                        </div>
                        <div className="field">
                            <label>Password</label>
                            <input name="password" type="password" required minLength={6} />
                        </div>
                        <button className="btn" style={{ width: "100%", justifyContent: "center" }}>
                            Create my account
                        </button>
                    </form>
                    <p style={{ textAlign: "center", marginTop: 18, marginBottom: 0, fontSize: 13.5, color: "var(--muted)" }}>
                        Already have an account?{" "}
                        <a onClick={() => setMode("login")} style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }}>
                            Log in
                        </a>
                    </p>
                </>
            )}
        </div>
    );
}
