import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SessionContext from "../context/SessionContext";
import OrderCard from "../components/orders/OrderCard";
import BeanGrowSpinner from "../components/BeanGrowSpinner";
export default function ViewOrder() {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const { user, loading, setLoading } = useContext(SessionContext);
    const [orders, setOrders] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [orderDisplay, setOrderDisplay] = useState(<></>);
    useEffect(() => {
        if (!loading && !user.id) {
            navigate("/");
        }
    }, [user]);
    useEffect(() => {
        setLoading(true);
        let order = orders.find((item) => item._id === orderId);
        if (order) {
            setOrderDisplay(<OrderCard isAdmin={user.isAdmin} order={order} productsData={productsData} />);
        } else {
            setOrderDisplay("Order Not Found!");
        }
        setLoading(false);
    }, [user, orders, productsData, orderId]);
    useEffect(() => {
        if (user.id) {
            setLoading(true);
            let fetchUrl = user.isAdmin ? `${process.env.REACT_APP_API_BASE_URL}/orders/all-orders` : `${process.env.REACT_APP_API_BASE_URL}/orders/my-orders`;
            fetch(fetchUrl, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.hasOwnProperty("orders")) {
                        setOrders(data.orders);
                    }
                })
                .catch((error) => {});
            fetchUrl = user.isAdmin === true ? `${process.env.REACT_APP_API_BASE_URL}/products/all` : `${process.env.REACT_APP_API_BASE_URL}/products/active`;
            fetch(fetchUrl, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    setProductsData(data);
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                });
        }
    }, [user]);
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <BeanGrowSpinner>
                    <span className="visually-hidden">Loading...</span>
                </BeanGrowSpinner>
            </div>
        );
    }
    return <>{orderDisplay}</>;
}
