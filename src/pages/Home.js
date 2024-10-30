//  User-Defined UI Components
import Banner from "../components/Banner";
import FeaturedProductsCarousel from "../components/FeaturedProductsCarousel";
import CoffeeProcess from "../components/CoffeeProcess";
import CustomerFeedback from "../components/CustomerFeedback";
/*
    Home page serves as the face of the application. It uses the Banner component to display its content.
*/
export default function Home() {
    const data = {
        title: "The Bean Counter",
        content: "Let’s turn those coffee beans into pure gold—one cup at a time!",
        destination: "/products",
        buttonLabel: "Browse & Brew",
    };
    return (
        <>
            <Banner data={data} />
            <FeaturedProductsCarousel products={FeaturedProductsCarousel} />
            <CoffeeProcess />
            <CustomerFeedback />
        </>
    );
}
