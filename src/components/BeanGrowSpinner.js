export default function BeanGrowSpinner() {
    return (
        <div className="text-center">
            <img src={`${process.env.PUBLIC_URL}/images/bean.png`} alt="Loading" className="custom-grow-spinner" />
        </div>
    );
}
