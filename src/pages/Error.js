//  Library Utilities
import { Link } from "react-router-dom";
//  Library UI Components
import { Row, Col, Button } from "react-bootstrap";
import "./../styles/Error.css";
/*
    Error page accepts the following props: `message`, `redirect` and `buttonText`. Default text values are instead printed if these props are not passed.
*/
export default function Error({ message, redirect, buttonText }) {
    return (
        <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center error-container">
            <video src={`${process.env.PUBLIC_URL}/videos/Error.mp4`} autoPlay loop preload="auto" className="error-video" position="absolute" />
            <Row className="justify-content-center align-items-center">
                <Col xs={12}>
                    <h1 className="page">Page Not Found</h1>
                    <p className="smallpage">{message || "Page Not Found"}</p>
                    <div>
                        <Button className="btn" variant="outline-danger" as={Link} to="/">
                            Return to Home
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
}
