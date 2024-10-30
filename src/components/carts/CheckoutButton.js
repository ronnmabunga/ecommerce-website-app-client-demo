//  Library Utilities
import { useContext } from "react";
//  User-Defined Utilities
import SessionContext from "../../context/SessionContext";
//  Library UI Components
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
/* 
    CheckoutButton Component displays a React-Bootstrap Button that checksout the Cart contents into an Order when clicked.
*/
export default function CheckoutButton() {
    const { cart, setCart, disableButtons, setDisableButtons, orderHistory, setOrderHistory } = useContext(SessionContext);
    //  This function is used to call the API, which removes the item designated by the productId from the cart of the user, the user is identified by its Bearer token.
    function checkout() {
        setDisableButtons(true);
        if (!cart.cartItems) {
            Swal.fire({
                title: "Cart Checkout Failed",
                icon: "error",
                timer: 1000,
                timerProgressBar: true,
                text: "You can't checkout an empty cart!",
            });
            return;
        }
        let itemsInCart = cart.cartItems.reduce((acc, product) => acc + product.quantity, 0);
        if (itemsInCart < 1) {
            setDisableButtons(false);
            Swal.fire({
                title: "Cart Checkout Failed",
                icon: "error",
                timer: 1000,
                timerProgressBar: true,
                text: "You can't checkout an empty cart!",
            });
            return;
        }
        fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/checkout`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.hasOwnProperty("message") && data.message === "Ordered Successfully") {
                    let newOrderHistory = [...orderHistory];
                    newOrderHistory.push(data.order);
                    setOrderHistory(newOrderHistory);
                    setCart({
                        id: null,
                        cartItems: null,
                        totalPrice: null,
                        orderedOn: null,
                    });
                    setDisableButtons(false);
                    Swal.fire({
                        title: "Cart Checkout Successful!",
                        icon: "success",
                        text: data.message,
                        timer: 1000,
                        timerProgressBar: true,
                    });
                } else if (data.hasOwnProperty("error")) {
                    setDisableButtons(false);
                    Swal.fire({
                        title: "Cart Checkout Failed",
                        icon: "error",
                        timer: 1000,
                        timerProgressBar: true,
                        text: data.error,
                    });
                } else {
                    setDisableButtons(false);
                    Swal.fire({
                        title: "Cart Checkout Failed",
                        icon: "error",
                        timer: 1000,
                        timerProgressBar: true,
                        text: "Something went wrong. Please try again later or contact us for assistance",
                    });
                }
            })
            .catch((error) => {
                setDisableButtons(false);
            });
    }
    //  The button is rendered differently while the disableButton state is true
    if (disableButtons) {
        return (
            <Button className="col-12" variant="grey" disabled>
                Loading...
            </Button>
        );
    }
    //  The button has a simple rendering. Its onClick property calls the function clearCart.
    return (
        <Button className="col-12 btn btn-dark btn-outline-light" variant="success" onClick={() => checkout()}>
            Checkout
        </Button>
    );
}
