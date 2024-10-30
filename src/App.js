// Library Utilities
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// User-Defined Utilities
import { SessionProvider } from "./context/SessionContext";
// Library UI Components
import { Container } from "react-bootstrap";
// User-Defined UI Components
import "./App.css";
import AppNavbar from "./components/AppNavbar";
import Footer from "./components/Footer";
// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Logout from "./pages/Logout";
import Products from "./pages/Products";
import NewProduct from "./pages/NewProduct";
import ViewProduct from "./pages/ViewProduct";
import Error from "./pages/Error";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import ViewOrder from "./pages/ViewOrder";
import Users from "./pages/Users";
/*  
    The App component is the primary component of the application.
*/
function App() {
    // State variables and methods shared throughout the application through the SessionContext
    //  This caches the data regarding the user.
    const [user, setUser] = useState({
        id: null,
        firstName: null,
        lastName: null,
        email: null,
        mobileNo: null,
        imageLink: null,
        isAdmin: null,
    });
    //  This caches the cart data of the user, it remains null unless the user is a logged-in and is a non-admin.
    const [cart, setCart] = useState({
        id: null,
        cartItems: null,
        totalPrice: null,
        orderedOn: null,
    });
    //  This caches the products data available for the user, it may vary depending on what type of user it is.
    const [productsData, setProductsData] = useState([]);
    //  This caches the products data available for the user, it may vary depending on what type of user it is.
    const [orderHistory, setOrderHistory] = useState([]);
    //  The loading state are passed onto the context and the loading display will be handled per page instead.
    const [loading, setLoading] = useState(true);
    //  The disableButton state are passed onto the context and the will be used to determine when buttons will be simultaneously disabled.
    const [disableButtons, setDisableButtons] = useState(false);
    //  This function clears the session token being used by the application.
    function unsetUser() {
        localStorage.clear();
    }
    //  These partial loaded state ensure that all fetch requests per user type are completed.
    const [userLoading, setUserLoading] = useState(true);
    const [cartLoading, setCartLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(true);
    //  Side effect that runs only once. This ensures that a logged-in user's information is fetched when the app loads the first time from whichever page it is first accessed from.
    useEffect(() => {
        async function getUserDetails() {
            setUserLoading(true);
            await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.user) {
                        setUser({
                            id: data.user._id,
                            firstName: data.user.firstName,
                            lastName: data.user.lastName,
                            email: data.user.email,
                            mobileNo: data.user.mobileNo,
                            imageLink: data.user.imageLink,
                            isAdmin: data.user.isAdmin,
                        });
                    }
                    setUserLoading(false);
                })
                .catch((error) => {
                    setUserLoading(false);
                });
        }
        getUserDetails();
    }, []);
    async function getActiveProducts() {
        setProductsLoading(true);
        await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setProductsData(data);
                setProductsLoading(false);
            })
            .catch((error) => {
                setProductsLoading(false);
            });
    }
    async function getAllProducts() {
        setProductsLoading(true);
        await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/all`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setProductsData(data);
                setProductsLoading(false);
            })
            .catch((error) => {
                setProductsLoading(false);
            });
    }
    async function refreshProductsData() {
        if (user.id !== null && user.isAdmin === true) {
            await getAllProducts();
        } else {
            await getActiveProducts();
        }
    }
    //  This side effect then reacts to any changes to `user`, which fetches products data differently based on login and admin statuses, as well as the cart data if the user is logged-in and non-admin.
    useEffect(() => {
        async function getUserCart() {
            setCartLoading(true);
            await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/get-cart`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.hasOwnProperty("cart")) {
                        setCart({
                            id: data.cart.userId,
                            cartItems: data.cart.cartItems,
                            totalPrice: data.cart.totalPrice,
                            orderedOn: data.cart.orderedOn,
                        });
                    }
                    setCartLoading(false);
                })
                .catch((error) => {
                    setCartLoading(false);
                });
        }
        async function getAllOrders() {
            setOrdersLoading(true);
            await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/all-orders`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    setOrderHistory(data.orders);
                    setOrdersLoading(false);
                })
                .catch((error) => {
                    setOrdersLoading(false);
                });
        }
        async function getMyOrders() {
            setOrdersLoading(true);
            await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/my-orders`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    setOrderHistory(data.orders);
                    setOrdersLoading(false);
                })
                .catch((error) => {
                    setOrdersLoading(false);
                });
        }
        if (!userLoading) {
            if (!user.id !== null && user.isAdmin === false) {
                getUserCart();
                getActiveProducts();
                getMyOrders();
            } else if (user.id !== null && user.isAdmin === true) {
                getAllProducts();
                getAllOrders();
                setCartLoading(false);
            } else if (user.id === null) {
                getActiveProducts();
                setCartLoading(false);
                setOrdersLoading(false);
            }
        }
    }, [user, userLoading]);
    useEffect(() => {
        setLoading(userLoading || cartLoading || productsLoading || ordersLoading);
    }, [userLoading, cartLoading, productsLoading, ordersLoading]);
    // SessionProvider provides access from the state variables from App.js to the inner components of the App
    // The AppNavbar is used as the primary component for navigation.
    /*
        Routes are defined per page used with their designated path passed as a prop.
            - The Route component with the `/products` path is defined as a parent component for separate pages; `/products/`, `/products/new`, and `/products/:productId`.
            - The Route component with the `/orders` path is defined as a parent component for separate pages; `/orders/`, and `/orders/:orderId`.
    */
    return (
        <SessionProvider value={{ user, setUser, unsetUser, productsData, setProductsData, refreshProductsData, cart, setCart, loading, setLoading, disableButtons, setDisableButtons, orderHistory, setOrderHistory }}>
            <Router>
                <AppNavbar />
                <video src={`${process.env.PUBLIC_URL}/videos/videoBg.mp4`} autoPlay loop muted preload="auto" style={{ width: "100%" }} />
                <Container>
                    <Routes>
                        <Route index element={<Home />} />
                        <Route path="register" element={<Register />} />
                        <Route path="login" element={<Login />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="logout" element={<Logout />} />
                        <Route path="products">
                            <Route index element={<Products />} />
                            <Route path="new" element={<NewProduct />} />
                            <Route path=":productId" element={<ViewProduct />} />
                        </Route>
                        <Route path="cart" element={<Cart />} />
                        <Route path="orders">
                            <Route index element={<Orders />} end />
                            <Route path=":orderId" element={<ViewOrder />} />
                        </Route>
                        <Route path="users" element={<Users />} />
                        <Route path="*" element={<Error />} />
                    </Routes>
                </Container>
                <Footer />
            </Router>
        </SessionProvider>
    );
}

export default App;
