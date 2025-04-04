import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../page/AuthContext";
import {
  getAllServices,
  getServiceCategories,
  getImageService,
  getFeedbacksByServiceId,
  getAllUserDetails,
  postFeedback,
  updateFeedback,
  deleteFeedback,
} from "../api/testApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faChevronLeft,
  faStarHalfAlt,
  faChevronRight,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const BlogDetail = ({ darkMode }) => {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState({ rating: 5, comment: "" });
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [ratingFilter, setRatingFilter] = useState("All");
  const [editingFeedbackId, setEditingFeedbackId] = useState(null);
  const [editFeedback, setEditFeedback] = useState({ rating: 5, comment: "" });

  const fetchFeedbacks = async (serviceId, token) => {
    try {
      const response = await getFeedbacksByServiceId(serviceId, token);
      setFeedbacks(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.warn(`No feedbacks found for service ${serviceId}: ${err.message}`);
      setFeedbacks([]);
    }
  };


  const fetchUserDetails = async (token) => {
    try {
      const response = await getAllUserDetails(token);
      const userData = response.data;
      const userMap = userData.reduce((acc, user) => {
        acc[user.userId] = {
          userName: `${user.lastName} ${user.firstName}`,
          avatar: user.avatar,
        };
        return acc;
      }, {});
      setUserDetails(userMap);
    } catch (err) {
      console.warn(`Failed to fetch user details: ${err.message}`);
      setUserDetails({});
    }
  };

  const submitFeedback = async () => {
    if (!isLoggedIn) {
      navigate("/sign_in", { state: { from: `/service/${id}` } });
      return;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("User ID not found. Please log in again.");
      return;
    }

    try {
      const feedbackData = {
        serviceId: parseInt(id, 10),
        userId: parseInt(userId, 10),
        rating: newFeedback.rating,
        comment: newFeedback.comment,
      };
      const response = await postFeedback(feedbackData, token);
      setFeedbacks([...feedbacks, response.data]);
      setNewFeedback({ rating: 5, comment: "" });
    } catch (err) {
      setError(`Failed to submit feedback: ${err.message}`);
    }
  };


  const updateFeedbackHandler = async (feedbackId) => {
    const token = localStorage.getItem("token");
    try {
      const feedbackData = {
        rating: editFeedback.rating,
        comment: editFeedback.comment,
      };
      await updateFeedback(feedbackId, feedbackData, token);
      const updatedFeedbacks = feedbacks.map((fb) =>
        fb.feedbackId === feedbackId
          ? { ...fb, rating: editFeedback.rating, comment: editFeedback.comment }
          : fb
      );
      setFeedbacks(updatedFeedbacks);
      setEditingFeedbackId(null);
    } catch (err) {
      setError(`Failed to update feedback: ${err.message}`);
    }
  };

  const deleteFeedbackHandler = async (feedbackId) => {
    const token = localStorage.getItem("token");
    try {
      await deleteFeedback(feedbackId, token);
      setFeedbacks(feedbacks.filter((fb) => fb.feedbackId !== feedbackId));
    } catch (err) {
      setError(`Failed to delete feedback: ${err.message}`);
    }
  };

  const calculateAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    const total = feedbacks.reduce((sum, fb) => sum + fb.rating, 0);
    return (total / feedbacks.length).toFixed(1);
  };


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

        let serviceImages = [];
        try {
          const imageResponse = await getImageService(foundService.serviceId, token || null);
          serviceImages = (imageResponse.data || []).map((img, index) => ({
            imageServiceId: img.imageServiceId,
            imageURL: img.imageURL,
            isMain: index === 0,
          }));
          setImages(serviceImages);
          setMainImageIndex(0);
        } catch (imageErr) {
          console.warn(`No images found for service ${foundService.serviceId}`);
          setImages([]);
          setMainImageIndex(-1);
        }

        await Promise.all([
          fetchFeedbacks(foundService.serviceId, token),
          fetchUserDetails(token),
        ]);
        setService(foundService);
        setCategories(categoriesResponse.data || []);
      } catch (err) {
        setError(`Failed to load service details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceAndCategories();
  }, [id]);

  const handleImageClick = (index) => setMainImageIndex(index);
  const handlePrevImage = () =>
    setMainImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  const handleNextImage = () =>
    setMainImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));

  const handleBookingClick = () => {
    if (isLoggedIn) {
      navigate("/booking_page", { state: { selectedServiceId: service.serviceId } });
    } else {
      navigate("/sign_in", { state: { from: `/service/${id}` } });
    }
  };

  const filteredFeedbacks = () => {
    if (ratingFilter === "All") return feedbacks;
    return feedbacks.filter((fb) => fb.rating === parseInt(ratingFilter));
  };

  const currentUserId = localStorage.getItem("userId");

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!service) return <h2>Service does not exist</h2>;

  const isServiceActive = service.status;
  const mainImage = images.length > 0 ? images[mainImageIndex]?.imageURL : null;
  const averageRating = calculateAverageRating();
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <FontAwesomeIcon key={`full-${i}`} icon={faStar} className="full-star" />
        ))}
        {halfStar === 1 && (
          <FontAwesomeIcon key="half" icon={faStarHalfAlt} className="half-star" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <FontAwesomeIcon key={`empty-${i}`} icon={faStar} className="empty-star" />
        ))}
      </>
    );
  };
  return (
    <>
      <style>{`
        .blog-detail {
          padding: 4rem 2rem;
          background: ${darkMode ? "#1c2526" : "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"};
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
          align-items: start;
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
        .blog-image {
          width: 100%;
          position: relative;
        }
        .main-image {
          width: 100%;
          max-height: 400px;
          object-fit: cover;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          margin-bottom: 1rem;
        }
        .slideshow-controls {
          position: absolute;
          top: 50%;
          width: 100%;
          display: flex;
          justify-content: space-between;
          transform: translateY(-50%);
          padding: 0 10px;
        }
        .slideshow-button {
          background: rgba(0, 0, 0, 0.5);
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 1.2rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .slideshow-button:hover {
          background: rgba(0, 0, 0, 0.8);
        }
        .slideshow-button:disabled {
          background: rgba(0, 0, 0, 0.3);
          cursor: not-allowed;
        }
        .thumbnail-container {
          display: flex;
          overflow-x: auto;
          gap: 1rem;
          padding-bottom: 0.5rem;
          scrollbar-width: thin;
          scrollbar-color: ${darkMode ? "#34495e #1c2526" : "#6c757d #f8f9fa"};
        }
        .thumbnail-container::-webkit-scrollbar {
          height: 8px;
        }
        .thumbnail-container::-webkit-scrollbar-thumb {
          background: ${darkMode ? "#34495e" : "#6c757d"};
          border-radius: 4px;
        }
        .thumbnail-container::-webkit-scrollbar-track {
          background: ${darkMode ? "#1c2526" : "#f8f9fa"};
        }
        .thumbnail {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 8px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: border 0.3s ease, transform 0.2s ease;
        }
        .thumbnail:hover {
          transform: scale(1.05);
          border: 2px solid #1abc9c;
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
          .main-image {
            max-height: 300px;
          }
          .thumbnail {
            width: 80px;
            height: 80px;
          }
          .slideshow-button {
            width: 30px;
            height: 30px;
            font-size: 1rem;
          }
        }
        /* CSS cho feedback */
        .feedback-section {
          max-width: 1200px;
          margin: 2rem auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          padding: 1rem;
          background: ${darkMode ? "#2c3e50" : "#fff"};
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .feedback-list, .feedback-form {
          padding: 1rem;
        }
        .feedback-list h3, .feedback-form h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: ${darkMode ? "#1abc9c" : "#2c3e50"};
          text-align: left;
        }
        .feedback-item {
          padding: 0.5rem 0;
          border-bottom: 1px solid ${darkMode ? "#34495e" : "#e9ecef"};
          text-align: left;
          display: flex;
          flex-direction: column;
        }
        .feedback-item:last-child {
          border-bottom: none;
        }
        .feedback-rating {
          color: #f39c12;
        }
        .average-rating {
          margin-bottom: 1rem;
          font-weight: 600;
          color: ${darkMode ? "#ecf0f1" : "#000"};
          text-align: left;
        }
        .star-rating {
          display: flex;
          gap: 5px;
          margin-bottom: 0.5rem;
        }
        .star-rating .star {
          cursor: pointer;
          font-size: 1.2rem;
          color: ${darkMode ? "#34495e" : "#ced4da"};
        }
        .star-rating .star.filled {
          color: #f39c12;
        }
        .feedback-form textarea, .feedback-item textarea {
          width: 100%;
          min-height: 80px;
          padding: 0.5rem;
          border-radius: 4px;
          border: 1px solid ${darkMode ? "#34495e" : "#ced4da"};
          background: ${darkMode ? "#34495e" : "#fff"};
          color: ${darkMode ? "#ecf0f1" : "#2c3e50"};
          margin-bottom: 0.5rem;
        }
        .submit-feedback-button, .update-feedback-button {
          background: ${darkMode ? "#1abc9c" : "#1abc9c"};
          color: #fff;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .submit-feedback-button:hover, .update-feedback-button:hover {
          background: ${darkMode ? "#16a085" : "#16a085"};
        }
        .feedback-list-container {
          max-height: 300px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: ${darkMode ? "#34495e #2c3e50" : "#6c757d #fff"};
        }
        .feedback-list-container::-webkit-scrollbar {
          width: 8px;
        }
        .feedback-list-container::-webkit-scrollbar-thumb {
          background: ${darkMode ? "#34495e" : "#6c757d"};
          border-radius: 4px;
        }
        .feedback-list-container::-webkit-scrollbar-track {
          background: ${darkMode ? "#2c3e50" : "#fff"};
        }
        .feedback-user {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          font-weight: 500;
          color: ${darkMode ? "#bdc3c7" : "#333"};
          margin-bottom: 0.25rem;
        }
        .feedback-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          object-fit: cover;
        }
        .feedback-item p {
          color: ${darkMode ? "#ecf0f1" : "#333"};
          margin: 0 0 0.5rem;
        }
        .rating-filter {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .filter-button {
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          border: 1px solid ${darkMode ? "#34495e" : "#ced4da"};
          border-radius: 20px;
          background: ${darkMode ? "#34495e" : "#fff"};
          color: ${darkMode ? "#ecf0f1" : "#2c3e50"};
          cursor: pointer;
          transition: background 0.3s ease, color 0.3s ease;
        }
        .filter-button.active {
          background: ${darkMode ? "#1abc9c" : "#1abc9c"};
          color: #fff;
        }
        .filter-button:hover {
          background: ${darkMode ? "#16a085" : "#16a085"};
          color: #fff;
        }
        .action-buttons {
          display: flex;
          margin-left: auto;
          gap: 0.5rem;
        }
        .edit-button, .delete-button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          padding: 0.2rem;
          transition: color 0.3s ease;
        }
        .edit-button {
          color: ${darkMode ? "#1abc9c" : "#1abc9c"};
        }
        .edit-button:hover {
          color: ${darkMode ? "#16a085" : "#16a085"};
        }
        .delete-button {
          color: ${darkMode ? "#dc3545" : "#dc3545"};
        }
        .delete-button:hover {
          color: ${darkMode ? "#c82333" : "#c82333"};
        }
        @media (max-width: 768px) {
          .feedback-section {
            grid-template-columns: 1fr;
          }
          .rating-filter {
            flex-wrap: wrap;
          }
        }
          .rating, .feedback-rating {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 1.1rem;
        }
        .full-star {
          color: #f39c12; 
        }
        .half-star {
          color: #f39c12; 
        }
        .empty-star {
          color: ${darkMode ? "#6b7280" : "#ced4da"}; /* Màu sao rỗng, thay đổi theo darkMode */
        }
        
        .star-rating {
          display: flex;
          gap: 5px;
          margin-bottom: 0.5rem;
        }
        .star-rating .star {
          cursor: pointer;
          font-size: 1.2rem;
          color: ${darkMode ? "#34495e" : "#ced4da"};
        }
        .star-rating .star.filled {
          color: #f39c12;
        }
      `}</style>

      <div className={`blog-detail ${darkMode ? "dark" : ""}`}>
        <div className="blog-content">
          <div className="blog-text">
            <h1>{service.name}</h1>
            <p>{service.description || "No detailed description available."}</p>
            <div className="blog-info">
              <p className="price">
                Price: {service.price ? `${service.price.toLocaleString("vi-VN")} VND` : "N/A"}
              </p>
              <p>Status: {service.status ? "Active " : "UnActive"}</p>
              <p>
                Categorie:{" "}
                {categories.find((cat) => cat.serviceCategoryId === service.serviceCategoryId)?.name || "N/A"}
              </p>
              <p>
                Average Rating: {averageRating} / 5{" "}
                <span>
                  {renderStars(averageRating)}
                </span>
              </p>
            </div>
            <Link to="/service" className="back-button">
              Back
            </Link>
            <button
              onClick={isServiceActive ? handleBookingClick : null}
              className={isServiceActive ? "booking-button" : "inactive-button"}
              disabled={!isServiceActive}
            >
              {isServiceActive ? "Book Now" : "Not Available"}
            </button>
          </div>
          <div className="blog-image">
            <div style={{ position: "relative" }}>
              <img
                src={mainImage || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-1.jpg"}
                alt={service.name}
                className="main-image"
              />
              {images.length > 1 && (
                <div className="slideshow-controls">
                  <button
                    onClick={handlePrevImage}
                    className="slideshow-button"
                    disabled={images.length <= 1}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="slideshow-button"
                    disabled={images.length <= 1}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              )}
            </div>
            {images.length > 0 && (
              <div className="thumbnail-container">
                {images.map((img, index) => (
                  <img
                    key={img.imageServiceId}
                    src={img.imageURL}
                    alt={`Thumbnail ${img.imageServiceId}`}
                    className="thumbnail"
                    onClick={() => handleImageClick(index)}
                    style={{
                      border: mainImageIndex === index ? "2px solid #1abc9c" : "2px solid transparent",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="feedback-section">
          <div className="feedback-form">
            <h3>Your feedback</h3>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                  key={star}
                  icon={faStar}
                  className={`star ${star <= newFeedback.rating ? "filled" : ""}`}
                  onClick={() => setNewFeedback({ ...newFeedback, rating: star })}
                />
              ))}
            </div>
            <textarea
              value={newFeedback.comment}
              onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
              placeholder="Typing your feedback..."
            />
            <button onClick={submitFeedback} className="submit-feedback-button">
              Send
            </button>
          </div>
          <div className="feedback-list">
            <h3>Feedbacks of Service</h3>
            <div className="average-rating">
              Average Rating: {averageRating} / 5{" "}
              <span className="feedback-rating">
                {renderStars(averageRating)}
              </span>
            </div>
            <div className="rating-filter">
              {["All", "5", "4", "3", "2", "1"].map((rating) => (
                <button
                  key={rating}
                  className={`filter-button ${ratingFilter === rating ? "active" : ""}`}
                  onClick={() => setRatingFilter(rating)}
                >
                  {rating === "All" ? "ALL" : `${rating} Star`}
                </button>
              ))}
            </div>
            <div className="feedback-list-container">
              {filteredFeedbacks().length > 0 ? (
                filteredFeedbacks()
                  .slice()
                  .reverse()
                  .map((fb) => (
                    <div key={fb.feedbackId} className="feedback-item">
                      <div className="feedback-user">
                        <img
                          src={
                            userDetails[fb.userId]?.avatar ||
                            "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-1.jpg"
                          }
                          alt="User Avatar"
                          className="feedback-avatar"
                        />
                        <span>{userDetails[fb.userId]?.userName || "Unknown User"}</span>
                      </div>
                      {editingFeedbackId === fb.feedbackId ? (
                        <>
                          <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FontAwesomeIcon
                                key={star}
                                icon={faStar}
                                className={`star ${star <= editFeedback.rating ? "filled" : ""}`}
                                onClick={() => setEditFeedback({ ...editFeedback, rating: star })}
                              />
                            ))}
                          </div>
                          <textarea
                            value={editFeedback.comment}
                            onChange={(e) =>
                              setEditFeedback({ ...editFeedback, comment: e.target.value })
                            }
                          />
                          <button
                            onClick={() => updateFeedbackHandler(fb.feedbackId)}
                            className="update-feedback-button"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => setEditingFeedbackId(null)}
                            className="submit-feedback-button"
                            style={{ background: darkMode ? "#6c757d" : "#6c757d", marginLeft: "0.5rem" }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="feedback-rating">
                            {Array(fb.rating)
                              .fill()
                              .map((_, i) => (
                                <FontAwesomeIcon key={i} icon={faStar} />
                              ))}
                          </div>
                          <p>{fb.comment}</p>
                          {currentUserId && fb.userId === parseInt(currentUserId) && (
                            <div className="action-buttons">
                              <button
                                className="edit-button"
                                onClick={() => {
                                  setEditingFeedbackId(fb.feedbackId);
                                  setEditFeedback({ rating: fb.rating, comment: fb.comment });
                                }}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                className="delete-button"
                                onClick={() => deleteFeedbackHandler(fb.feedbackId)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))
              ) : (
                <p>No feedback yet </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetail;