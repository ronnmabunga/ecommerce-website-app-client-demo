import { useContext } from "react";
import SessionContext from "../context/SessionContext";
import ManageProductsView from "../components/products/ManageProductsView";
import ProductsCatalogView from "../components/products/ProductsCatalogView";
import BeanGrowSpinner from "../components/BeanGrowSpinner";
export default function Products() {
    const { user, loading, productsData } = useContext(SessionContext);
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <BeanGrowSpinner>
                    <span className="visually-hidden">Loading...</span>
                </BeanGrowSpinner>
            </div>
        );
    }
    return user.isAdmin ? <ManageProductsView productsData={productsData} /> : <ProductsCatalogView productsData={productsData} />;
}
