// Library Utilities
import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
// User-Defined Utilities
import SessionContext from "../context/SessionContext";
// Library UI Components
import { Container, Row, Col, Card } from "react-bootstrap";
import ImageUpload from "../components/ImageUpload";
import EditUserButton from "../components/users/EditUserButton";
import EditPasswordButton from "../components/users/EditPasswordButton";
import BeanGrowSpinner from "../components/BeanGrowSpinner";
// User-Defined UI Components
// [TODO] Profile page does what?
export default function Profile() {
    const { user, setUser } = useContext(SessionContext);
    const [loading, setLoading] = useState(false);
    function getUserDetails() {
        setLoading(true);
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
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
                    setLoading(false);
                } else {
                    setUser({
                        id: null,
                        firstName: null,
                        lastName: null,
                        email: null,
                        mobileNo: null,
                        imageLink: null,
                        isAdmin: null,
                    });
                    setLoading(false);
                }
            })
            .catch((error) => {
                setLoading(false);
            });
    }
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <BeanGrowSpinner>
                    <span className="visually-hidden">Loading...</span>
                </BeanGrowSpinner>
            </div>
        );
    }
    return !user.id ? (
        <Navigate to={"/"} />
    ) : (
        <Container className="primary-section p-5 min-vh-100">
            <Row>
                <Col className="narrow-section-opaque p-5 col-8">
                    <Card className="narrow-section-card">
                        <Card.Body className="text-center p-3">
                            <Card.Img className="my-2 img-fluid" variant="top" src={`${user.imageLink}`} style={{ borderRadius: "100%", maxHeight: "30vh", width: "auto", overflow: "hidden" }} onError={(e) => (e.target.src = `${process.env.PUBLIC_URL}/images/default-user.png`)} />
                            <Card.Title>
                                {user.firstName} {user.lastName}
                            </Card.Title>
                            <Card.Subtitle>Email Address:</Card.Subtitle>
                            <Card.Text>{user.email}</Card.Text>
                            <Card.Subtitle>Mobile Number:</Card.Subtitle>
                            <Card.Text>{user.mobileNo}</Card.Text>
                            <EditUserButton text={"Update Profile Details"} userId={user.id} firstName={user.firstName} lastName={user.lastName} email={user.email} mobileNo={user.mobileNo} imageLink={user.imageLink} getUserDetails={getUserDetails} />
                            <EditPasswordButton />
                            <ImageUpload type={"user"} id={user.id} fetchData={getUserDetails} buttonText={"Upload User Avatar"} labelText={"Select New Image as Avatar:"} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
