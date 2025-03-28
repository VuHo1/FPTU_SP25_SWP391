import './Footer.css';
import facebook from '../assets/images/logo/facebook.png';
import instagram from '../assets/images/logo/instagram.png';
import tiktok from '../assets/images/logo/tiktok.png';
import twitter from '../assets/images/logo/twitter.png';

const Footer = ({ darkMode }) => {
  return (
    <div className={`Footer ${darkMode ? 'dark' : ''}`}>
      <div className="sb_footer section-padding">
        <div className="sb_footer-links">
          {/* Company Information */}
          <div className="sb_footer-links_div">
            <h4>Company</h4>
            <a href="/about">
              <p>About Us</p>
            </a>
            <a href="/service">
              <p>Services</p>
            </a>
            <a href="/policy">
              <p>Policies & Terms</p>
            </a>
          </div>

          {/* User Resources */}
          <div className="sb_footer-links_div">
            <h4>Resources</h4>
            <a href="/booking_page">
              <p>Book an Appointment</p>
            </a>
            <a href="/profile">
              <p>Account Profile</p>
            </a>
            <a href="/history-transaction-user">
              <p>Transaction History</p>
            </a>
            <a href="/cart_page">
              <p>Shopping Cart</p>
            </a>
          </div>

          {/* Contact & Location */}
          <div className="sb_footer-links_div">
            <h4>Contact & Location</h4>
            <p>Visit us at:</p>
            <a href="https://maps.app.goo.gl/HKHFYHCucm71gAJH8" target="_blank" rel="noopener noreferrer">
              <p>Lưu Hữu Phước Tân Lập, Đông Hoà, Dĩ An, Bình Dương, Vietnam</p>
            </a>
            <div className="footer-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.927557259517!2d106.7533618!3d10.9532935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174dbba4b3165eb%3A0xbec8f27c4bbbba62!2zTMawdSBI4bunuSBQaMaw4bnbYyBUw6JuIEzhuq1wLCDEkMO0bmcgSMOyYSwgROG7uQAnbiwgQsOsbmggRMawxqFuZywgVmlldG5hbQ!5e0!3m2!1sen!2sus!4v1698765432100!5m2!1sen!2sus"
                width="300"
                height="200"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Our Location"
              ></iframe>
            </div>
            <a href="tel:+84359898301">
              <p>Phone: (+84) 359 898 301</p>
            </a>
            <a href="mailto:vuhhase162048@gmail.com">
              <p>Email: vuhhase162048@gmail.com</p>
            </a>
            <a href="/contact">
              <p>Contact Form</p>
            </a>
          </div>

          {/* Connect With Us */}
          <div className="sb_footer-links_div">
            <h4>Connect With Us</h4>
            <p>Follow us on social media:</p>
            <div className="social_media">
              <p>
                <a href="https://www.facebook.com/vu.ho.900388" target="_blank" rel="noopener noreferrer">
                  <img src={facebook} alt="Facebook" />
                </a>
              </p>
              <p>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                  <img src={instagram} alt="Instagram" />
                </a>
              </p>
              <p>
                <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer">
                  <img src={tiktok} alt="TikTok" />
                </a>
              </p>
              <p>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
                  <img src={twitter} alt="Twitter" />
                </a>
              </p>
            </div>
            <h4>Newsletter Signup</h4>
            <p>Stay updated with our latest offers:</p>
            
          </div>
        </div>

        <hr />

        <div className="sb_footer-below">
          <div className="sb_footer-copyright">
            <p>© {new Date().getFullYear()} Project_SWP391_SP25. All Rights Reserved.</p>
          </div>
          <div className="sb_footer-below-links">
            <a href="/policy">
              <div>
                <p>Terms & Conditions</p>
              </div>
            </a>
            <a href="/policy">
              <div>
                <p>Privacy Policy</p>
              </div>
            </a>
            <a href="/policy">
              <div>
                <p>Security Policy</p>
              </div>
            </a>
            <a href="/policy">
              <div>
                <p>Cookie Policy</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;