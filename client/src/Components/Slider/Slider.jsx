import React, { useState, useEffect } from 'react';
import './Slider.css';
import slide1 from '../../Assets/slide1.JPG';
import slide2 from '../../Assets/slide2.JPG';
import slide3 from '../../Assets/slide3.jpg';

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [slide1, slide2, slide3];
  const texts = ['Original.', 'Beefy.', 'Flakey.'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 20000); 

    return () => clearInterval(timer); 
  }, [images.length]);

  return (
    <div className="slider-container"> 
      <div className="slider">
        <div className="list">
          {images.map((image, index) => (
            <div className={`item ${index === currentIndex ? 'active' : ''}`} key={index}>
              <img src={image} alt={`Slide ${index + 1}`} className="slide" />
              {(index === 0) && (
                <div className={`slide-text ${index === 2 ? 'right' : ''}`}> 
                  <p className="small-text">THE ORIGINAL</p>
                  <p className="bold-text">BEEF TAPA</p>
                  <p className="count-text">FLAKES.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
