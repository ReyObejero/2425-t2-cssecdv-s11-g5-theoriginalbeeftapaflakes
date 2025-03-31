import React from 'react'
import AboutInfo from '../../AboutInfo/AboutInfo.jsx';
import Dulo from '../../Footer/Dulo.jsx'
import './About.css';

const About = () => {
  return (
    <div className="about-container">
			<AboutInfo />
      <Dulo/>
		</div>
  )
}

export default About