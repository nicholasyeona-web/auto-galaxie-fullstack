// Thin wrapper around fetch for talking to the Express backend.
const BASE = "http://localhost:4000/api";

async function request(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, {
        ...options,
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.error || "Server error");
    }

    return data;
}

export const api = {
    getCars: () => request("/cars"),
    //request the information from the database
    //-> AppContext.jsx
    getCar: (id) => request(`/cars/${id}`),

    createCar: (car, owner) =>
        request("/cars", {//api send a request to api/cars
            method: "POST",
            headers: { "x-user-email": owner },
            body: JSON.stringify(car),
        }),

    updateCar: (id, car, owner) =>
        request(`/cars/${id}`, {
            method: "PUT",
            headers: { "x-user-email": owner },
            body: JSON.stringify(car),
        }),

    deleteCar: (id, owner) =>
        request(`/cars/${id}`, {
            method: "DELETE",
            headers: { "x-user-email": owner },
        }),

    register: (username, email, password) =>
        request("/auth/register", {
            method: "POST",
            body: JSON.stringify({ username, email, password }),
        }),

    login: (email, password) =>
        request("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }),

    getFavorites: (owner) => request(`/favorites/${owner}`),
    //sends a GET requesr to the backend
    //-> favorites.js

    toggleFavorite: (owner, carId) =>
        request(`/favorites/${owner}`, {
            method: "POST",
            body: JSON.stringify({ carId }),
            //-> favorites.js
        }),

    getCart: (owner) => request(`/cart/${owner}`),

    addToCart: (owner, carId) =>
        request(`/cart/${owner}`, {
            method: "POST",
            body: JSON.stringify({ carId }),
        }),

    removeFromCart: (owner, carId) =>
        request(`/cart/${owner}/${carId}`, {
            method: "DELETE",
        }),

        
    placeOrder: (owner) =>
        request("/checkout/place-order", {
            method: "POST",
            body: JSON.stringify({ owner }),
        }),

    getMyOrders: (owner) => request(`/orders/mine/${owner}`),

    getAllOrders: (owner) =>//for order history in admin dashboard
        request("/orders", {
            headers: { "x-user-email": owner },
            //-> orders.js
        }),

    getUsers: (owner) =>
        //API sends a GET request to /api/users with the x-user-email header
        request("/users", {
            headers: { "x-user-email": owner },
        }),

    deleteUser: (id, owner) =>
        request(`/users/${id}`, {
            method: "DELETE",
            headers: { "x-user-email": owner },
        }),
};
