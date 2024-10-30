import React, { useState } from "react";
import { Button, Form, Col, Row, Container } from "react-bootstrap";

const ImageUpload = ({ labelText, buttonText, type, id, fetchData }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };
    function handleUpload(e) {
        e.preventDefault();
        setUploading(true);
        if (!selectedFile) {
            setMessage("Please select a file to upload.");
            setUploading(false);
            return;
        }
        const formData = new FormData();
        formData.append("image", selectedFile);
        let fetchUrl = `${process.env.REACT_APP_API_BASE_URL}/${type}s/${id}/imageUpload`;
        fetch(fetchUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                setMessage(data.message);
                fetchData(id);
                setUploading(false);
            })
            .catch((error) => {
                setMessage("Error uploading image.");
                setUploading(false);
            });
    }
    if (uploading) {
        return (
            <Button variant="grey" disabled>
                Uploading...
            </Button>
        );
    }
    return (
        <Container>
            <Row>
                <Form onSubmit={(e) => handleUpload(e)}>
                    <Form.Group>
                        <Col>
                            <Form.Label>{labelText || "Select New Image:"}</Form.Label>
                        </Col>
                        <Col>
                            <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                        </Col>
                    </Form.Group>
                    <Button type="submit" variant="primary">
                        {buttonText || "Upload"}
                    </Button>
                </Form>
            </Row>
            {message && <div>{message}</div>}
        </Container>
    );
};

export default ImageUpload;
