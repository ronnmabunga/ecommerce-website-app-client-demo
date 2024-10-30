//  Library Utilities
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
//  User-Defined Utilities
import SessionContext from "../context/SessionContext";
//  User-Defined UI Components
import NewProductForm from "../components/products/NewProductForm";
import BeanGrowSpinner from "../components/BeanGrowSpinner";
/*
    The NewProduct Page display a NewProductForm component.
        - It will display a loading spinner when the loading state is true.
        - It will redirect users that are not logged in or non-admin back to the Products page.
*/
export default function NewProduct() {
    const { user, loading } = useContext(SessionContext);
    const navigate = useNavigate();
    //  When the user is not logged in or is a non-admin, they are redirected back to the Products page.
    useEffect(() => {
        if (!loading && !user.isAdmin) {
            navigate("/products");
        }
    }, [user]);
    //  Displaying the spinner when the loading state is `true` is handled on the pages such as NewProduct.
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <BeanGrowSpinner>
                    <span className="visually-hidden">Loading...</span>
                </BeanGrowSpinner>
            </div>
        );
    }
    return <NewProductForm />;
}
