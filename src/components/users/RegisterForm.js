//  Library Utilities
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
//  User-Defined Utilities
import SessionContext from "../../context/SessionContext";
//  Library UI Components
import { Form, Button } from "react-bootstrap";
import "../../styles/RegisterForm.css"
import Swal from "sweetalert2";
/*
    The RegisterForm component displays a form that a user may input their information onto.
        - Upon submission of the form, the user may be registered upon correctly providing their information or prompted that the registration failed.
        - Successful registration will redirect the user to the Login page
*/
export default function RegisterForm() {
    const navigate = useNavigate();
    const { setLoading, disableButtons, setDisableButtons } = useContext(SessionContext);
    //  State variables to handle the form
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNo, setMobileNo] = useState(0);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [allowRegister, setAllowRegister] = useState(false);
    //  This function fetches the API when the submit button on the form is clicked. It registers the user using the inputted information, and redirects the user (after a timer counts down) to the Login page. When the registration fails, the user remains on the page and is allowed to retry
    function registerUser(e) {
        setLoading(true);
        setDisableButtons(true);
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                mobileNo: mobileNo,
                password: password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.hasOwnProperty("message") && data.message === "Registered Successfully") {
                    setFirstName("");
                    setLastName("");
                    setEmail("");
                    setMobileNo("");
                    setPassword("");
                    setConfirmPassword("");
                    setLoading(false);
                    setDisableButtons(false);
                    Swal.fire({
                        title: "Registration Successful!",
                        icon: "success",
                        timer: 3000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                        html: 'Thank you for registering!\nRedirecting in 3 seconds...\n<a href="/login" class="btn btn-primary mt-2" rel="noopener noreferrer">Proceed to Login Now</a>',
                        willClose: () => {
                            navigate("/login");
                        },
                    });
                } else if (data.hasOwnProperty("error")) {
                    setLoading(false);
                    setDisableButtons(false);
                    Swal.fire({
                        title: "Registration Failed",
                        icon: "error",
                        text: data.error,
                        timer: 1000,
                        timerProgressBar: true,
                    });
                } else {
                    setLoading(false);
                    setDisableButtons(false);
                    Swal.fire({
                        title: "Registration Failed",
                        icon: "error",
                        text: "Something went wrong. Please try again later or contact us for assistance",
                        timer: 1000,
                        timerProgressBar: true,
                    });
                }
            })
            .catch((error) => {
                setLoading(false);
                setDisableButtons(false);
            });
    }
    //  This side effect checks if the input forms are non-empty, if the mobileNo has a length of 11, and if the password is atleast 8 characters long, and if they are, the button is enabled for submission.
    useEffect(() => {
        if (firstName !== "" && lastName !== "" && email !== "" && mobileNo !== "" && password !== "" && confirmPassword !== "" && password === confirmPassword && mobileNo.length === 11 && password.length >= 8) {
            setAllowRegister(true);
        } else {
            setAllowRegister(false);
        }
    }, [firstName, lastName, email, mobileNo, password, confirmPassword]);
    //  The component renders a React-Bootstrap Form with the required fields and two-way binding of the state variables, as well as a submit button and its handler.
    return (
      <Form onSubmit={(e) => registerUser(e)} className="register-form">
        <h1 className="my-5 text-center register-title">Register</h1>

        <Form.Group className="form-group first-name-group">
          <Form.Label className="form-label first-name-label">First Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter First Name"
            required
            value={firstName}
            autoComplete="on"
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            className="form-control first-name-input"
          />
        </Form.Group>

        <Form.Group className="form-group last-name-group">
          <Form.Label className="form-label last-name-label">Last Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Last Name"
            required
            value={lastName}
            autoComplete="on"
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            className="form-control last-name-input"
          />
        </Form.Group>

        <Form.Group className="form-group email-group">
          <Form.Label className="form-label email-label">Email:</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            required
            value={email}
            autoComplete="on"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="form-control email-input"
          />
        </Form.Group>

        <Form.Group className="form-group mobile-group">
          <Form.Label className="form-label mobile-label">Mobile No:</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Your Mobile Number"
            required
            value={mobileNo}
            autoComplete="on"
            onChange={(e) => {
              setMobileNo(e.target.value);
            }}
            className="form-control mobile-input"
          />
        </Form.Group>

        <Form.Group className="form-group password-group">
          <Form.Label className="form-label password-label">Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password (Must be at least 8 characters long)"
            required
            value={password}
            autoComplete="new-password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="form-control password-input"
          />
        </Form.Group>

        <Form.Group className="form-group confirm-password-group">
          <Form.Label className="form-label confirm-password-label">Confirm Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            autoComplete="new-password"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            className="form-control confirm-password-input"
          />
        </Form.Group>

        <Form.Group className="mt-3 button-group">
          {allowRegister && !disableButtons ? (
            <Button variant="primary" type="submit" id="submitBtn" className="btn submit-btn">
              Create Account
            </Button>
          ) : (
            <Button variant="danger" type="submit" id="submitBtn" disabled className="btn disabled-btn">
              Fill in All Fields First
            </Button>
          )}
        </Form.Group>
      </Form>
    );
}
