//  Library Utilities
import { useContext } from "react";
//  User-Defined Utilities
import SessionContext from "../../context/SessionContext";
//  Library UI Components
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
/* 
    ClearCartButton Component displays a React-Bootstrap Button that clears the cartItems array of a cart when clicked.
*/
export default function ClearCartButton() {
    const { setCart, disableButtons, setDisableButtons } = useContext(SessionContext);
    //  This function is used to call the API, which removes the item designated by the productId from the cart of the user, the user is identified by its Bearer token.
    function clearCart() {
        setDisableButtons(true);
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/clear-cart`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.hasOwnProperty("message")) {
                    setCart({
                        id: data.cart._id,
                        cartItems: data.cart.cartItems,
                        totalPrice: data.cart.totalPrice,
                        orderedOn: data.cart.orderedOn,
                    });
                    setDisableButtons(false);
                    Swal.fire({
                        title: "Cart Cleared Successfully!",
                        icon: "success",
                        text: data.message,
                        timer: 2000,
                        timerProgressBar: true,
                    });
                } else if (data.hasOwnProperty("error")) {
                    setDisableButtons(false);
                    Swal.fire({
                        title: "Cart Clear Failed",
                        icon: "error",
                        text: data.error,
                    });
                } else {
                    setDisableButtons(false);
                    Swal.fire({
                        title: "Cart Clear Failed",
                        icon: "error",
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
        <Button className="col-12 btn btn-dark btn-outline-light" variant="danger" onClick={() => clearCart()}>
            Clear All Cart Items
        </Button>
    );
}
