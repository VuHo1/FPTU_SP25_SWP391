import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { getUserDetails } from "../api/testApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMapMarkerAlt,
  faVenusMars,
  faEdit,
  faEnvelope,
  faPhone,
  faExclamationTriangle,
  faTimes,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

const ProfileRole = ({ darkMode, role }) => {
  const { userId, token, isLoggedIn, username } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !userId || !token) {
      navigate("/sign_in");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await getUserDetails(userId, token);
        const data = response.data || {};
        setUserDetails(data);
        const hasData = data && (data.firstName || data.lastName || data.address || data.gender || data.avatar);
        setShowPrompt(!hasData);
      } catch (err) {
        setError(`Failed to load profile: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, token, isLoggedIn, navigate, location.state?.refresh]);

  const handleAddProfile = () => {
    navigate("/add-profilerole");
  };

  const handleReturn = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleReturnToHome = () => {
    const userRole = role || localStorage.getItem("role") || "Admin"; // Fallback to "Admin" if role not found
    const rolePath = userRole.toLowerCase() === "therapist" ? "skintherapist" : userRole.toLowerCase();
    navigate(`/${rolePath}/home`);
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <>
      <style>{`
        .cv-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8f4e1 0%, #e5e5e5 100%);
          padding: 2rem;
          transition: background 0.3s ease;
        }
        .cv-page.dark {
          background: linear-gradient(135deg, #1c2526 0%, #34495e 100%);
        }
        .cv-container {
          background: rgba(255, 255, 255, 0.98);
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 48rem;
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .cv-page.dark .cv-container {
          background: rgba(52, 73, 94, 0.98);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }
        .cv-container:hover {
          transform: translateY(-4px);
        }
        .cv-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding-bottom: 1.5rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid #6c4f37;
        }
        .cv-page.dark .cv-header {
          border-bottom-color: #1abc9c;
        }
        .cv-avatar-wrapper {
          flex-shrink: 0;
        }
        .cv-avatar {
          width: 9rem;
          height: 9rem;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #6c4f37;
          transition: border 0.3s ease;
        }
        .cv-page.dark .cv-avatar {
          border-color: #1abc9c;
        }
        .cv-avatar-placeholder {
          width: 9rem;
          height: 9rem;
          border-radius: 50%;
          background: #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          color: #6c4f37;
          border: 3px solid #6c4f37;
        }
        .cv-page.dark .cv-avatar-placeholder {
          background: #34495e;
          color: #1abc9c;
          border-color: #1abc9c;
        }
        .cv-header-info {
          flex: 1;
        }
        .cv-header h1 {
          font-family: "Poppins", sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0 0 0.75rem;
        }
        .cv-page.dark .cv-header h1 {
          color: #ecf0f1;
        }
        .cv-header p {
          font-family: "Roboto", sans-serif;
          font-size: 1.125rem;
          color: #7f8c8d;
          margin: 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .cv-page.dark .cv-header p {
          color: #bdc3c7;
        }
        .cv-section {
          margin-bottom: 2rem;
        }
        .cv-section h2 {
          font-family: "Poppins", sans-serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #ddd;
        }
        .cv-page.dark .cv-section h2 {
          color: #ecf0f1;
          border-bottom-color: #5a758c;
        }
        .cv-section p {
          font-family: "Roboto", sans-serif;
          font-size: 1.125rem;
          color: #2c3e50;
          margin: 0.75rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .cv-page.dark .cv-section p {
          color: #ecf0f1;
        }
        .cv-section p strong {
          font-weight: 500;
          min-width: 8rem;
        }
        .edit-btn, .add-btn, .return-btn, .home-btn {
          padding: 0.75rem 1.5rem;
          font-family: "Poppins", sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          background: #6c4f37;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .cv-page.dark .edit-btn, .cv-page.dark .add-btn, .cv-page.dark .return-btn, .cv-page.dark .home-btn {
          background: #1abc9c;
        }
        .edit-btn:hover, .add-btn:hover, .return-btn:hover, .home-btn:hover {
          background: #503a28;
          transform: translateY(-2px);
        }
        .cv-page.dark .edit-btn:hover, .cv-page.dark .add-btn:hover, .cv-page.dark .return-btn:hover, .cv-page.dark .home-btn:hover {
          background: #16a085;
        }
        .return-btn, .home-btn {
          background: #7f8c8d;
        }
        .cv-page.dark .return-btn, .cv-page.dark .home-btn {
          background: #bdc3c7;
        }
        .return-btn:hover, .home-btn:hover {
          background: #6c757d;
        }
        .cv-page.dark .return-btn:hover, .cv-page.dark .home-btn:hover {
          background: #a1a9ac;
        }
        .notification {
          font-family: "Roboto", sans-serif;
          font-size: 1rem;
          color: #721c24;
          background: #f8d7da;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .cv-page.dark .notification {
          color: #fff;
          background: #f44336;
        }
        .loading, .error {
          font-family: "Roboto", sans-serif;
          font-size: 1.25rem;
          color: #2c3e50;
          text-align: center;
          padding: 2rem;
        }
        .cv-page.dark .loading, .cv-page.dark .error {
          color: #ecf0f1;
        }
      `}</style>

      <div className={`cv-page ${darkMode ? "dark" : ""}`}>
        <div className="cv-container">
          {showPrompt ? (
            <>
              <div className="notification">
                <FontAwesomeIcon icon={faExclamationTriangle} />
                No profile information found. Please add your profile details.
              </div>
              <div className="cv-section">
                <button onClick={handleAddProfile} className="add-btn">
                  <FontAwesomeIcon icon={faEdit} /> Add Profile
                </button>
                <button onClick={handleReturn} className="return-btn">
                  <FontAwesomeIcon icon={faTimes} /> Return
                </button>
                <button onClick={handleReturnToHome} className="home-btn">
                  <FontAwesomeIcon icon={faHome} /> Home Page
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="cv-header">
                <div className="cv-avatar-wrapper">
                  {userDetails?.avatar ? (
                    <img src={userDetails.avatar} alt="Avatar" className="cv-avatar" />
                  ) : (
                    <div className="cv-avatar-placeholder">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                  )}
                </div>
                <div className="cv-header-info">
                  <h1>
                    {userDetails?.firstName || "N/A"} {userDetails?.lastName || "N/A"}
                  </h1>
                  <p>
                    <FontAwesomeIcon icon={faEnvelope} /> {username || "Not provided"}
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faPhone} /> {userDetails?.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="cv-section">
                <h2>Personal Information</h2>
                <p>
                  <strong>
                    <FontAwesomeIcon icon={faUser} /> Full Name:
                  </strong>
                  {userDetails?.firstName || "N/A"} {userDetails?.lastName || "N/A"}
                </p>
                <p>
                  <strong>
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> Address:
                  </strong>
                  {userDetails?.address || "Not provided"}
                </p>
                <p>
                  <strong>
                    <FontAwesomeIcon icon={faVenusMars} /> Gender:
                  </strong>
                  {userDetails?.gender || "Not provided"}
                </p>
              </div>

              <div className="cv-section">
                <Link to="/edit-profilerole" className="edit-btn">
                  <FontAwesomeIcon icon={faEdit} /> Edit Profile
                </Link>
                <button onClick={handleReturnToHome} className="home-btn">
                  <FontAwesomeIcon icon={faHome} /> Home Page
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileRole;