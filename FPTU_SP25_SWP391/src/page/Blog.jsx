import React from "react";
import { Link } from "react-router-dom";
import "../styles/Blog.css";
import { services } from '../data/ServiceData';

const Blog = () => {
    return (
        <div className="blog-container">
            <h1 className="blog-title">Trung Tâm Tư Vấn Chăm Sóc Da</h1>
            <p className="blog-description">
                Khám phá các dịch vụ chăm sóc da và làm đẹp chuyên nghiệp của chúng tôi.
            </p>
            <div className="service-list">
                {services.map((service) => (
                    <Link to={`/blog/${service.id}`} key={service.id} className="service-item">
                        <img src={service.image} alt={service.title} className="service-image" />
                        <div className="service-content">
                            <h2>{service.title}</h2>
                            <p>{service.description.length > 80 ? service.description.substring(0, 80) + "..." : service.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Blog;
