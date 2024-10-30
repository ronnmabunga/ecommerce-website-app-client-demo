import { Image, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
    const { _id, name, altDescription, price, imageLink } = product;
    return (
        <>
            <div className="products-catalog-card-bg">
                <img className="products-catalog-card-bg " src={`${imageLink}`} onError={(e) => (e.target.src = `${process.env.PUBLIC_URL}/images/default-product.png`)} />
            </div>
            <div className="products-catalog-card-cover"></div>
            <div className="products-catalog-card-content p-5">
                <Link className="supressed-link" to={`/products/${_id}`}>
                    <h3>{name}</h3>
                </Link>
                <p>{altDescription}</p>
                <p>PhP {price}</p>
                <Link className="btn btn-dark btn-outline-light" to={`/products/${_id}`}>
                    Let's Brew It!
                </Link>
            </div>
        </>
    );
}
