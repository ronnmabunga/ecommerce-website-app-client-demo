import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";

import { Container, Row, Col, Card } from "react-bootstrap";

import SessionContext from "../context/SessionContext";
import Error from "./Error";
import EditProductButton from "../components/products/EditProductButton";
import ProductStatusToggle from "../components/products/ProductStatusToggle";
import AddToCartForm from "../components/carts/AddToCartForm";
import RemoveCartButton from "../components/carts/RemoveCartButton";
import ImageUpload from "../components/ImageUpload";
import BeanGrowSpinner from "../components/BeanGrowSpinner";
export default function ViewProduct() {
    const { productId } = useParams();
    const { user, cart, productsData, loading, setLoading, refreshProductsData } = useContext(SessionContext);
    const [product, setProduct] = useState(null);
    const [quantityInCart, setQuantityInCart] = useState(0);
    const [subtotalInCart, setSubtotalInCart] = useState(0);
    useEffect(() => {
        setLoading(true);
        let productData = productsData.find((product) => product._id === productId);
        console.log(productData);
        setProduct(productData);
        if (cart.cartItems !== null) {
            let inCart = cart.cartItems.find((product) => product._id === productId);
            if (typeof inCart !== "undefined") {
                setQuantityInCart(inCart.quantity);
                setSubtotalInCart(inCart.subtotal);
            } else {
                setQuantityInCart(0);
                setSubtotalInCart(0);
            }
        }
        setLoading(false);
    }, [cart, productsData, productId]);
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <BeanGrowSpinner>
                    <span className="visually-hidden">Loading...</span>
                </BeanGrowSpinner>
            </div>
        );
    }
    return !loading && !product ? (
        <Container className="primary-section p-5 min-vh-100">
            <Error message={"Product does not exist"} redirect={"/products"} buttonText={"Return to Products Catalog"} />
        </Container>
    ) : (
        <Container className="primary-section min-vh-100">
            <Row>
                <Col className="narrow-section-opaque p-5 col-8">
                    <Card className="narrow-section-card" style={{ backgroundColor: "#f8f9fa" }}>
                        <Card.Body className="text-center">
                            <Card.Img className="my-2 img-fluid" variant="top" src={`${product.imageLink}`} style={{ borderRadius: "100%", maxHeight: "30vh", width: "auto", overflow: "hidden" }} onError={(e) => (e.target.src = `${process.env.PUBLIC_URL}/images/default-product.png`)} />
                            <Card.Title className="my-2">{product.name}</Card.Title>
                            <Card.Subtitle className="my-2">Description:</Card.Subtitle>
                            <Card.Text className="my-2">{product.description}</Card.Text>
                            <Card.Text className="my-2">
                                <em>{product.altDescription}</em>
                            </Card.Text>
                            <Card.Subtitle className="my-2">Price:</Card.Subtitle>
                            <Card.Text className="my-2">PhP {product.price}</Card.Text>

                            {user.id !== null ? (
                                user.isAdmin ? (
                                    <>
                                        <Card.Subtitle>Active: </Card.Subtitle>
                                        <Card.Text>{product.isActive ? "Activated" : "Archived"}</Card.Text>
                                        <EditProductButton text={"Edit Product Details"} productId={productId} name={product.name} description={product.description} altDescription={product.altDescription} price={product.price} />
                                        <ProductStatusToggle productId={productId} isActive={product.isActive} textActive={"Archive Product"} textInactive={"Activate Product"} />
                                        <ImageUpload type={"product"} id={productId} fetchData={refreshProductsData} buttonText={"Upload New Product Image"} labelText={"Select New Product Image:"} />
                                    </>
                                ) : (
                                    <>
                                        <Card.Subtitle>Availability: </Card.Subtitle>
                                        <Card.Text>{product.isActive ? "Available" : "Unavailable"}</Card.Text>
                                        {quantityInCart > 0 && (
                                            <>
                                                <Card.Subtitle>Number In Cart:</Card.Subtitle>
                                                <Card.Text>{quantityInCart}</Card.Text>
                                                <Card.Subtitle>Product Subtotal:</Card.Subtitle>
                                                <Card.Text>PhP {subtotalInCart}</Card.Text>
                                            </>
                                        )}
                                        {product.isActive && <AddToCartForm productId={productId} price={product.price} />}
                                        {quantityInCart > 0 && <RemoveCartButton productId={productId} />}
                                    </>
                                )
                            ) : (
                                <Link className="btn btn-danger btn-block" to="/login">
                                    Login to Buy Now!
                                </Link>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
