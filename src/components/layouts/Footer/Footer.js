import React from "react";
import Logo from "../../../assests/images/Logo.png";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img src={Logo} alt="EduPNV" className="footer-logo-img"/>
              <span className="footer-logo-text">STUDEEFLOW</span>
            </div>
            <p className="footer-description"> Track your progress, reflect your growth. </p>
          </div>
          <div className="footer-section">
            <div className="section-title">Our team</div>
            <ul>
              <li>Kỳ Ba</li>
              <li>Kim Sa</li>
              <li>Mai Trâm</li>
              <li>Thị Tiếp</li>
              <li>Gia Toàn</li>
            </ul>
          </div>
          <div className="footer-section">
            <div className="section-title">Pages</div>
            <ul>
              <li><Link to='/student/home'>Home</Link></li>
              <li><Link to='/student/classroom'>Classroom</Link></li>
              <li><Link to='/student/profile'>Profile</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <div className="section-title">Your role</div>
            <ul>
              <li><Link to='/teacher/home'>Teacher</Link></li>
              <li><Link to='/student/home'>Student</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <div className="section-title">Contact</div>
            <p>Call: +8423456789</p>
            <p>Studeeflow@gmail.com</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
