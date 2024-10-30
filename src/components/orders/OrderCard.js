import { Card, Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import OrderItem from "./OrderItem";
export default function OrderCard({ isAdmin, order, productsData, singleProduct }) {
    const { _id, userId, productsOrdered, totalPrice, orderedOn, status } = order;
    const itemCount = productsOrdered.reduce((acc, product) => acc + product.quantity, 0);
    let suppressSubtotal = false;
    if (productsOrdered.length === 1) {
        suppressSubtotal = true;
    }
    return (
        <Card className="narrow-section-card col d-flex m-5 p-5">
            <Card.Body>
                <Card.Title>
                    <Link to={`/orders/${_id}`}>OrderID#{_id}</Link>
                </Card.Title>
                {isAdmin && <Card.Subtitle>User#{userId}</Card.Subtitle>}
                <Card.Subtitle>{orderedOn}</Card.Subtitle>
                <Card.Subtitle>{itemCount} items</Card.Subtitle>
                <Card.Subtitle>Status: {status}</Card.Subtitle>
                {productsOrdered.map((product) => (
                    <OrderItem product={product} key={product.productId} productsData={productsData} suppressSubtotal={suppressSubtotal} />
                ))}
                <Container style={{ borderTop: "1px solid #ddd", paddingTop: "10px", marginTop: "10px" }}>
                    <Row className="d-flex justify-content-between align-items-center">
                        <Col xs="auto">
                            <h5 className="d-inline">TOTAL: PHP{totalPrice}</h5>
                        </Col>
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    );
}
