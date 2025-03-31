import React from 'react';
import './Testimony.css'; 
import userpic from '../../Assets/user.png'

const Testimony = () => {
  const testimonials = Array(5).fill({
    name: "John Doe",
    review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  });

  return (
    <div className="testimony-container">
      <div className="left-image-container"></div>
      <div className="right-image-container"></div>
      {testimonials.map((testimonial, index) => (
        <section className="testimonials" key={index}>
          <img src={userpic} alt="User" className="user-pic"/>
          <div className="testimony-box">
            <h3 className="user-name">{testimonial.name}</h3>
            <div className="testimony-text">
              {testimonial.review}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

export default Testimony;
