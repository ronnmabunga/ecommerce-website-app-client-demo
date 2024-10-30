//  Library Utilities
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
//  User-Defined Utilities
import SessionContext from "../../context/SessionContext";
//  Library UI Components
import { Form, Button, Container } from "react-bootstrap";
import Swal from "sweetalert2";
/*
    The NewProductForm component displays a form that an admin user may input information about a new product.
        - Upon successful completion and submission of the form, the new product will be added to the database.
        - The user will also be redirected to the new product's page upon successful creation.
*/
export default function NewProductForm() {
    const navigate = useNavigate();
    const { setLoading, disableButtons, setDisableButtons, productsData, setProductsData } = useContext(SessionContext);
    //  State variables to handle the form
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [altDescription, setAltDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [allowCreateProduct, setAllowCreateProduct] = useState(false);
    //  This function fetches the API when the submit button on the form is clicked.
    function registerNewProduct(e) {
        e.preventDefault();
        async function createProduct() {
            fetch(`${process.env.REACT_APP_API_BASE_URL}/products/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    name: name,
                    description: description,
                    altDescription: altDescription,
                    price: Number(price),
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.hasOwnProperty("_id")) {
                        let newProductsData = [...productsData];
                        newProductsData.push(data);
                        setProductsData(newProductsData);
                        setName("");
                        setDescription("");
                        setPrice(0);
                        setLoading(false);
                        setDisableButtons(false);
                        Swal.fire({
                            title: "Product Created Successfully!",
                            icon: "success",
                            timer: 2000,
                            timerProgressBar: true,
                            willClose: () => {
                                navigate(`/products/${data._id}`);
                            },
                        });
                    } else if (data.hasOwnProperty("error")) {
                        setLoading(false);
                        setDisableButtons(false);
                        Swal.fire({
                            title: "Product Creation Failed",
                            icon: "error",
                            text: data.error,
                            timer: 1000,
                            timerProgressBar: true,
                        });
                    } else {
                        setLoading(false);
                        setDisableButtons(false);
                        Swal.fire({
                            title: "Product Creation Failed",
                            icon: "error",
                            text: "Something went wrong. Please try again later or contact us for assistance",
                            timer: 1000,
                            timerProgressBar: true,
                        });
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    setDisableButtons(false);
                });
        }
        setLoading(true);
        setDisableButtons(true);
        createProduct();
    }
    //  This side effect checks if the input forms are non-empty, and if they are, the button is enabled for submission.
    useEffect(() => {
        if (name !== "" && description !== "" && price !== "") {
            setAllowCreateProduct(true);
        } else {
            setAllowCreateProduct(false);
        }
    }, [name, description, price]);
    //  The component renders a React-Bootstrap Form with the required fields and two-way binding of the state variables, as well as a submit button and its handler.
    return (
        <div className="container-fluid p-5 min-vh-100">
            <Container className="narrow-section-opaque col-8">
                <h1 className="my-5 text-center">Register New Product</h1>
                <Form onSubmit={(e) => registerNewProduct(e)}>
                    <Form.Group>
                        <Form.Label>Product Name:</Form.Label>
                        <Form.Control type="text" placeholder="Enter Product Name" required value={name} onChange={(e) => setName(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Product Description:</Form.Label>
                        <Form.Control as="textarea" rows={5} placeholder="Enter Product Description" required value={description} onChange={(e) => setDescription(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Product Alternate Description:</Form.Label>
                        <Form.Control as="textarea" rows={2} placeholder="Enter Alternate Product Description" required value={altDescription} onChange={(e) => setAltDescription(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Price:</Form.Label>
                        <Form.Control type="number" placeholder="Enter Price" required value={price} onChange={(e) => setPrice(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        {allowCreateProduct && !disableButtons ? (
                            <Button variant="primary" type="submit" id="submitBtn">
                                Create Product
                            </Button>
                        ) : (
                            <Button variant="danger" type="submit" id="submitBtn" disabled>
                                Fill in All Fields First
                            </Button>
                        )}
                    </Form.Group>
                </Form>
            </Container>
        </div>
    );
}
