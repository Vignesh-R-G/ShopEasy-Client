import Carousel from 'react-bootstrap/Carousel';
import { NavigationBar } from './Navbar';
import caro1 from '../images/caro1.jpg'
import caro3 from '../images/caro3.jpg'

export function Carouselimage() {
  return (
    <div style={{padding:"2px"}}>
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100 h-30"
          src={caro1}
          alt="Second slide"
          height="300"
        />
        <Carousel.Caption>
          <h3>Shop Easy</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 h-30"
          src={caro3}
          alt="Second slide"
          height="300"
        />
        <Carousel.Caption>
          <h3>Shop Easy</h3>
        </Carousel.Caption>
      </Carousel.Item>
      </Carousel>
    </div>
  );
}
