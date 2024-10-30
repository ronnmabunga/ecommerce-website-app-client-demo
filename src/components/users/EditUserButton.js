import { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";

export default function EditUserButton({ text, userId, firstName, lastName, email, mobileNo, getUserDetails }) {
    const [firstNameOnModal, setFirstNameOnModal] = useState(firstName);
    const [lastNameOnModal, setLastNameOnModal] = useState(lastName);
    const [emailOnModal, setEmailOnModal] = useState(email);
    const [mobileNoOnModal, setMobileNoOnModal] = useState(mobileNo);
    const [showEditModal, setShowEditModal] = useState(false);
    const [allowUpdateOnModal, setAllowUpdateOnModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const openEditModal = () => {
        setShowEditModal(true);
    };
    const closeEditModal = () => {
        setShowEditModal(false);
    };
    function updateUserDetails(e) {
        e.preventDefault();
        setLoading(true);
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/update-profile`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                firstName: firstNameOnModal,
                lastName: lastNameOnModal,
                email: emailOnModal,
                mobileNo: mobileNoOnModal,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.hasOwnProperty("message") && data.message === "User profile updated successfully") {
                    setLoading(false);
                    Swal.fire({
                        title: "User Profile Updated Successfully!",
                        icon: "success",
                        timer: 2000,
                        timerProgressBar: true,
                    });
                    getUserDetails(userId);
                    setShowEditModal(false);
                } else if (data.hasOwnProperty("error")) {
                    setLoading(false);
                    Swal.fire({
                        title: "User Profile Update Failed",
                        icon: "error",
                        text: data.error,
                    });
                } else {
                    setLoading(false);
                    Swal.fire({
                        title: "User Profile Update Failed",
                        icon: "error",
                        text: "Something went wrong. Please try again later or contact us for assistance",
                    });
                }
            })
            .catch((error) => {
                setLoading(false);
            });
    }
    useEffect(() => {
        if (firstNameOnModal !== "" && lastNameOnModal !== "" && emailOnModal !== "" && mobileNoOnModal !== "" && mobileNoOnModal.length === 11) {
            setAllowUpdateOnModal(true);
        } else {
            setAllowUpdateOnModal(false);
        }
    }, [firstNameOnModal, lastNameOnModal, emailOnModal, mobileNoOnModal]);
    useEffect(() => {
        setFirstNameOnModal(firstName);
        setLastNameOnModal(lastName);
        setEmailOnModal(email);
        setMobileNoOnModal(mobileNo);
    }, [showEditModal]);
    if (loading) {
        return (
            <Button variant="grey" className="mx-1" disabled>
                Loading...
            </Button>
        );
    }
    return (
        <>
            <Button variant="primary" className="mx-1" onClick={() => openEditModal()}>
                {text || "Edit User Details"}
            </Button>
            <Modal show={showEditModal} onHide={closeEditModal}>
                <Form onSubmit={(e) => updateUserDetails(e)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit User Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="firstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" value={firstNameOnModal} onChange={(e) => setFirstNameOnModal(e.target.value)} required />
                        </Form.Group>
                        <Form.Group controlId="lastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" value={lastNameOnModal} onChange={(e) => setLastNameOnModal(e.target.value)} required />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" value={emailOnModal} onChange={(e) => setEmailOnModal(e.target.value)} required />
                        </Form.Group>
                        <Form.Group controlId="mobileNo">
                            <Form.Label>Mobile Number</Form.Label>
                            <Form.Control type="number" value={mobileNoOnModal} onChange={(e) => setMobileNoOnModal(e.target.value)} required />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="grey" onClick={closeEditModal}>
                            Close
                        </Button>
                        {allowUpdateOnModal ? (
                            <Button variant="primary" type="submit">
                                Update User Profile
                            </Button>
                        ) : (
                            <Button variant="grey" type="submit" disabled>
                                Fill All Fields First
                            </Button>
                        )}
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}
