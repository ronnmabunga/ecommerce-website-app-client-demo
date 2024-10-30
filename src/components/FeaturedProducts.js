import { CardGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
import PreviewProducts from "./products/PreviewProducts";

export default function FeaturedProducts() {
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        fetch("http://ec2-3-142-164-9.us-east-2.compute.amazonaws.com/b5/Products/")
            .then((res) => res.json())
            .then((data) => {
                // console.log(data);

                const numbers = [];
                const featured = [];

                const generateRandomNums = () => {
                    let randomNum = Math.floor(Math.random() * data.length);

                    if (numbers.indexOf(randomNum) === -1) {
                        numbers.push(randomNum);
                    } else {
                        generateRandomNums();
                    }
                };

                for (let i = 0; i < 5; i++) {
                    generateRandomNums();

                    featured.push(<PreviewProducts data={data[numbers[i]]} key={data[numbers[i]]._id} breakPoint={2} />);
                }

                setPreviews(featured);
            });
    }, []);

    return (
        <>
            <h2 className="text-center">Featured Products</h2>
            <CardGroup className="justify-content-center">{previews}</CardGroup>
        </>
    );
}
