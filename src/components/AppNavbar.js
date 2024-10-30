// Library Utilities
import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";

// User-Defined Utilities
import SessionContext from "../context/SessionContext";

// Library UI Components
import { Container, Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import "../styles/AppNavbar.css";

// The Navbar component serves as the primary navigation UI component for the application. It is rendered on all the pages of the application.
export default function AppNavbar() {
    // It takes the user's information from the SessionContext, it then conditionally renders the Navbar links only to include pages that should be accessible to the user.
    const { user } = useContext(SessionContext);

    // The Home and Products pages are accessible to all users. Authenticated admin users are able to access the Admin Dashboard pages, Profile and Logout. Authenticated non-admin users are able to access the Cart, Orders, Profile and Logout pages. Guest users can access the Login and Register pages.
    return (
        <Navbar className="navbar" expand="lg" fixed="top">
            <Container>
                <Navbar.Brand className="navbar-logo" as={NavLink} to="/">
                    <video src={`${process.env.PUBLIC_URL}/videos/animation.mp4`} autoPlay loop muted preload="auto" style={{ width: "100%", maxWidth: "80px", height: "auto" }} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Button className="btn btn-dark " as={NavLink} to="/">
                            HOME
                        </Button>
                        {user.id !== null ? (
                            <>
                                {!user.isAdmin ? (
                                    <>
                                        <Button className="btn btn-dark" as={NavLink} to="/products">
                                            OUR COFFEE
                                        </Button>
                                        <Button className="btn btn-dark" as={NavLink} to="/cart">
                                            CART
                                        </Button>
                                        <Button className="btn btn-dark" as={NavLink} to="/orders">
                                            MY ORDERS
                                        </Button>
                                    </>
                                ) : (
                                    ""
                                )}
                                <Button className="btn btn-dark" as={NavLink} to="/profile">
                                    MY PROFILE
                                </Button>
                                <Button className="btn btn-dark" as={NavLink} to="/logout">
                                    LOGOUT
                                </Button>
                                {user.isAdmin ? (
                                    <NavDropdown className="btn btn-light btn-outline-light nav-dropdown-title" title="ADMIN ACTIONS" id="basic-nav-dropdown">
                                        <NavDropdown.Item as={NavLink} to="/products" end={true}>
                                            <span className="navdropdown-links">MANAGE PRODUCTS</span>
                                        </NavDropdown.Item>
                                        <NavDropdown.Item as={NavLink} to="/products/new">
                                            <span className="navdropdown-links">ADD NEW PRODUCT</span>
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={NavLink} to="/users">
                                            <span className="navdropdown-links">MANAGE USERS</span>
                                        </NavDropdown.Item>
                                        <NavDropdown.Item as={NavLink} to="/orders" end={true}>
                                            <span className="navdropdown-links">ORDER HISTORY</span>
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                ) : (
                                    ""
                                )}
                            </>
                        ) : (
                            <>
                                <Button className="btn btn-dark" as={NavLink} to="/products">
                                    OUR COFFEE
                                </Button>
                                <Button className="btn btn-dark" as={NavLink} to="/register">
                                    SIGN UP
                                </Button>
                                <Button className="btn btn-dark" as={NavLink} to="/login">
                                    SIGN IN
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
