import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../page/AuthContext";
import { getAllServices, getServiceCategories, getImageService } from "../api/testApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const BlogDetail = ({ darkMode }) => {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceAndCategories = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      try {
        const [servicesResponse, categoriesResponse] = await Promise.all([
          getAllServices(token || null),
          getServiceCategories(token || null),
        ]);
        const foundService = servicesResponse.data.find(
          (s) => s.serviceId === parseInt(id, 10)
        );
        if (!foundService) throw new Error("Service not found");

        // Fetch image URL for the service
        let imageUrl = null;
        try {
          const imageResponse = await getImageService(foundService.serviceId, token || null);
          imageUrl = imageResponse.data.imageURL; // Use imageURL from API response
        } catch (imageErr) {
          console.warn(`No image found for service ${foundService.serviceId}`);
        }

        setService({ ...foundService, imageUrl });
        setCategories(categoriesResponse.data || []);
      } catch (err) {
        setError(`Failed to load service details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceAndCategories();
  }, [id]);

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!service) return <h2>Dịch vụ không tồn tại</h2>;

  const handleBookingClick = () => {
    if (isLoggedIn) {
      navigate("/booking_page");
    } else {
      navigate("/sign_in", { state: { from: `/service/${id}` } });
    }
  };

  const isServiceActive = service.status;

  return (
    <>
      <style>{`
        .blog-detail {
          padding: 4rem 2rem;
          background: ${
            darkMode
              ? "#1c2526"
              : "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"
          };
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
          color: ${darkMode ? "#ecf0f1" : "#2c3e50"};
        }
        .blog-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: center;
        }
        .blog-text h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: ${darkMode ? "#1abc9c" : "#2c3e50"};
        }
        .blog-text p {
          font-size: 1.25rem;
          line-height: 1.6;
          color: ${darkMode ? "#bdc3c7" : "#6c757d"};
          margin-bottom: 1rem;
        }
        .blog-info {
          margin-top: 1.5rem;
        }
        .blog-info p {
          font-size: 1.1rem;
          margin: 0.5rem 0;
        }
        .blog-info .price {
          font-weight: 600;
          color: ${darkMode ? "#1abc9c" : "#1abc9c"};
        }
        .blog-info .rating {
          color: #f39c12;
          margin-top: 0.5rem;
        }
        .blog-image img {
          width: 100%;
          max-height: 400px;
          object-fit: cover;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .back-button, .booking-button, .inactive-button {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          border-radius: 25px;
          transition: background 0.3s ease, transform 0.2s ease;
          margin: 1rem 1rem 0 0;
        }
        .back-button {
          background: ${darkMode ? "#34495e" : "#6c757d"};
          color: #fff;
        }
        .back-button:hover {
          background: ${darkMode ? "#2c3e50" : "#5a6268"};
          transform: translateY(-2px);
        }
        .booking-button {
          background: ${darkMode ? "#1abc9c" : "#1abc9c"};
          color: #fff;
          border: none;
          cursor: pointer;
        }
        .booking-button:hover {
          background: ${darkMode ? "#16a085" : "#16a085"};
          transform: translateY(-2px);
        }
        .inactive-button {
          background: ${darkMode ? "#7f8c8d" : "#95a5a6"};
          color: #fff;
          border: none;
          cursor: not-allowed;
          opacity: 0.7;
        }
        .loading, .error {
          text-align: center;
          font-size: 1.25rem;
          padding: 2rem;
          color: ${darkMode ? "#6c757d" : "#6c757d"};
        }
        .error {
          color: ${darkMode ? "#dc3545" : "#dc3545"};
        }
        @media (max-width: 768px) {
          .blog-content {
            grid-template-columns: 1fr;
          }
          .blog-text h1 {
            font-size: 2rem;
          }
          .blog-text p {
            font-size: 1rem;
          }
        }
      `}</style>

      <div className={`blog-detail ${darkMode ? "dark" : ""}`}>
        <div className="blog-content">
          <div className="blog-text">
            <h1>{service.name}</h1>
            <p>{service.description || "Không có mô tả chi tiết."}</p>
            <div className="blog-info">
              <p className="price">Giá: ${service.price || "N/A"}</p>
              <p>Trạng thái: {service.status ? "Hoạt động" : "Không hoạt động"}</p>
              <p>
                Danh mục:{" "}
                {categories.find(
                  (cat) => cat.serviceCategoryId === service.serviceCategoryId
                )?.name || "N/A"}
              </p>
              <div className="rating">
                Đánh giá:{" "}
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
              </div>
            </div>
            <Link to="/service" className="back-button">
              Quay lại
            </Link>
            <button
              onClick={isServiceActive ? handleBookingClick : null}
              className={isServiceActive ? "booking-button" : "inactive-button"}
              disabled={!isServiceActive}
            >
              {isServiceActive ? "Đặt Lịch Ngay" : "Không Khả Dụng"}
            </button>
          </div>
          <div className="blog-image">
            <img
              src={service.imageUrl || "https://via.placeholder.com/600x400"}
              alt={service.name}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetail;