import React from "react";
import { useParams, Link } from "react-router-dom";
import { services } from "../data/ServiceData";
import "../styles/BlogDetails.css";

const BlogDetail = () => {
    const { id } = useParams();
    const service = services.find((s) => s.id === parseInt(id, 10));

    if (!service) return <h2>Dịch vụ không tồn tại</h2>;

    return (
        <>
            <div className="blog-detail">
                <div className="blog-content">
                    <div className="blog-text">
                        <h1>{service.title}</h1>
                        <p>{service.description}</p>
                        <Link to="/service" className="back-button">Quay lại</Link>

                    </div>

                    <div className="blog-image">
                        <img src={service.image} alt={service.title} />
                    </div>
                </div>
            </div>
            <div><Link to="/booking_page" className="booking-button">Đặt Lịch Ngay</Link></div>
        </>

    );
};

export default BlogDetail;
