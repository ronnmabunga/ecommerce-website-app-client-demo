//  Library Utilities
import { useContext } from "react";
//  User-Defined Utilities
import SessionContext from "../../context/SessionContext";
//  Library UI Components
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
/* 
    RemoveCartButton Component displays a React-Bootstrap Button for a cart item given its productId.
        - The productId is provided through props drilling.
*/
export default function RemoveCartButton({ productId }) {
    const { setCart, disableButtons, setDisableButtons } = useContext(SessionContext);
    //  This function is used to call the API, which removes the item designated by the productId from the cart of the user, the user is identified by its Bearer token.
    function removeFromCart(productId) {
        setDisableButtons(true);
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/${productId}/remove-from-cart`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                productId: productId,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.hasOwnProperty("message")) {
                    setCart({
                        id: data.updatedCart._id,
                        cartItems: data.updatedCart.cartItems,
                        totalPrice: data.updatedCart.totalPrice,
                        orderedOn: data.updatedCart.orderedOn,
                    });
                    setDisableButtons(false);
                    Swal.fire({
                        title: "Item Removed from Cart Successfully!",
                        icon: "success",
                        text: data.message,
                        timer: 2000,
                        timerProgressBar: true,
                    });
                } else if (data.hasOwnProperty("error")) {
                    setDisableButtons(false);
                    Swal.fire({
                        title: "Item Removal Failed",
                        icon: "error",
                        text: data.error,
                    });
                } else {
                    setDisableButtons(false);
                    Swal.fire({
                        title: "Item Removal Failed",
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
    //  The button has a simple rendering. Its onClick property calls the function removeFromCart with the provided productId.
    return (
        <Button className="col-12 btn btn-dark btn-outline-light" variant="danger" onClick={() => removeFromCart(productId)}>
            Remove from Cart
        </Button>
    );
}
