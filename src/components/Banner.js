//  Library Utilities
import { Link } from "react-router-dom";
//  Library UI Components
import { Button } from "react-bootstrap";
//  User-defined UI Components
import "../styles/Banner.css";
//  The Banner component is a UI component used to display a banner-like formatted content, primarily used in landing pages. The text content is passed as the `data` props.
export default function Banner({ data }) {
    const { title, content, destination, buttonLabel } = data;
    return (
        <div className="container banner-container">
            <h1>{title}</h1>
            <p>{content}</p>
            <div>
                <Button className="btn" variant="outline-light" as={Link} to={destination}>
                    {buttonLabel}
                </Button>
            </div>
        </div>
    );
}
