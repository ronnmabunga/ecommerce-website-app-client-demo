//  Library Utilities
import { useContext, useState } from "react";
import { Navigate, Link } from "react-router-dom";
//  User-Defined Utilities
import SessionContext from "../context/SessionContext";
//  Library UI Components
import { Row } from "react-bootstrap";
//  User-Defined UI Components
import LoginForm from "../components/users/LoginForm";
import BeanGrowSpinner from "../components/BeanGrowSpinner";
/*
    The Login Page display a LoginForm component.
        - It will display a loading spinner when the loading state is true.
        - It will redirect already loggedin users to the product page.
*/
export default function Login() {
    const { user, loading } = useContext(SessionContext);
    const [isHovered, setIsHovered] = useState(false);
    //  Displaying the spinner when the loading state is `true` is handled on the pages such as Login.
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <BeanGrowSpinner>
                    <span className="visually-hidden">Loading...</span>
                </BeanGrowSpinner>
            </div>
        );
    }
    //  When the user is already logged in, they are redirected to the products page.
    return user.id !== null ? (
        <Navigate to="/products" />
    ) : (
        <>
            <div className="min-vh-100">
            <LoginForm />
            <Row className="text-center">
                <Link
                        to="/register"
                        style={{
                          textDecoration: isHovered ? 'underline' : 'none',
                          color: 'white',
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                >
                        No account yet? Click Here to Register
                </Link>
            </Row>
            </div>
        </>
    );
}
