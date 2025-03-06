import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
} from "@fortawesome/free-solid-svg-icons";

const Profile = ({ darkMode }) => {
  const { userId, token, isLoggedIn, username } = useAuth();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        setError(`Failed to load profile: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, token, isLoggedIn, navigate]);

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Check if profile has meaningful data
  const hasProfileData =
    userDetails &&
    (userDetails.firstName ||
      userDetails.lastName ||
      userDetails.address ||
      userDetails.gender ||
      userDetails.avatar);

  return (
    <>
      <style>{`
        .cv-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #f8f4e1 0%, #e5e5e5 100%);
          padding: 40px 20px;
          transition: background 0.3s ease;
        }
        .cv-page.dark {
          background: linear-gradient(135deg, #1c2526 0%, #34495e 100%);
        }
        .cv-container {
          background: rgba(255, 255, 255, 0.95);
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 800px;
          transition: background 0.3s ease;
        }
        .cv-page.dark .cv-container {
          background: rgba(52, 73, 94, 0.95);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
        }
        .cv-header {
          display: flex;
          align-items: center;
          border-bottom: 2px solid #6c4f37;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .cv-page.dark .cv-header {
          border-bottom-color: #1abc9c;
        }
        .cv-avatar-wrapper {
          margin-right: 20px;
        }
        .cv-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #6c4f37;
        }
        .cv-page.dark .cv-avatar {
          border-color: #1abc9c;
        }
        .cv-avatar-placeholder {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 50px;
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
          font-size: 28px;
          font-family: "Poppins", sans-serif;
          font-weight: 700;
          color: #2c3e50;
          margin: 0 0 10px;
        }
        .cv-page.dark .cv-header h1 {
          color: #ecf0f1;
        }
        .cv-header p {
          font-size: 16px;
          font-family: "Roboto", sans-serif;
          color: #7f8c8d;
          margin: 5px 0;
        }
        .cv-page.dark .cv-header p {
          color: #bdc3c7;
        }
        .cv-section {
          margin-bottom: 30px;
        }
        .cv-section h2 {
          font-size: 20px;
          font-family: "Poppins", sans-serif;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 15px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
        }
        .cv-page.dark .cv-section h2 {
          color: #ecf0f1;
          border-bottom-color: #5a758c;
        }
        .cv-section p {
          font-size: 16px;
          font-family: "Roboto", sans-serif;
          color: #2c3e50;
          margin: 10px 0;
          display: flex;
          align-items: center;
        }
        .cv-page.dark .cv-section p {
          color: #ecf0f1;
        }
        .cv-section p strong {
          margin-right: 10px;
          min-width: 100px;
        }
        .edit-btn, .add-btn {
          display: inline-flex;
          align-items: center;
          padding: 12px 25px;
          font-size: 16px;
          font-family: "Poppins", sans-serif;
          font-weight: 600;
          text-decoration: none;
          color: #fff;
          background: #6c4f37;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
          margin-right: 10px;
        }
        .cv-page.dark .edit-btn, .cv-page.dark .add-btn {
          background: #1abc9c;
        }
        .edit-btn:hover, .add-btn:hover {
          background: #503a28;
          transform: scale(1.05);
        }
        .cv-page.dark .edit-btn:hover, .cv-page.dark .add-btn:hover {
          background: #16a085;
        }
        .notification {
          background: #f8d7da;
          color: #721c24;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          font-family: "Roboto", sans-serif;
        }
        .cv-page.dark .notification {
          background: #f44336;
          color: #fff;
        }
        .notification-icon {
          margin-right: 10px;
        }
        .loading, .error {
          font-size: 18px;
          font-family: "Roboto", sans-serif;
          color: #2c3e50;
          text-align: center;
          padding: 20px;
        }
        .cv-page.dark .loading, .cv-page.dark .error {
          color: #ecf0f1;
        }
      `}</style>

      <div className={`cv-page ${darkMode ? "dark" : ""}`}>
        <div className="cv-container">
          {!hasProfileData ? (
            <>
              <div className="notification">
                <FontAwesomeIcon icon={faExclamationTriangle} className="notification-icon" />
                Your profile doesn't have any data yet.
              </div>
              <div className="cv-section">
                <Link to="/add-profile" className="add-btn">
                  <FontAwesomeIcon icon={faEdit} /> Add Profile
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="cv-header">
                <div className="cv-avatar-wrapper">
                  {userDetails.avatar ? (
                    <img src={userDetails.avatar} alt="Avatar" className="cv-avatar" />
                  ) : (
                    <div className="cv-avatar-placeholder">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                  )}
                </div>
                <div className="cv-header-info">
                  <h1>
                    {userDetails.firstName || "N/A"} {userDetails.lastName || "N/A"}
                  </h1>
                  <p>
                    <FontAwesomeIcon icon={faEnvelope} /> {username || "Not provided"}
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faPhone} /> {userDetails.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="cv-section">
                <h2>Personal Information</h2>
                <p>
                  <strong>
                    <FontAwesomeIcon icon={faUser} /> Full Name:
                  </strong>
                  {userDetails.firstName || "N/A"} {userDetails.lastName || "N/A"}
                </p>
                <p>
                  <strong>
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> Address:
                  </strong>
                  {userDetails.address || "Not provided"}
                </p>
                <p>
                  <strong>
                    <FontAwesomeIcon icon={faVenusMars} /> Gender:
                  </strong>
                  {userDetails.gender || "Not provided"}
                </p>
              </div>

              <div className="cv-section">
                <Link to="/edit-profile" className="edit-btn">
                  <FontAwesomeIcon icon={faEdit} /> Edit Profile
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;