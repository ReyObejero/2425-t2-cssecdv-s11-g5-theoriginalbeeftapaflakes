import React from 'react';
import './Dulo.css';
import facebookIcon from '../../Assets/facebook.png';
import instagramIcon from '../../Assets/instagram.png';
import twitterIcon from '../../Assets/twitter.png';

const Dulo = () => {
  return (
    <div className='dulo'>
      <hr />
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About Us</h4>
            <p className="footer-subtext">Original, and the Best.</p>
          </div>
          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>Email: example@example.com</p>
          </div>
          <div className="footer-section">
            <h4>Frequently Asked Questions</h4>
            <p>Partners</p>
          </div>
          <div className="footer-section">
            <h4>Sponsors</h4>
            <p>Refund Policy</p>
          </div>
        </div>
        <div className="footer-icons">
          <img src={facebookIcon} alt="Facebook" className='footer-icon-small' />
          <img src={twitterIcon} alt="Twitter" className='footer-icon-small' />
          <img src={instagramIcon} alt="Instagram" className='footer-icon-small' />
        </div>
        <hr className="footer-line" />
        <div className="footer-bottom">
          <p>@ 2020 The Original Beef Tapa Flakes</p>
        </div>
      </footer>
    </div>
  )
}

export default Dulo;
