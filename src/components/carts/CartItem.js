//  Library Utilities
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
//  User-Defined Utilities
import SessionContext from "../../context/SessionContext";
//  Library UI Components
import { Row, Col } from "react-bootstrap";
//  User-Defined UI Components
import AddToCartForm from "./AddToCartForm";
import RemoveCartButton from "./RemoveCartButton";
/* 
    CartItem Component displays a React-Bootstrap Row for each cart item the user has.
        - This includes the price, quantity and subtotal for each item.
        - It also takes information from the productsData of the user's SessionContext, to get the product's name, imageLink, description, price, and whether it is currently available or not.
*/
export default function CartItem({ cartItemData, suppressSubtotal }) {
    const { productsData } = useContext(SessionContext);
    //  Some of the data about the product to be displayed is props drilled from the Cart Page. Additional information is taken from the SessionContext's productsData state variable.
    const { productId, quantity, subtotal } = cartItemData;
    const [productData, setProductData] = useState(null);
    // State variables related to displaying the component
    const [rowStyle, setRowStyle] = useState({
        backgroundImage: `linear-gradient(to left, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 1) 75%), url(${process.env.PUBLIC_URL}/images/default-product.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        alignItems: "center",
        color: "black",
        padding: "20px",
        position: "relative",
    });
    //  On first Load, or when `productsData` changes, the additional data of the product specified in productsData is searched for using the productId. Additionally, it checks if the image provided in the productData found is able to properly load, if it does, the backgroundImage in the rowStyle is changed.
    useEffect(() => {
        let tempProductData = productsData.find((data) => data._id === productId);
        setProductData(tempProductData);
        const testImage = new Image();
        testImage.onload = () => {
            setRowStyle({ ...rowStyle, backgroundImage: `linear-gradient(to left, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 1) 75%), url(${tempProductData.imageLink})` });
        };
        if (tempProductData) {
            testImage.src = tempProductData.imageLink;
        }
    }, [productsData, productId]);
    // The rendering differs if the productData is within the user's SessionContext, if the productData is not found this means that the product has been archived and is unavailable for purchase. Only the information from the saved cart should be available to the user. Although, they may still be able to remove the item the cart.
    return productData ? (
        <>
            <Row className="product m-2" style={rowStyle}>
                <Col className=" col-3">
                    {productData.isActive && <AddToCartForm productId={productId} price={productData.price} />}
                    {quantity > 0 && <RemoveCartButton productId={productId} />}
                </Col>
                <Col className="cart-item-card col-9">
                    <Link className="supressed-link" to={`/products/${productId}`}>
                        <h6>{productData.name}</h6>
                        <p className="m-0">{productData.altDescription}</p>
                        <p className="m-0">
                            {quantity} items {quantity > 0 && `| PHP${subtotal / quantity} ea`}
                        </p>
                        <p className="m-0">Status: {productData.isActive ? "Available" : "Unavailable"}</p>
                        {suppressSubtotal ? "" : <b>Subtotal: PHP{subtotal}</b>}
                    </Link>
                </Col>
            </Row>
        </>
    ) : (
        <Row className="product m-2" style={rowStyle}>
            <Col className="col-9">
                <h6>{productId}</h6>
                <p>
                    This product is unavailable. Please remove them from cart
                    <br />
                    {quantity} items | PHP{subtotal / quantity} ea
                </p>
                {suppressSubtotal ? "" : <b>Subtotal: PHP{subtotal}</b>}
            </Col>
        </Row>
    );
}
