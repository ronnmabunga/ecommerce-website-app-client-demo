//  Library Utilities
import { useContext, useState } from "react";
import { Navigate, Link } from "react-router-dom";
//  User-Defined Utilities
import SessionContext from "../context/SessionContext";
//  Library UI Components
import { Row } from "react-bootstrap";
//  User-Defined UI Components
import RegisterForm from "../components/users/RegisterForm";
import BeanGrowSpinner from "../components/BeanGrowSpinner";
/*
    The Register Page display a RegisterForm component.
        - It will display a loading spinner when the loading state is true.
        - It will redirect already loggedin users to the product page.
*/
export default function Register() {
    const { user, loading } = useContext(SessionContext);
    const [isHovered, setIsHovered] = useState(false);
    //  Displaying the spinner when the loading state is `true` is handled on the pages such as Register.
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
            <RegisterForm />
            <Row className="text-center">
                <Link to="/login"
                        style={{
                          textDecoration: isHovered ? 'underline' : 'none',
                          color: 'white',
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                >
                    Already have an account? Click Here to Login
                </Link>
            </Row>
            </div>
        </>
    );
}
