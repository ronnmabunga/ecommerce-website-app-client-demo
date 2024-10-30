//  Library Utilities
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
//  User-Defined Utilities
import SessionContext from "../../context/SessionContext";
//  Library UI Components
import { Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import "../../styles/LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
/*
    The LoginForm component displays a form that a user may input their email address and password onto.
        - Upon submission of the form, the user may be logged-in upon correctly providing their credentials or prompted that the logged in failed.
        - Successful login will redirect the user to the Products page
*/
export default function LoginForm() {
    const navigate = useNavigate();
    const { setUser, setLoading, disableButtons, setDisableButtons } = useContext(SessionContext);
    //  State variables to handle the form
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [allowLogin, setAllowLogin] = useState(true);
    const [loginLoading, setLoginLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    //  This function fetches the API when the submit button on the form is clicked.
    function authenticate(e) {
        e.preventDefault();
        //  This function is called upon successful log in and initializes the user's session by fetching the user's information from the database and then setting the values for the user state variable in the SessionContext.
        async function getProfile(token) {
            setProfileLoading(true);
            setDisableButtons(true);
            await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.user) {
                        setUser({
                            id: data.user._id,
                            firstName: data.user.firstName,
                            lastName: data.user.lastName,
                            email: data.user.email,
                            mobileNo: data.user.mobileNo,
                            imageLink: data.user.imageLink,
                            isAdmin: data.user.isAdmin,
                        });
                    }
                    setProfileLoading(false);
                    setDisableButtons(false);
                })
                .catch((error) => {
                    setProfileLoading(false);
                    setDisableButtons(false);
                });
        }
        //  This function fetches the API when the submit button on the form is clicked. It logs in the user using the inputted credentials, and puts the Bearer token onto the localStorage upon success, it also initializes the user's information on the session, it also redirects the user (after a timer counts down) to the products page. When the login fails, the user remains on the page and is allowed to retry logging in.
        async function loginUser() {
            setLoginLoading(true);
            setDisableButtons(true);
            await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.hasOwnProperty("access")) {
                        localStorage.setItem("token", data.access);
                        getProfile(data.access);
                        Swal.fire({
                            title: "Login Successful",
                            icon: "success",
                            text: `Welcome to our Shop!`,
                            timer: 3000,
                            timerProgressBar: true,
                            willClose: () => {
                                navigate("/products");
                            },
                        });
                        setEmail("");
                        setPassword("");
                        setLoginLoading(false);
                        setDisableButtons(false);
                    } else if (data.hasOwnProperty("error")) {
                        setPassword("");
                        Swal.fire({
                            title: "Authentication Failed",
                            icon: "error",
                            text: data.error,
                            timer: 1000,
                            timerProgressBar: true,
                            willClose: () => {
                                window.location.reload();
                            },
                        });
                        setProfileLoading(false);
                        setDisableButtons(false);
                        setLoginLoading(false);
                    } else {
                        setPassword("");
                        Swal.fire({
                            title: "Authentication Failed",
                            icon: "error",
                            text: "Something went wrong. Check your login details and try again.",
                            timer: 1000,
                            timerProgressBar: true,
                            willClose: () => {
                                window.location.reload();
                            },
                        });
                        setProfileLoading(false);
                        setDisableButtons(false);
                        setLoginLoading(false);
                    }
                })
                .catch((error) => {
                    setProfileLoading(false);
                    setDisableButtons(false);
                    setLoginLoading(false);
                });
        }
        loginUser();
    }
    useEffect(() => {
        console.log(loginLoading, profileLoading);
        setLoading(loginLoading || profileLoading);
    }, [loginLoading, profileLoading]);
    //  This side effect checks if the email and password input forms are non-empty, and if they are, the button is enabled for submission.
    useEffect(() => {
        if (email !== "" && password !== "") {
            setAllowLogin(true);
        } else {
            setAllowLogin(false);
        }
    }, [email, password]);
    //  The component renders a React-Bootstrap Form with the required fields and two-way binding of the state variables, as well as a submit button and its handler.
    return (
        <>
            <div>
                <Form onSubmit={(e) => authenticate(e)} className="login-form">
                    <h1 className="my-5 text-center login-title">Login</h1>
                    <Form.Group controlId="userEmail" className="form-group email-group">
                        <Form.Label className="form-label email-label">Email Address</Form.Label>
                        <div className="input-with-icon">
                            <Form.Control type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required className="form-control email-input" />
                            <FaUser className="input-icon" />
                        </div>
                    </Form.Group>
                    <Form.Group controlId="password" className="form-group password-group">
                        <Form.Label className="form-label password-label">Password</Form.Label>
                        <div className="input-with-icon">
                            <Form.Control type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required className="form-control password-input" />
                            <FaLock className="input-icon" />
                        </div>
                    </Form.Group>
                    <Form.Group className="mt-3 button-group">
                        {allowLogin && !disableButtons ? (
                            <Button variant="primary" type="submit" id="submitBtn" className="btn submit-btn">
                                Login
                            </Button>
                        ) : (
                            <Button variant="danger" type="submit" id="submitBtn" disabled className="btn disabled-btn">
                                Fill in All Fields First
                            </Button>
                        )}
                    </Form.Group>
                </Form>
            </div>
        </>
    );
}
