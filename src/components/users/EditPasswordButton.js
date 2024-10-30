import { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";

export default function EditPasswordButton() {
    const [oldPasswordOnModal, setOldPasswordOnModal] = useState("");
    const [newPasswordOnModal, setNewPasswordOnModal] = useState("");
    const [confirmNewPasswordOnModal, setConfirmNewPasswordOnModal] = useState("");
    const [allowUpdateOnModal, setAllowUpdateOnModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const openEditModal = () => {
        setShowEditModal(true);
    };
    const closeEditModal = () => {
        setShowEditModal(false);
        setOldPasswordOnModal("");
        setNewPasswordOnModal("");
        setConfirmNewPasswordOnModal("");
    };
    function updateUserPassword(e) {
        e.preventDefault();
        setLoading(true);
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/update-password`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                oldPassword: oldPasswordOnModal,
                newPassword: newPasswordOnModal,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.hasOwnProperty("message") && data.message === "Password reset successfully") {
                    setLoading(false);
                    Swal.fire({
                        title: "Password Updated Successfully!",
                        icon: "success",
                        timer: 2000,
                        timerProgressBar: true,
                    });
                    setShowEditModal(false);
                    setOldPasswordOnModal("");
                    setNewPasswordOnModal("");
                    setConfirmNewPasswordOnModal("");
                } else if (data.hasOwnProperty("error")) {
                    setLoading(false);
                    Swal.fire({
                        title: "Password Update Failed",
                        icon: "error",
                        text: data.error,
                    });
                } else {
                    setLoading(false);
                    Swal.fire({
                        title: "Password Update Failed",
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
        if (oldPasswordOnModal !== "" && newPasswordOnModal !== "" && confirmNewPasswordOnModal !== "" && newPasswordOnModal.length >= 8 && newPasswordOnModal === confirmNewPasswordOnModal) {
            setAllowUpdateOnModal(true);
        } else {
            setAllowUpdateOnModal(false);
        }
    }, [newPasswordOnModal, confirmNewPasswordOnModal, oldPasswordOnModal]);
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
                Update Password
            </Button>
            <Modal show={showEditModal} onHide={closeEditModal}>
                <Form onSubmit={(e) => updateUserPassword(e)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Change Password</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="oldPassword">
                            <Form.Label>Enter Current Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter Current Password" value={oldPasswordOnModal} onChange={(e) => setOldPasswordOnModal(e.target.value)} required />
                        </Form.Group>
                        <Form.Group controlId="newPassword">
                            <Form.Label>Enter New Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter New Password (must be at least 8 characters long)" value={newPasswordOnModal} onChange={(e) => setNewPasswordOnModal(e.target.value)} required />
                        </Form.Group>
                        <Form.Group controlId="confirmNewPassword">
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control type="password" placeholder="Confirm New Password" value={confirmNewPasswordOnModal} onChange={(e) => setConfirmNewPasswordOnModal(e.target.value)} required />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeEditModal}>
                            Close
                        </Button>
                        {allowUpdateOnModal ? (
                            <Button variant="primary" type="submit">
                                Change Password
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
