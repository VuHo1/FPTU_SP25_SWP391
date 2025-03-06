// Blog.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Blog.css";
import { services } from '../data/ServiceData';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Blog = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");

    // Assuming services have a category property - you'll need to add this to your ServiceData
    const categories = ["all", ...new Set(services.map(service => service.category || "Uncategorized"))];

    const filteredServices = services.filter(service => {
        const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            service.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "all" || service.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="blog-container">
            <div className="blog-header">
                <h1 className="blog-title">Trung Tâm Tư Vấn Chăm Sóc Da</h1>
                <p className="blog-description">
                    Khám phá các dịch vụ chăm sóc da và làm đẹp chuyên nghiệp của chúng tôi
                </p>
            </div>

            <div className="blog-controls">
                <div className="search-container">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm dịch vụ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="filter-select"
                >
                    {categories.map(category => (
                        <option key={category} value={category}>
                            {category === "all" ? "Tất cả danh mục" : category}
                        </option>
                    ))}
                </select>
            </div>

            <div className="service-list">
                {filteredServices.map((service, index) => (
                    <Link 
                        to={`/service/${service.id}`} 
                        key={service.id} 
                        className="service-item"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="service-image-wrapper">
                            <img src={service.image} alt={service.title} className="service-image" />
                            <div className="service-overlay">
                                <span>Xem chi tiết</span>
                            </div>
                        </div>
                        <div className="service-content">
                            <h2>{service.title}</h2>
                            <p>{service.description.length > 80 
                                ? service.description.substring(0, 80) + "..." 
                                : service.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Blog;