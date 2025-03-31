import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper/core';
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';

import 'swiper/swiper-bundle.css';
import './Testimony.css';

import pfp from '../../Assets/user.png'; 

SwiperCore.use([Navigation]);

const Testimony = () => {
  const testimonies = [
    { name: 'Jason Statham', comment: 'Comment 1', image: pfp },
    { name: 'Hoy Buloy', comment: 'Comment 2', image: pfp },
    { name: 'Rico Yan', comment: 'Comment 3', image: pfp },
  ];

  return (
    <div className="testimony-container">
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        centeredSlides={true}
        navigation
        pagination={{ clickable: true }}
        className="swiper-container"
      >
        {testimonies.map((testimony, index) => (
          <SwiperSlide key={index} className="swiper-slide">
            <div className="card">
              <img src={testimony.image} alt={testimony.name} className="card-image" />
              <div className="card-content">
                <h2 className="card-name">{testimony.name}</h2>
                <p className="card-comment">{testimony.comment}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Testimony;
