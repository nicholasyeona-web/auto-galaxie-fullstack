import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Toast from "./components/Toast";
import Home from "./pages/Home";
import Catalogue from "./pages/Catalogue";
import CarDetail from "./pages/CarDetail";
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import Admin from "./pages/Admin";

export default function App() {
    return (
        <>
            <Header />
            <main className="wrap">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalog" element={<Catalogue />} />
                    <Route path="/car/:id" element={<CarDetail />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<div className="empty">Page not found.</div>} />
                </Routes>
            </main>
            <footer className="wrap">© 2026 Auto Galaxie — all vehicles subject to prior inspection.</footer>
            <Toast />
        </>
    );
}
