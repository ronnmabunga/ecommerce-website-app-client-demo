import { useEffect, useState, useContext } from "react";
import SessionContext from "../context/SessionContext";
import { Navigate } from "react-router-dom";
import { Container, Table } from "react-bootstrap";
import UserDataRow from "../components/users/UserDataRow";
import BeanGrowSpinner from "../components/BeanGrowSpinner";
export default function Users() {
    const { user } = useContext(SessionContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchData = () => {
        setLoading(true);
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/all`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
            });
    };
    let userRows = users.map((user) => <UserDataRow key={user._id} user={user} setLoading={setLoading} fetchData={fetchData} />);
    useEffect(() => {
        fetchData();
    }, [user]);
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <BeanGrowSpinner>
                    <span className="visually-hidden">Loading...</span>
                </BeanGrowSpinner>
            </div>
        );
    }
    return !(user.id && user.isAdmin) ? (
        <Navigate to={"/"} />
    ) : (
        <>
            <Container className="mx-auto">
                <h1 className="text-center my-4"> Manage Users</h1>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr className="text-center">
                            <th>Avatar</th>
                            <th>User ID</th>
                            <th>Full Name</th>
                            <th>Authorization</th>
                            <th>Grant Admin Status</th>
                        </tr>
                    </thead>
                    <tbody>{userRows}</tbody>
                </Table>
            </Container>
        </>
    );
}
