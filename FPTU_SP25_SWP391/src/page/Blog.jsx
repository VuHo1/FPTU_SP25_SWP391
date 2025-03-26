import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  faClock,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { getServiceCategories, getAllServices, getImageService } from "../api/testApi";

const ServicesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriceRange, setFilterPriceRange] = useState("all");
  const [sortOption, setSortOption] = useState("");
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 9;

  const location = useLocation();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    try {
      const [categoriesResponse, servicesResponse] = await Promise.all([
        getServiceCategories(token),
        getAllServices(token),
      ]);
      const categoriesData = categoriesResponse.data || [];
      const servicesData = servicesResponse.data || [];
      setCategories(categoriesData);

      // Adjust service status based on category status
      const adjustedServices = servicesData.map((service) => {
        const category = categoriesData.find(
          (cat) => cat.serviceCategoryId === service.serviceCategoryId
        );
        return {
          ...service,
          effectiveStatus: category?.status === false ? false : service.status, // Sync with category status
        };
      });

      const imagePromises = adjustedServices.map((service) =>
        getImageService(service.serviceId, token)
          .then((res) => ({
            serviceId: service.serviceId,
            images: (res.data || []).map((img, index) => ({
              imageServiceId: img.imageServiceId,
              imageURL: img.imageURL,
              isMain: index === 0, // Default first image as main
            })),
          }))
          .catch(() => ({
            serviceId: service.serviceId,
            images: [],
          }))
      );
      const imageResults = await Promise.all(imagePromises);
      const imageMap = imageResults.reduce((acc, { serviceId, images }) => {
        acc[serviceId] = images;
        return acc;
      }, {});

      const updatedServices = adjustedServices.map((service) => ({
        ...service,
        imageUrl:
          imageMap[service.serviceId]?.find((img) => img.isMain)?.imageURL ||
          imageMap[service.serviceId]?.[0]?.imageURL ||
          null,
      }));
      setServices(updatedServices);
    } catch (err) {
      if (!token || err.response?.status === 401) {
        try {
          const [categoriesResponse, servicesResponse] = await Promise.all([
            getServiceCategories(null),
            getAllServices(null),
          ]);
          const categoriesData = categoriesResponse.data || [];
          const servicesData = servicesResponse.data || [];
          setCategories(categoriesData);

          const adjustedServices = servicesData.map((service) => {
            const category = categoriesData.find(
              (cat) => cat.serviceCategoryId === service.serviceCategoryId
            );
            return {
              ...service,
              effectiveStatus: category?.status === false ? false : service.status,
            };
          });

          const imagePromises = adjustedServices.map((service) =>
            getImageService(service.serviceId, null)
              .then((res) => ({
                serviceId: service.serviceId,
                images: (res.data || []).map((img, index) => ({
                  imageServiceId: img.imageServiceId,
                  imageURL: img.imageURL,
                  isMain: index === 0,
                })),
              }))
              .catch(() => ({
                serviceId: service.serviceId,
                images: [],
              }))
          );
          const imageResults = await Promise.all(imagePromises);
          const imageMap = imageResults.reduce((acc, { serviceId, images }) => {
            acc[serviceId] = images;
            return acc;
          }, {});

          const updatedServices = adjustedServices.map((service) => ({
            ...service,
            imageUrl:
              imageMap[service.serviceId]?.find((img) => img.isMain)?.imageURL ||
              imageMap[service.serviceId]?.[0]?.imageURL ||
              null,
          }));
          setServices(updatedServices);
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

  useEffect(() => {
    fetchData();
  }, [location.pathname]);

  const filteredAndSortedServices = () => {
    let result = services.filter((service) => {
      // Only include services with effectiveStatus === true
      const isActive = service.effectiveStatus === true;
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.description &&
          service.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory =
        filterCategory === "all" ||
        service.serviceCategoryId ===
        categories.find((cat) => cat.name === filterCategory)?.serviceCategoryId;
      const price = service.price || 0;
      const matchesPriceRange =
        filterPriceRange === "all" ||
        (filterPriceRange === "0-500000" && price <= 500000) ||
        (filterPriceRange === "500001-1000000" && price > 500000 && price <= 1000000) ||
        (filterPriceRange === "1000001+" && price > 1000000);
      return isActive && matchesSearch && matchesCategory && matchesPriceRange;
    });

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
      case "durationLowToHigh":
        result.sort((a, b) => (a.duration || 0) - (b.duration || 0));
        break;
      default:
        break;
    }

    return result;
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return `${price.toLocaleString("vi-VN")} ₫`;
  };

  const allServices = filteredAndSortedServices();
  const totalPages = Math.ceil(allServices.length / servicesPerPage);
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = allServices.slice(indexOfFirstService, indexOfLastService);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const filterBarVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        .services-page {
          min-height: 100vh;
          padding: 3rem 2rem;
          background: #f9fafb;
          font-family: 'Poppins', sans-serif;
          position: relative;
          overflow-x: hidden;
        }
        .services-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          flex-direction: row;
          gap: 3rem;
        }
        .service-header {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem 0;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        .service-title {
          font-size: 2.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
          letter-spacing: 1px;
        }
        .service-description {
          font-size: 1.2rem;
          color: #6b7280;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .service-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 3rem;
          padding: 1rem 2rem;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          flex-wrap: wrap;
        }
        .search-container {
          position: relative;
          flex-grow: 1;
          max-width: 600px;
        }
        .search-icon {
          position: absolute;
          left: 1.2rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          font-size: 1.2rem;
        }
        .search-input {
          width: 100%;
          padding: 1rem 1.5rem 1rem 3.5rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          color: #1f2937;
          background: #fff;
          outline: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .search-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.2);
        }
        .QA-btn {
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          background: #3b82f6;
          border: none;
          border-radius: 8px;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .QA-btn:hover {
          background: #2563eb;
          transform: translateY(-2px);
        }
        .service-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }
        .service-item {
          text-decoration: none;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .service-item:hover {
          transform: translateY(-8px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }
        .service-image-wrapper {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
        }
        .service-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .service-item:hover .service-image {
          transform: scale(1.05);
        }
        .service-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
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
          color: #ffffff;
          font-size: 1.2rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .service-content {
          padding: 1.5rem;
          text-align: left;
        }
        .service-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        .service-content .price {
          font-size: 1.2rem;
          color: #3b82f6;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        .service-content .rating {
          color: #f59e0b;
          font-size: 1.1rem;
        }
        .loading, .error {
          text-align: center;
          font-size: 1.2rem;
          color: #6b7280;
          padding: 2rem;
        }
        .error {
          color: #ef4444;
        }
        .filter-bar {
          width: 300px;
          background: #ffffff;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
          position: sticky;
          top: 3rem;
          height: fit-content;
          z-index: 1000;
        }
        .filter-bar h4 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        .filter-section {
          margin-bottom: 1.5rem;
        }
        .filter-section label {
          font-size: 1.1rem;
          font-weight: 500;
          color: #1f2937;
          display: block;
          margin-bottom: 0.5rem;
        }
        .filter-bar select {
          width: 100%;
          padding: 0.9rem 1rem;
          border: 1px solid #d1d5db;
          borderRadius: 8px;
          font-size: 1rem;
          color: #1f2937;
          background: #fff;
          cursor: pointer;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .filter-bar select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.2);
          outline: none;
        }
        .main-content {
          flex-grow: 1;
        }
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin-top: 2rem;
          padding: 1rem;
        }
        .pagination-btn {
          padding: 0.75rem 1.25rem;
          font-size: 1rem;
          font-weight: 500;
          color: #1f2937;
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s ease, color 0.3s ease;
        }
        .pagination-btn:hover:not(:disabled) {
          background: #3b82f6;
          color: #ffffff;
        }
        .pagination-btn:disabled {
          background: #e5e7eb;
          color: #6b7280;
          cursor: not-allowed;
        }
        .page-number {
          padding: 0.75rem 1.25rem;
          font-size: 1rem;
          font-weight: 500;
          color: #1f2937;
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s ease, color 0.3s ease;
        }
        .page-number.active {
          background: #3b82f6;
          color: #ffffff;
          border-color: #3b82f6;
        }
        .page-number:hover:not(.active) {
          background: #f3f4f6;
        }
        @media (max-width: 1024px) {
          .services-container {
            flex-direction: column;
          }
          .filter-bar {
            position: static;
            width: 100%;
            margin-bottom: 2rem;
          }
          .service-controls {
            flex-direction: column;
            align-items: stretch;
          }
          .search-container {
            max-width: 100%;
          }
        }
        @media (max-width: 768px) {
          .services-page {
            padding: 2rem 1rem;
          }
          .service-title {
            font-size: 2rem;
          }
          .service-description {
            font-size: 1rem;
          }
          .service-list {
            grid-template-columns: 1fr;
          }
          .service-item {
            margin: 0 auto;
            max-width: 100%;
          }
          .QA-btn {
            width: 100%;
            justify-content: center;
          }
          .pagination {
            flex-wrap: wrap;
            gap: 0.5rem;
          }
        }
      `}</style>

      <div className="services-page">
        <div className="services-container">
          <motion.div
            className="filter-bar"
            variants={filterBarVariants}
            initial="hidden"
            animate="visible"
          >
            <h4>
              <FontAwesomeIcon icon={faFilter} /> Bộ Lọc
            </h4>
            <div className="filter-section">
              <label>Sắp xếp theo</label>
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="">Mặc định</option>
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
                <option value="durationLowToHigh">
                  Thời gian: Ngắn đến Dài <FontAwesomeIcon icon={faClock} />
                </option>
              </select>
            </div>
            <div className="filter-section">
              <label>Danh mục</label>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="all">Tất cả danh mục</option>
                {categories.map((category) => (
                  <option key={category.serviceCategoryId} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-section">
              <label>Khoảng giá</label>
              <select
                value={filterPriceRange}
                onChange={(e) => setFilterPriceRange(e.target.value)}
              >
                <option value="all">Tất cả giá</option>
                <option value="0-500000">0 - 500,000 ₫</option>
                <option value="500001-1000000">500,001 - 1,000,000 ₫</option>
                <option value="1000001+">1,000,001+ ₫</option>
              </select>
            </div>
          </motion.div>

          <div className="main-content">
            <motion.div
              className="service-header"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="service-title">Trung Tâm Tư Vấn Chăm Sóc Da</h1>
              <p className="service-description">
                Khám phá các dịch vụ chăm sóc da và làm đẹp chuyên nghiệp với chất lượng hàng đầu.
              </p>
            </motion.div>

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
              <Link to="/userquiz" className="QA-btn">
                <FontAwesomeIcon icon={faEnvelope} /> Làm Q&A
              </Link>
            </motion.div>

            {loading ? (
              <div className="loading">Đang tải dịch vụ...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : (
              <>
                <motion.div
                  className="service-list"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  key={currentPage}
                >
                  {currentServices.length === 0 ? (
                    <div className="error">Không tìm thấy dịch vụ nào phù hợp.</div>
                  ) : (
                    currentServices.map((service) => (
                      <motion.div key={service.serviceId} variants={itemVariants}>
                        <Link to={`/service/${service.serviceId}`} className="service-item">
                          <div className="service-image-wrapper">
                            <img
                              src={service.imageUrl || "https://via.placeholder.com/300x200"}
                              alt={service.name}
                              className="service-image"
                            />
                            <div className="service-overlay">
                              <span>Xem chi tiết</span>
                            </div>
                          </div>
                          <div className="service-content">
                            <h2>{service.name}</h2>
                            <p className="price">{formatPrice(service.price)}</p>
                            <div className="rating">
                              {[...Array(5)].map((_, i) => (
                                <FontAwesomeIcon key={i} icon={faStar} />
                              ))}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))
                  )}
                </motion.div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index + 1}
                        className={`page-number ${currentPage === index + 1 ? "active" : ""}`}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicesPage;