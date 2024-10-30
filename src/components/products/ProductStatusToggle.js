import { useState, useContext, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import SessionContext from "../../context/SessionContext";
export default function ProductStatusToggle({ productId, isActive, textActive, textInactive }) {
    const { setLoading, setDisableButtons, disableButtons, refreshProductsData } = useContext(SessionContext);
    async function refreshProducts() {
        await refreshProductsData();
    }
    function activateProduct(productId) {
        setLoading(true);
        setDisableButtons(true);
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/activate`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.hasOwnProperty("message")) {
                    refreshProducts();
                    Swal.fire({
                        title: "Product Activated Successfully!",
                        icon: "success",
                        text: data.message,
                        timer: 1000,
                        timerProgressBar: true,
                    });
                } else if (data.hasOwnProperty("error")) {
                    Swal.fire({
                        title: "Product Activation Failed",
                        icon: "error",
                        text: data.error,
                        timer: 1000,
                        timerProgressBar: true,
                    });
                } else {
                    Swal.fire({
                        title: "Product Activation Failed",
                        icon: "error",
                        text: "Something went wrong. Please try again later or contact us for assistance",
                        timer: 1000,
                        timerProgressBar: true,
                    });
                }
                setLoading(false);
                setDisableButtons(false);
            })
            .catch((error) => {
                setLoading(false);
                setDisableButtons(false);
            });
    }
    function archiveProduct(productId) {
        setLoading(true);
        setDisableButtons(true);
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/archive`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.hasOwnProperty("message")) {
                    refreshProducts();
                    Swal.fire({
                        title: "Product Archived Successfully!",
                        icon: "success",
                        text: data.message,
                        timer: 1000,
                        timerProgressBar: true,
                    });
                } else if (data.hasOwnProperty("error")) {
                    setLoading(false);
                    Swal.fire({
                        title: "Product Archiving Failed",
                        icon: "error",
                        text: data.error,
                        timer: 1000,
                        timerProgressBar: true,
                    });
                } else {
                    setLoading(false);
                    Swal.fire({
                        title: "Product Archiving Failed",
                        icon: "error",
                        text: "Something went wrong. Please try again later or contact us for assistance",
                        timer: 1000,
                        timerProgressBar: true,
                    });
                }
                setLoading(false);
                setDisableButtons(false);
            })
            .catch((error) => {
                setLoading(false);
                setDisableButtons(false);
            });
    }
    if (disableButtons) {
        return (
            <Button className="col-12 btn-grey btn-outline-dark" disabled>
                Loading...
            </Button>
        );
    }
    return isActive ? (
        <Button className="col-12 btn-light btn-outline-dark" onClick={() => archiveProduct(productId)}>
            {textActive}
        </Button>
    ) : (
        <Button className="col-12 btn-dark btn-outline-dark" onClick={() => activateProduct(productId)}>
            {textInactive}
        </Button>
    );
}
