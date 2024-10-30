import { useState, useEffect } from "react";
import { Table, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import EditProductButton from "./EditProductButton";
import ProductStatusToggle from "./ProductStatusToggle";
export default function ManageProductsView({ productsData }) {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [filterText, setFilterText] = useState("");
    const sortedData = [...productsData].sort((a, b) => {
        if (sortConfig.key) {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === "ascending" ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === "ascending" ? 1 : -1;
            }
            return 0;
        }
        return 0;
    });
    const filteredData = sortedData.filter((item) => Object.values(item).some((value) => String(value).toLowerCase().includes(filterText.toLowerCase())));
    const handleSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        } else if (sortConfig.key === key && sortConfig.direction === "descending") {
            direction = "ascending";
        }
        setSortConfig({ key, direction });
    };
    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === "ascending" ? " ↑" : " ↓";
        }
        return null;
    };
    useEffect(() => {}, [productsData]);
    return (
        <div className="primary-section container-fluid p-5">
            <h1 className="text-center my-4"> Admin Dashboard</h1>
            <input type="text" placeholder="Filter" value={filterText} onChange={(e) => setFilterText(e.target.value)} style={{ marginBottom: "10px" }} />
            <Table striped bordered hover responsive variant="dark">
                <thead>
                    <tr>
                        <th onClick={() => handleSort("name")}>Name {getSortIcon("name")}</th>
                        <th onClick={() => handleSort("description")}>Description {getSortIcon("description")}</th>
                        <th onClick={() => handleSort("price")}>Price {getSortIcon("price")}</th>
                        <th onClick={() => handleSort("isActive")}>Availability {getSortIcon("isActive")}</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item, index) => (
                        <tr key={index}>
                            <td className="text-center">
                                <Link className="supressed-link" to={`/products/${item._id}`}>
                                    <Image src={`${item.imageLink}`} style={{ height: "auto", width: "15vw" }} onError={(e) => (e.target.src = `${process.env.PUBLIC_URL}/images/default-product.png`)} fluid />
                                    <p>{item.name}</p>
                                    <p>{item._id}</p>
                                </Link>
                            </td>
                            <td>
                                <p>{item.description}</p>
                                <em>{item.altDescription}</em>
                            </td>
                            <td>{item.price}</td>
                            <td className={item.isActive ? "text-success" : "text-danger"}>{item.isActive ? "Available" : "Unavailable"}</td>
                            <td className="text-center">
                                <EditProductButton product={item} text={"Edit"} productId={item._id} name={item.name} description={item.description} altDescription={item.altDescription} price={item.price} />
                                <ProductStatusToggle productId={item._id} isActive={item.isActive} textActive={"Archive"} textInactive={"Activate"} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
