import { Image, Button } from "react-bootstrap";
import Swal from "sweetalert2";

export default function UserDataRow({ user, setLoading, fetchData }) {
    const setAsAdmin = (userId) => {
        setLoading(true);
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${userId}/set-as-admin`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.hasOwnProperty("message")) {
                    Swal.fire({
                        title: data.message,
                        icon: "success",
                        timer: 2000,
                        timerProgressBar: true,
                        // willClose: () => {
                        //     window.location.reload();
                        // },
                    });
                    fetchData();
                } else if (data.hasOwnProperty("error")) {
                    Swal.fire({
                        title: "Admin Access Grant Failed",
                        icon: "error",
                        text: data.error,
                    });
                } else {
                    Swal.fire({
                        title: "Admin Access Grant Failed",
                        icon: "error",
                        text: "Something went wrong. Please try again later or contact us for assistance",
                    });
                }
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
            });
    };
    return (
        <>
            <tr>
                <td>
                    <Image
                        src={`${user.imageLink}`}
                        style={{ maxHeight: "5vh" }}
                        onError={(e) => {
                            e.target.src = `${process.env.PUBLIC_URL}/images/default-user.png`;
                        }}
                    />
                </td>
                <td>{user._id}</td>
                <td>
                    {user.firstName} {user.lastName}
                </td>
                <td>{user.isAdmin ? "Administrator" : "Regular User"}</td>
                <td>{user.isAdmin ? "Already an Admin" : <Button onClick={() => setAsAdmin(user._id)}>Grant Admin Access</Button>}</td>
            </tr>
        </>
    );
}
