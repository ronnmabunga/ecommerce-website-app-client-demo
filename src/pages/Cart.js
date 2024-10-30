//  Library Utilities
import { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
//  User-Defined Utilities
import SessionContext from "../context/SessionContext";
//  Library UI Components
import { Card, Row, Col, Container } from "react-bootstrap";
//  User-Defined UI Components
import CartItem from "../components/carts/CartItem";
import ClearCartButton from "../components/carts/ClearCartButton";
import CheckoutButton from "../components/carts/CheckoutButton";
import BeanGrowSpinner from "../components/BeanGrowSpinner";
/*
    Cart Page shows the logged-in user's Cart.
        - This includes, all the items currently in their cart, the price, quantity and subtotal for each item, the total price and the date the cart was first ordered on.
        - The user's Cart is a shared state variable in the SessionContext and is obtained through useContext hook.
        - Users that are not logged in or are admins will be redirected to the Home page.
        - It will display a loading spinner when the loading state is true.
*/
export default function Cart() {
    const { user, cart, loading } = useContext(SessionContext);
    //  Redirect admins and not logged-in users
    const navigate = useNavigate();
    useEffect(() => {
        if (!loading && (user.isAdmin || !user.id)) {
            navigate("/");
        }
    }, [user]);
    //  On first load, and when `cart` changes, re-render this component
    useEffect(() => {}, [cart]);
    //  Displaying the spinner when the loading state is `true` is handled on the pages such as Cart.
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <BeanGrowSpinner>
                    <span className="visually-hidden">Loading...</span>
                </BeanGrowSpinner>
            </div>
        );
    }
    //  When the user has no cart yet or if there are no items in their cart, the component is rendered differently.
    return cart && cart.cartItems && cart.cartItems.length > 0 ? (
        <Container className="primary-section p-5 min-vh-100">
            <Card className="narrow-section-card col d-flex">
                <Card.Body>
                    <Card.Title className="my-2">YOUR CART</Card.Title>
                    <Card.Subtitle className="my-2">Ordered on: {cart.orderedOn}</Card.Subtitle>
                    <Card.Subtitle className="my-2">{cart.cartItems.reduce((acc, product) => acc + product.quantity, 0)} items</Card.Subtitle>
                    {cart.cartItems.map((cartItemData) => (
                        <CartItem key={cartItemData.productId} cartItemData={cartItemData} suppressSubtotal={cart.cartItems.length === 1} />
                    ))}
                    <Container className="d-flex flex-row-reverse" style={{ borderTop: "1px solid #ddd", paddingTop: "10px", marginTop: "10px" }}>
                        <Col className="text-end col-4" xs="auto">
                            <h5>CURRENT TOTAL: PHP{cart.totalPrice}</h5>
                            {cart.cartItems.length > 0 && (
                                <Row>
                                    <Col>
                                        <ClearCartButton />
                                    </Col>
                                    <Col>
                                        <CheckoutButton />
                                    </Col>
                                </Row>
                            )}
                        </Col>
                    </Container>
                </Card.Body>
            </Card>
        </Container>
    ) : (
        <Container className="primary-section p-5 min-vh-100">
            <Row>
                <Col className="mt-5 pt-5 text-center mx-auto">
                    <h1>No Items Found on Your Cart!</h1>
                    <p>Browse our Products Catalog to find an item to add to your cart!</p>
                    <Link className="btn btn-primary" to={"/products"}>
                        Products Catalog
                    </Link>
                </Col>
            </Row>
        </Container>
    );
}
