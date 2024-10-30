import Carousel from 'react-bootstrap/Carousel';
import '../styles/FeaturedProductsCarousel.css';

export default function FeaturedProductsCarousel() {
  return (
  <div className="carousel-container">
    <h1 className="feature">Featuring the roast with the most!</h1>
    <Carousel>
      <Carousel.Item className="item" interval={1000}>
        <img 
          src={`${process.env.PUBLIC_URL}/images/Arabica.jpg`} 
        />
        <Carousel.Caption>
          <h3>ARABICA</h3>
          <p>Sweet, fruity, and acidic with a smooth finish.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item className="item" interval={500}>
        <img 
          src={`${process.env.PUBLIC_URL}/images/Robusta.webp`} 
        />
        <Carousel.Caption>
          <h3>ROBUSTA</h3>
          <p>Strong, bitter, and earthy with a high caffeine content.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item className="item">
        <img 
          src={`${process.env.PUBLIC_URL}/images/Ethiopian.jpg`}
        />
        <Carousel.Caption>
          <h3>Ethiopian Yirgacheffe</h3>
          <p>Floral, fruity, with notes of berries and wine.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  </div>
);
}
