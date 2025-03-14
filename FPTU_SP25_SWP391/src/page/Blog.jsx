import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEnvelope,
  faStar,
  faFilter,
  faDollarSign,
  faSortAlphaDown,
  faSortAlphaUp,
} from "@fortawesome/free-solid-svg-icons";
import { getServiceCategories, getAllServices } from "../api/testApi";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState(""); // New state for sorting

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      try {
        const [categoriesResponse, servicesResponse] = await Promise.all([
          getServiceCategories(token),
          getAllServices(token),
        ]);
        setCategories(categoriesResponse.data || []);
        setServices(servicesResponse.data || []);
      } catch (err) {
        if (!token || err.response?.status === 401) {
          try {
            const [categoriesResponse, servicesResponse] = await Promise.all([
              getServiceCategories(null),
              getAllServices(null),
            ]);
            setCategories(categoriesResponse.data || []);
            setServices(servicesResponse.data || []);
          } catch (publicErr) {
            setError(`Failed to load services: ${publicErr.message}`);
          }
        } else {
          setError(`Failed to load services: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort services
  const filteredAndSortedServices = () => {
    let result = services.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.description &&
          service.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory =
        filterCategory === "all" ||
        service.serviceCategoryId ===
          categories.find((cat) => cat.name === filterCategory)?.serviceCategoryId;
      return matchesSearch && matchesCategory;
    });

    // Sorting logic
    switch (sortOption) {
      case "priceLowToHigh":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "priceHighToLow":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "nameAZ":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameZA":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      // Add rating sorting if dynamic ratings are available
      // case "ratingHighToLow":
      //   result.sort((a, b) => (b.rating || 5) - (a.rating || 5));
      //   break;
      default:
        break;
    }

    return result;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const scrollVariants = {
    animate: {
      x: [0, -1200], // Adjusted for smoother scroll
      transition: {
        x: { repeat: Infinity, repeatType: "loop", duration: 25, ease: "linear" },
      },
    },
  };

  const filterBarVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <style>{`
        .service-page {
          min-height: 100vh;
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%);
          font-family: 'Poppins', sans-serif;
          position: relative;
          overflow-x: hidden;
        }
        .service-header {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        .service-title {
          font-size: 2.8rem;
          font-weight: 700;
          color: #1a2b49;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .service-description {
          font-size: 1.3rem;
          color: #5a6a87;
          max-width: 900px;
          margin: 0 auto;
          line-height: 1.7;
        }
        .scroll-section {
          overflow: hidden;
          margin-bottom: 3rem;
          background: #fff;
          padding: 1.5rem 0;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        .scroll-container {
          display: flex;
          white-space: nowrap;
        }
        .scroll-item {
          flex: 0 0 auto;
          width: 280px;
          margin-right: 1.5rem;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease;
        }
        .scroll-item:hover {
          transform: scale(1.05);
        }
        .scroll-image {
          width: 100%;
          height: 160px;
          object-fit: cover;
        }
        .scroll-content {
          padding: 1rem;
          text-align: center;
        }
        .scroll-content h3 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1a2b49;
          margin-bottom: 0.5rem;
        }
        .service-controls {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
          align-items: center;
          background: rgba(255, 255, 255, 0.95);
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        .search-container {
          position: relative;
          width: 100%;
          max-width: 450px;
        }
        .search-icon {
          position: absolute;
          left: 1.2rem;
          top: 50%;
          transform: translateY(-50%);
          color: #5a6a87;
          font-size: 1.3rem;
        }
        .search-input {
          width: 100%;
          padding: 0.9rem 1rem 0.9rem 3.5rem;
          border: 2px solid #d1d9e6;
          border-radius: 30px;
          font-size: 1rem;
          color: #1a2b49;
          outline: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .search-input:focus {
          border-color: #1abc9c;
          box-shadow: 0 0 10px rgba(26, 188, 156, 0.2);
        }
        .filter-select, .sort-select {
          padding: 0.9rem 1.5rem;
          border: 2px solid #d1d9e6;
          border-radius: 30px;
          font-size: 1rem;
          color: #1a2b49;
          background: #fff;
          cursor: pointer;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .filter-select:focus, .sort-select:focus {
          border-color: #1abc9c;
          box-shadow: 0 0 10px rgba(26, 188, 156, 0.2);
          outline: none;
        }
        .contact-btn {
          padding: 0.9rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          background: #1abc9c;
          border: none;
          border-radius: 30px;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .contact-btn:hover {
          background: #16a085;
          transform: translateY(-3px);
        }
        .service-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2.5rem;
          max-width: 1300px;
          margin: 0 auto;
        }
        .service-item {
          text-decoration: none;
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .service-item:hover {
          transform: translateY(-12px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
        }
        .service-image-wrapper {
          position: relative;
          width: 100%;
          height: 220px;
          overflow: hidden;
        }
        .service-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .service-item:hover .service-image {
          transform: scale(1.08);
        }
        .service-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .service-item:hover .service-overlay {
          opacity: 1;
        }
        .service-overlay span {
          color: #fff;
          font-size: 1.3rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        .service-content {
          padding: 1.8rem;
          text-align: center;
        }
        .service-content h2 {
          font-size: 1.6rem;
          font-weight: 600;
          color: #1a2b49;
          margin-bottom: 0.6rem;
        }
        .service-content .price {
          font-size: 1.3rem;
          color: #1abc9c;
          font-weight: 500;
          margin-bottom: 0.6rem;
        }
        .service-content .rating {
          color: #f39c12;
          font-size: 1.1rem;
        }
        .loading, .error {
          text-align: center;
          font-size: 1.3rem;
          color: #5a6a87;
          padding: 2.5rem;
        }
        .error {
          color: #e74c3c;
        }
        .filter-bar {
          position: fixed;
          top: 5rem;
          left: 2rem;
          width: 220px;
          background: rgba(255, 255, 255, 0.95);
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }
        .filter-bar h4 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1a2b49;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        @media (max-width: 768px) {
          .service-title {
            font-size: 2.2rem;
          }
          .service-description {
            font-size: 1.1rem;
          }
          .service-controls {
            flex-direction: column;
            padding: 1rem;
          }
          .search-container, .filter-select, .contact-btn {
            width: 100%;
            max-width: 100%;
          }
          .service-list {
            grid-template-columns: 1fr;
          }
          .scroll-item {
            width: 220px;
          }
          .filter-bar {
            position: static;
            width: 100%;
            margin: 0 auto 2rem;
            left: 0;
          }
        }
      `}</style>

      <div className="service-page">
        {/* Filter Bar */}
        <motion.div
          className="filter-bar"
          variants={filterBarVariants}
          initial="hidden"
          animate="visible"
        >
          <h4>
            <FontAwesomeIcon icon={faFilter} /> Bộ Lọc
          </h4>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-select"
          >
            <option value="">Sắp xếp mặc định</option>
            <option value="priceLowToHigh">
              Giá: Thấp đến Cao <FontAwesomeIcon icon={faDollarSign} />
            </option>
            <option value="priceHighToLow">
              Giá: Cao đến Thấp <FontAwesomeIcon icon={faDollarSign} />
            </option>
            <option value="nameAZ">
              Tên: A-Z <FontAwesomeIcon icon={faSortAlphaDown} />
            </option>
            <option value="nameZA">
              Tên: Z-A <FontAwesomeIcon icon={faSortAlphaUp} />
            </option>
            {/* Uncomment if dynamic ratings are added */}
            {/* <option value="ratingHighToLow">Đánh giá: Cao đến Thấp <FontAwesomeIcon icon={faStar} /></option> */}
          </select>
        </motion.div>

        <motion.div
          className="service-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="service-title">Trung Tâm Tư Vấn Chăm Sóc Da</h1>
          <p className="service-description">
            Khám phá các dịch vụ chăm sóc da và làm đẹp chuyên nghiệp của chúng tôi với chất lượng hàng đầu.
          </p>
        </motion.div>

        {!loading && !error && services.length > 0 && (
          <div className="scroll-section">
            <motion.div
              className="scroll-container"
              variants={scrollVariants}
              animate="animate"
            >
              {services.slice(0, 5).map((service) => (
                <div className="scroll-item" key={service.serviceId}>
                  <img
                    src={service.image || "https://via.placeholder.com/280x160"}
                    alt={service.name}
                    className="scroll-image"
                  />
                  <div className="scroll-content">
                    <h3>{service.name}</h3>
                  </div>
                </div>
              ))}
              {services.slice(0, 5).map((service) => (
                <div className="scroll-item" key={`dup-${service.serviceId}`}>
                  <img
                    src={service.image || "https://via.placeholder.com/280x160"}
                    alt={service.name}
                    className="scroll-image"
                  />
                  <div className="scroll-content">
                    <h3>{service.name}</h3>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        )}

        <motion.div
          className="service-controls"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
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
            <option value="all">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.serviceCategoryId} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <Link to="/contact" className="contact-btn">
            <FontAwesomeIcon icon={faEnvelope} /> Liên hệ chúng tôi
          </Link>
        </motion.div>

        {loading ? (
          <div className="loading">Đang tải dịch vụ...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <motion.div
            className="service-list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredAndSortedServices().length === 0 ? (
              <div className="error">Không tìm thấy dịch vụ nào phù hợp.</div>
            ) : (
              filteredAndSortedServices().map((service) => (
                <motion.div key={service.serviceId} variants={itemVariants}>
                  <Link to={`/service/${service.serviceId}`} className="service-item">
                    <div className="service-image-wrapper">
                      <img
                        src={service.image || "https://via.placeholder.com/320x220"}
                        alt={service.name}
                        className="service-image"
                      />
                      <div className="service-overlay">
                        <span>Xem chi tiết</span>
                      </div>
                    </div>
                    <div className="service-content">
                      <h2>{service.name}</h2>
                      <p className="price">${service.price || "N/A"}</p>
                      <div className="rating">
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Blog;