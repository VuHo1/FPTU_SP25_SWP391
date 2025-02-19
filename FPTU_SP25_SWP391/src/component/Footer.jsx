import './Footer.css'
import facebook from '../assets/images/logo/facebook.png'
import instagram from '../assets/images/logo/instagram.png'
import tiktok from '../assets/images/logo/tiktok.png'
import twitter from '../assets/images/logo/twitter.png'


const Footer = () => {
    return (
        <div className="Footer">
            <div className="sb_footer section-padding">

                <div className="sb_footer-links">
                    <div className='sb_footer-links_div'>
                        <h4>About</h4>
                        <a href="/">
                            <p>Our Service</p>
                        </a>
                        <a href="/">
                            <p>Our Team</p>
                        </a>
                        <a href="/">
                            <p>Testimonials</p>
                        </a>
                    </div>
                    <div className='sb_footer-links_div'>
                        <h4>Booking</h4>
                        <a href="/">
                            <p>Book Now</p>
                        </a>
                        <a href="/">
                            <p>Check Availability</p>
                        </a>
                        <a href="/">
                            <p>Cancellation Policy</p>
                        </a>
                    </div>
                    <div className='sb_footer-links_div'>
                        <h4>Adress & Contact</h4>
                        <a href="/">
                            <p>Lưu Hữu Phước Tân Lập, Đông Hoà, Dĩ An, Bình Dương, Việt Nam </p>
                        </a>
                        <a href="/">
                            <p>03xxxxxxx25 </p>
                        </a>
                        <a href="/">
                            <p>asbasdad@gmail.com </p>
                        </a>
                    </div>
                    <div className='sb_footer-links_div'>
                        <h4>Comming soon on </h4>
                        <div className='social_media'>
                            <p> <img src= {facebook} alt="" /> </p>
                            <p> <img src={instagram} alt="" /> </p>
                            <p> <img src={tiktok} alt="" /> </p>
                            <p> <img src={twitter} alt="" /> </p>
                        </div>
                    </div>
                </div>

                <hr></hr>

                <div className='sb_footer-below'>
                    <div className='sb_footer-coppyright'>
                        <p>
                            @{new Date().getFullYear()} SWP391 NET1804 Group_5.
                        </p>
                    </div>
                    <div className='sb_footer-below-links'>
                        <a href="/terms"> <div> <p>Terms & conditions</p> </div></a>
                        <a href="/"> <div> <p>Privacy</p> </div></a>
                        <a href="/"> <div> <p>Security</p> </div></a>
                        <a href="/"> <div> <p>Cookie Declaration</p> </div></a>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default Footer