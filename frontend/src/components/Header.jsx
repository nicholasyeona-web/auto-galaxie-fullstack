import { Link, NavLink, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Header() {
    const { favorites, cart, user, isAdmin } = useApp();
    const { pathname } = useLocation();

    // The Home / Catalog / Admin links only show on the home page.
    const isHome = pathname === "/";

    const linkClass = ({ isActive }) => (isActive ? "active" : "");

    return (
        <header>
            <div className="wrap topbar">
                {/* The logo always takes the user back to the home page */}
                <Link to="/" className="brand" aria-label="Auto Galaxie — go to home page">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M3 14L5 8.5C5.4 7.4 6.4 6.7 7.6 6.7H16.4C17.6 6.7 18.6 7.4 19 8.5L21 14" stroke="#e0472c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="2" y="14" width="20" height="5.5" rx="2" stroke="#e0472c" strokeWidth="2" />
                        <circle cx="7" cy="19.5" r="1.6" fill="#e0472c" />
                        <circle cx="17" cy="19.5" r="1.6" fill="#e0472c" />
                    </svg>
                    AUTO GALAXIE
                </Link>
                {isHome && (
                    <nav className="main">
                        <NavLink to="/" end className={linkClass}>
                            Home
                        </NavLink>
                        <NavLink to="/catalog" className={linkClass}>
                            Catalog
                        </NavLink>
                        {isAdmin && (
                            <NavLink to="/admin" className={linkClass}>
                                Admin
                            </NavLink>
                        )}
                    </nav>
                )}
                <div className="icons">
                    <NavLink to="/favorites">♡ {favorites.length > 0 && <span className="count">{favorites.length}</span>}</NavLink>
                    <NavLink to="/cart">🛒 {cart.length > 0 && <span className="count">{cart.length}</span>}</NavLink>
                    <NavLink to="/account">👤 {user ? user.username : ""}</NavLink>
                </div>
            </div>
        </header>
    );
}
