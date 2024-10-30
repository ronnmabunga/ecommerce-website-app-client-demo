//  Library Utilities
import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
//  User-Defined Utilities
import SessionContext from "../context/SessionContext";
/*
    The Logout Page unsets and resets all state variables related to the user's session back to its default.
    It then redirects the user back to the login page upon logout.
*/
export default function Logout() {
    const { unsetUser, setUser, setCart, setProductsData, setLoading, setDisableButtons } = useContext(SessionContext);
    //  The setter functions of the state variables related to the user's session are taken from the SessionContext and are used to reset them to the default values.
    unsetUser();
    useEffect(() => {
        setUser({
            id: null,
            firstName: null,
            lastName: null,
            email: null,
            mobileNo: null,
            imageLink: null,
            isAdmin: null,
        });
        setCart({
            id: null,
            cartItems: null,
            totalPrice: null,
            orderedOn: null,
        });
        setProductsData([]);
        setLoading(true);
        setDisableButtons(false);
    }, [setUser, setCart, setProductsData, setLoading, setDisableButtons]);
    //  User is redirected to Login page upon resetting the state variables
    return <Navigate to="/login" />;
}
