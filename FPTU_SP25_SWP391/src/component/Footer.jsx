import './Footer.css'
import facebook from '../assets/images/logo/facebook.png'
import instagram from '../assets/images/logo/instagram.png'
import tiktok from '../assets/images/logo/tiktok.png'
import twitter from '../assets/images/logo/twitter.png'


const Footer = ({ darkMode }) => {

    return (
        <div className={`Footer ${darkMode ? 'dark' : ''}`} >
            <div className="sb_footer section-padding">

                <div className="sb_footer-links">
                    <div className='sb_footer-links_div'>
                        <a href="/about" >
                            <p>About</p></a>
                        <a href="/service">
                            <p>Our Service</p>
                        </a>

                    </div>
                    <div className='sb_footer-links_div'>

                        <a href="/booking_page">
                            <p>Book Now</p>
                        </a>

                    </div>
                    <div className='sb_footer-links_div'>
                        <a href="/contact">
                            <p>Adress & Contact</p></a>
                        <a href="/contact">
                            <p>Lưu Hữu Phước Tân Lập, Đông Hoà, Dĩ An, Bình Dương, Việt Nam </p>
                        </a>
                        <a href="/">
                            <p>0359898301 </p>
                        </a>
                        <a href="/">
                            <p>vuhhase162048@gmail.com </p>
                        </a>
                    </div>
                    <div className='sb_footer-links_div'>
                        <h4>Comming soon on </h4>
                        <div className='social_media'>
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

                    </div>
                </div>

                <hr></hr>

                <div className='sb_footer-below'>
                    <div className='sb_footer-coppyright'>
                        <p>
                            @{new Date().getFullYear()} Project_SWP391_SP25
                        </p>
                    </div>
                    <div className='sb_footer-below-links'>
                        <a href="/policy"> <div> <p>Terms & conditions</p> </div></a>
                        <a href="/policy"> <div> <p>Privacy</p> </div></a>
                        <a href="/policy"> <div> <p>Security</p> </div></a>
                    </div>
                </div>

            </div>
        </div >
    )
}
export default Footer