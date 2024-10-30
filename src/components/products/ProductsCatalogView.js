import ProductCard from "./ProductCard";
export default function ProductsCatalogView({ productsData }) {
    return (
        <div className="primary-section container-fluid py-5">
            <div class="row d-flex justify-content-center flex-lg-row-reverse">
                {productsData.map((product) => (
                    <div className="col-10 col-md-5 products-catalog-card-container m-3" key={product._id} md={3}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}
