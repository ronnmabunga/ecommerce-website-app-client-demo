//  Library Utilities
import { useState, useContext, useEffect } from "react";
//  User-Defined Utilities
import SessionContext from "../../context/SessionContext";
//  Library UI Components
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
/* 
    AddToCartForm Component displays a React-Bootstrap Form for a cart item given its productId and price.
        - The productId and price is provided through props drilling.
        - This component renders differently if the product is already in the cart or not, it also calls a different API endpoint based on this information.
*/
export default function AddToCartForm({ productId, price }) {
    const { cart, setCart, disableButtons, setDisableButtons } = useContext(SessionContext);
    const [quantity, setQuantity] = useState(1);
    const [subtotal, setSubtotal] = useState(0);
    const [inCart, setInCart] = useState(false);
    //  This function is used to call the API, which adds the item designated by the productId from the cart of the user, and the quantity indicated by the form input, as well as the calculated subtotal. The user is identified by its Bearer token.
    function addToCart(e, productId) {
        e.preventDefault();
        setDisableButtons(true);
        if (quantity < 1) {
            setDisableButtons(false);
            Swal.fire({
                title: "Product Quantity Cannot be Zero",
                icon: "error",
                text: "Something went wrong. Please try again later or contact us for assistance",
                timer: 1000,
                timerProgressBar: true,
            });
            return;
        }
        if (inCart) {
            fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/update-cart-quantity`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    productId: productId,
                    quantity: quantity,
                    subtotal: quantity * price,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.hasOwnProperty("message") && data.message === "Item quantity updated successfully") {
                        setCart({
                            id: data.updatedCart._id,
                            cartItems: data.updatedCart.cartItems,
                            totalPrice: data.updatedCart.totalPrice,
                            orderedOn: data.updatedCart.orderedOn,
                        });
                        setDisableButtons(false);
                        Swal.fire({
                            title: "Item Quantity Updated Successfully",
                            icon: "success",
                            timer: 1000,
                            timerProgressBar: true,
                        });
                    } else if (data.hasOwnProperty("error")) {
                        setDisableButtons(false);
                        Swal.fire({
                            title: "Item Quantity Update Failed",
                            icon: "error",
                            text: data.error,
                            timer: 1000,
                            timerProgressBar: true,
                        });
                    } else {
                        setDisableButtons(false);
                        Swal.fire({
                            title: "Item Quantity Update Failed",
                            icon: "error",
                            text: "Something went wrong. Please try again later or contact us for assistance",
                            timer: 1000,
                            timerProgressBar: true,
                        });
                    }
                })
                .catch((error) => {
                    setDisableButtons(false);
                });
        } else {
            fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/add-to-cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    productId: productId,
                    quantity: quantity,
                    subtotal: quantity * price,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.hasOwnProperty("message")) {
                        if (data.cart.cartItems !== null) {
                            let inCart = data.cart.cartItems.find((product) => product.productId === productId);
                            inCart.quantity = quantity;
                        }
                        setCart({
                            id: data.cart._id,
                            cartItems: data.cart.cartItems,
                            totalPrice: data.cart.totalPrice,
                            orderedOn: data.cart.orderedOn,
                        });
                        setDisableButtons(false);
                        Swal.fire({
                            title: "Product Added to Cart Successfully!",
                            icon: "success",
                            text: data.message,
                            timer: 1000,
                            timerProgressBar: true,
                        });
                    } else if (data.hasOwnProperty("error")) {
                        setDisableButtons(false);
                        Swal.fire({
                            title: "Adding to Cart Failed",
                            icon: "error",
                            text: data.error,
                            timer: 1000,
                            timerProgressBar: true,
                        });
                    } else {
                        setDisableButtons(false);
                        Swal.fire({
                            title: "Adding to Cart Failed",
                            icon: "error",
                            text: "Something went wrong. Please try again later or contact us for assistance",
                            timer: 1000,
                            timerProgressBar: true,
                        });
                    }
                })
                .catch((error) => {
                    setDisableButtons(false);
                });
        }
    }
    //  This side effect checks the current quantity of the item in the cart, it then changes the initial value of the quantity in the form to the amount in cart, as well as the boolean `inCart`, which is used to conditionally call a different endpoint and render the component differently.
    useEffect(() => {
        if (cart.cartItems) {
            let cartItem = cart.cartItems.find((product) => product.productId === productId);
            if (cartItem) {
                setInCart(true);
                setQuantity(cartItem.quantity);
            } else {
                setInCart(false);
                setQuantity(0);
            }
        }
    }, [cart, productId]);
    //  This side effect recalculates the subtotal whenever the quantity state changes.
    useEffect(() => {
        setSubtotal(quantity * price);
    }, [quantity, price]);
    //  The button is rendered differently while the disableButton state is true
    if (disableButtons) {
        return (
            <Form>
                <Container>
                    <Row>
                        <Form.Control placeholder="Quantity" type="number" min={0} value={quantity} onChange={(e) => setQuantity(e.target.value)} disabled />
                        <Form.Control className="col-8" placeholder="Subtotal: 0" type="text" value={`Subtotal: ${subtotal}`} disabled />
                    </Row>
                    <Row>
                        <Button className="col-12" variant="grey" disabled>
                            Loading...
                        </Button>
                    </Row>
                </Container>
            </Form>
        );
    }
    //  The form when submitted calls the addToCart function with the provided productId as parameter. The form consists of the quantity input form, from which the user can type the quantity of the product they want to put in cart, as well as 2 +- buttons that adjusts the quantity.
    return (
        <Form onSubmit={(e) => addToCart(e, productId)}>
            <Container>
                <Row>
                    <Col className="col-12">
                        <Form.Control placeholder="Quantity" type="number" min={0} value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                    </Col>
                </Row>
                <Row>
                    <Col className="col-12">
                        <Form.Control className="col-12" placeholder="Subtotal: 0" type="text" value={subtotal} disabled />
                    </Col>
                </Row>
                <Row>
                    <Col className="col-2">
                        <Button className="col btn-dark btn-outline-light" onClick={() => (quantity > 0 ? setQuantity(quantity - 1) : setQuantity(0))}>
                            -1
                        </Button>
                    </Col>{" "}
                    <Col className="col-2">
                        <Button className="col btn-dark btn-outline-light" onClick={() => setQuantity(quantity + 1)}>
                            +1
                        </Button>
                    </Col>
                    <Col className="col-8">
                        <Button className="col btn-dark btn-outline-light" type="submit">
                            {inCart ? "Update Quantity" : "Add To Cart"}
                        </Button>
                    </Col>
                </Row>
            </Container>
        </Form>
    );
}
