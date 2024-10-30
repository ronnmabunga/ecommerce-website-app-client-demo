//  Library Utilities
import { useState, useEffect, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";
//  User-Defined Utilities
import SessionContext from "../context/SessionContext";
//  User-Defined UI Components
import OrderCard from "../components/orders/OrderCard";
import BeanGrowSpinner from "../components/BeanGrowSpinner";
/*
    Orders Page renders differently based on the logged-in user's Admin status:
        - An admin user will be shown the Order History for all users.
        - A non-admin user will be shown only their own Order History.
        - Non-logged in users will be redirected to the Home Page.
        - Each order entry will include all the items they ordered: this includes the price, quantity and subtotal for each item; as well as the total price of all the items in the order, and the date of the order was checked out.
        - It will display a loading spinner when the loading state is true.
*/
export default function Orders() {
    const { user, loading, productsData, orderHistory } = useContext(SessionContext);
    const [orderDisplay, setOrderDisplay] = useState("No Orders Found!");
    const navigate = useNavigate();
    //  When the user is not logged in they are redirected back to the Home page.
    useEffect(() => {
        if (!loading && !user.id) {
            navigate("/products");
        }
    }, [user]);
    useEffect(() => {
        setOrderDisplay(orderHistory.map((order) => <OrderCard isAdmin={user.isAdmin} order={order} key={order._id} productsData={productsData} />));
    }, [user, orderHistory, productsData]);
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <BeanGrowSpinner>
                    <span className="visually-hidden">Loading...</span>
                </BeanGrowSpinner>
            </div>
        );
    }
    return (
        <Container className="primary-section p-5 min-vh-100">
            {user.isAdmin ? <h1 className="text-center my-4">Order History</h1> : <h1 className="text-center my-4">My Orders</h1>}
            {orderDisplay.length > 0 ? <div className="masonry-grid">{orderDisplay}</div> : <div className="text-center">No Orders Found!</div>}
        </Container>
    );
}
