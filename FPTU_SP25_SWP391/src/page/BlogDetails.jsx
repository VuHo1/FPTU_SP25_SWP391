// BlogDetail.jsx (unchanged)
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { services } from "../data/ServiceData";
import "../styles/BlogDetails.css";
import { useAuth } from "../page/AuthContext";

const BlogDetail = ({ darkMode }) => {
    const { id } = useParams();
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const service = services.find((s) => s.id === parseInt(id, 10));

    if (!service) return <h2>Dịch vụ không tồn tại</h2>;

    const handleBookingClick = () => {
        if (isLoggedIn) {
            navigate("/booking_page");
        } else {
            navigate("/sign_in", { state: { from: `/service/${id}` } });
        }
    };

    return (
        <div className={`blog-detail ${darkMode ? "dark" : ""}`}>
            <div className="blog-content">
                <div className="blog-text">
                    <h1>{service.title}</h1>
                    <p>{service.description}</p>
                    <Link to="/service" className="back-button">
                        Quay lại
                    </Link>
                </div>
                <div className="blog-image">
                    <img src={service.image} alt={service.title} />
                </div>
            </div>
            <div>
                <button 
                    onClick={handleBookingClick}
                    className="booking-button"
                >
                    Đặt Lịch Ngay
                </button>
            </div>
        </div>
    );
};

export default BlogDetail;