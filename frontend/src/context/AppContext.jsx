import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [cars, setCars] = useState([]);
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("ag_user")) || null;
        } catch {
            return null;
        }
    });
    const [favorites, setFavorites] = useState([]);
    const [cart, setCart] = useState([]);
    const [toastMsg, setToastMsg] = useState("");

    const owner = user ? user.email : "guest";
    const isAdmin = user?.role === "admin";

    const showToast = useCallback((msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(""), 1800);
    }, []);

    useEffect(() => {
        api.getCars()
        //get the informations from api 
            .then(setCars)
        //then stores the cars in react state
            .catch(() => showToast("Unable to reach the server"));
            //-> Catalogue.jsx
    }, []);

    useEffect(() => {
        api.getFavorites(owner)
            .then(setFavorites)
            .catch(() => {});
        api.getCart(owner)
            .then(setCart)
            .catch(() => {});
            // -> api.js 
    }, [owner]);

    useEffect(() => {
        if (user) localStorage.setItem("ag_user", JSON.stringify(user));
        else localStorage.removeItem("ag_user");
    }, [user]);

    const toggleFavorite = async (carId) => {//the cars that clicked
        const updated = await api.toggleFavorite(owner, carId);
        setFavorites(updated);
        //replaces the old favorites array with the updated array
        //-> api.js
    };

    const addToCart = async (carId) => {//
        if (cart.includes(carId)) {
            //checks whether that ID already exists in the cart array.
            showToast("Already in cart");
            return;
        }
        const updated = await api.addToCart(owner, carId);//send a request to the backend
        setCart(updated);
        showToast("Added to cart");
    };

    const removeFromCart = async (carId) => {//Removes a car from the cart
        const updated = await api.removeFromCart(owner, carId);
        setCart(updated);
    };

    const placeOrder = async () => {//call the backend to place the order
        const order = await api.placeOrder(owner);// wait for the backend return the created order
        setCart([]);//clear cart & return the order
        return order;
    };

    const login = async (email, password) => {
        const u = await api.login(email, password);
        setUser(u);
        return u;
    };

    const register = async (username, email, password) => {
        const u = await api.register(username, email, password);
        setUser(u);
        return u;
    };

    const logout = () => setUser(null);

    const findCar = (id) => cars.find((c) => String(c.id) === String(id));
    //find the full car object from its ID
    //-> Favorites.jsx

    const addCar = async (carData) => {
        const car = await api.createCar(carData, owner);
        setCars((prev) => [...prev, car]);
        return car;
        //then api.js send a POST request to /api/cars
    };

    const editCar = async (id, carData) => {//update and edit
        const car = await api.updateCar(id, carData, owner);
        //go throught all the cars , replace the one with the matching ID, and keep the others unchanged.
        setCars((prev) => prev.map((c) => (String(c.id) === String(id) ? car : c)));
        return car;
    };

    const removeCar = async (id) => {
        await api.deleteCar(id, owner);
        //filter keeps every car except the one whose ID matches the deleted car
        setCars((prev) => prev.filter((c) => String(c.id) !== String(id)));
    };

    const value = {
        cars,
        user,
        isAdmin,
        favorites,
        cart,
        toastMsg,
        owner,
        showToast,
        toggleFavorite,
        addToCart,
        removeFromCart,
        placeOrder,
        login,
        register,
        logout,
        findCar,
        addCar,
        editCar,
        removeCar,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    return useContext(AppContext);
}
