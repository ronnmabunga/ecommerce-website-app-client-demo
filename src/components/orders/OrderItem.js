import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
export default function OrderItem({ product, productsData, suppressSubtotal }) {
    const { productId, quantity, subtotal } = product;
    let productData;
    let rowStyle = {
        backgroundImage: `linear-gradient(to left, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 25%, rgba(255, 255, 255, 1) 75%), url(${process.env.PUBLIC_URL}/images/default-product.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        alignItems: "center",
        color: "black",
        padding: "20px",
        position: "relative",
    };
    if (productsData) {
        productData = productsData.find((data) => data._id === productId);
    }
    if (productData) {
        let link = productData.imageLink === "" || typeof productData.imageLink === "undefined" ? `${process.env.PUBLIC_URL}/images/default-product.png` : `${productData.imageLink}`;
        rowStyle = {
            backgroundImage: `linear-gradient(to left, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 25%, rgba(255, 255, 255, 1) 75%), url(${link})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            alignItems: "center",
            color: "black",
            padding: "20px",
            position: "relative",
        };
    }
    return productData ? (
        <Row className="product m-2" style={rowStyle}>
            <Col className="col-9">
                <Link to={`/products/${productId}`}>
                    <h6>{productData.name}</h6>
                </Link>
                <p>
                    {productData.altDescription}
                    <br />
                    {quantity} items | PHP{subtotal / quantity} ea {productData.price === subtotal / quantity ? "" : "(old price)"}
                </p>
            </Col>
            {suppressSubtotal ? "" : <b>Subtotal: PHP{subtotal}</b>}
        </Row>
    ) : (
        <Row className="product m-2" style={rowStyle}>
            <Col className="col-9">
                <Link to={`/products/${productId}`}>
                    <h6>Product ID: {productId}</h6>
                </Link>
                <p>
                    This product is currently unavailable for purchase.
                    <br />
                    {quantity} items | PHP {subtotal / quantity} ea
                </p>
            </Col>
            {suppressSubtotal ? "" : <b>Subtotal: PHP{subtotal}</b>}
        </Row>
    );
}
