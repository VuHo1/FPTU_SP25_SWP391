import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { getUserDetails, updateUserDetails } from "../api/testApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMapMarkerAlt,
  faVenusMars,
  faCamera,
  faSave,
  faTimes,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

const EditProfileRole = ({ darkMode }) => {
  const { userId, token, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    gender: "",
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
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
        const hasData = data && (data.firstName || data.lastName || data.address || data.gender || data.avatar);
        if (!hasData) {
          setShowPrompt(true);
        } else {
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            address: data.address || "",
            gender: data.gender || "",
            avatar: null,
          });
          setAvatarPreview(data.avatar || null);
        }
      } catch (err) {
        setError(`Failed to load profile: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, token, isLoggedIn, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, or GIF).");
        return;
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError("File size must not exceed 5MB.");
        return;
      }
      setFormData((prev) => ({ ...prev, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
      setError(null); // Clear any previous error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = new FormData();
      updatedData.append("firstName", formData.firstName);
      updatedData.append("lastName", formData.lastName);
      updatedData.append("address", formData.address);
      updatedData.append("gender", formData.gender);
      if (formData.avatar) {
        updatedData.append("Avatar", formData.avatar); // Adjusted to "Avatar" (capitalized)
      }

      await updateUserDetails(userId, updatedData, token);
      alert("Profile updated successfully!");
      navigate("/profile-role");
    } catch (err) {
      console.error("Full error:", err.response?.data);
      const errorDetails = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(", ")
        : err.response?.data?.title || err.message;
      setError(`Failed to update profile: ${errorDetails}`);
    }
  };

  const handleAddProfile = () => {
    navigate("/add-profilerole");
  };

  const handleReturn = () => {
    navigate(-1);
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
        .profile-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8f4e1 0%, #e5e5e5 100%);
          padding: 2rem;
          transition: background 0.3s ease;
        }
        .profile-page.dark {
          background: linear-gradient(135deg, #1c2526 0%, #34495e 100%);
        }
        .profile-container {
          background: rgba(255, 255, 255, 0.98);
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 28rem;
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .profile-page.dark .profile-container {
          background: rgba(52, 73, 94, 0.98);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }
        .profile-container:hover {
          transform: translateY(-4px);
        }
        .profile-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .profile-header h2 {
          font-family: "Poppins", sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: #2c3e50;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .profile-page.dark .profile-header h2 {
          color: #ecf0f1;
        }
        .avatar-section {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }
        .avatar-wrapper {
          position: relative;
          width: 8rem;
          height: 8rem;
        }
        .avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #6c4f37;
          transition: border 0.3s ease;
        }
        .profile-page.dark .avatar {
          border-color: #1abc9c;
        }
        .avatar-placeholder {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3.5rem;
          color: #6c4f37;
          border: 3px solid #6c4f37;
        }
        .profile-page.dark .avatar-placeholder {
          background: #34495e;
          color: #1abc9c;
          border-color: #1abc9c;
        }
        .avatar-upload {
          position: absolute;
          bottom: 0.5rem;
          right: 0.5rem;
          background: #6c4f37;
          color: #fff;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .profile-page.dark .avatar-upload {
          background: #1abc9c;
        }
        .avatar-upload:hover {
          background: #503a28;
          transform: scale(1.1);
        }
        .profile-page.dark .avatar-upload:hover {
          background: #16a085;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          font-family: "Roboto", sans-serif;
          font-size: 1rem;
          font-weight: 500;
          color: #2c3e50;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .profile-page.dark .form-group label {
          color: #ecf0f1;
        }
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          font-family: "Roboto", sans-serif;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          background: #fff;
          color: #2c3e50;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .profile-page.dark .form-group input,
        .profile-page.dark .form-group select {
          border-color: #5a758c;
          background: #2c3e50;
          color: #ecf0f1;
        }
        .form-group input:focus,
        .form-group select:focus {
          border-color: #6c4f37;
          box-shadow: 0 0 8px rgba(108, 79, 55, 0.3);
          outline: none;
        }
        .profile-page.dark .form-group input:focus,
        .profile-page.dark .form-group select:focus {
          border-color: #1abc9c;
          box-shadow: 0 0 8px rgba(26, 188, 156, 0.3);
        }
        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }
        .btn, .add-btn, .return-btn {
          padding: 0.75rem 1.5rem;
          font-family: "Poppins", sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          background: #6c4f37;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .profile-page.dark .btn, .profile-page.dark .add-btn, .profile-page.dark .return-btn {
          background: #1abc9c;
        }
        .btn:hover, .add-btn:hover, .return-btn:hover {
          background: #503a28;
          transform: translateY(-2px);
        }
        .profile-page.dark .btn:hover, .profile-page.dark .add-btn:hover, .profile-page.dark .return-btn:hover {
          background: #16a085;
        }
        .cancel-btn, .return-btn {
          background: #7f8c8d;
        }
        .profile-page.dark .cancel-btn, .profile-page.dark .return-btn {
          background: #bdc3c7;
        }
        .cancel-btn:hover, .return-btn:hover {
          background: #6c757d;
        }
        .profile-page.dark .cancel-btn:hover, .profile-page.dark .return-btn:hover {
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
        .profile-page.dark .notification {
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
        .profile-page.dark .loading, .profile-page.dark .error {
          color: #ecf0f1;
        }
      `}</style>

      <div className={`profile-page ${darkMode ? "dark" : ""}`}>
        <div className="profile-container">
          {showPrompt ? (
            <>
              <div className="notification">
                <FontAwesomeIcon icon={faExclamationTriangle} />
                There is no profile information available. Would you like to add your profile data?
              </div>
              <div className="form-actions">
                <button onClick={handleAddProfile} className="add-btn">
                  <FontAwesomeIcon icon={faSave} /> Yes, Add Profile
                </button>
                <button onClick={handleReturn} className="return-btn">
                  <FontAwesomeIcon icon={faTimes} /> No, Return
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="profile-header">
                <h2>
                  <FontAwesomeIcon icon={faUser} /> Edit Profile
                </h2>
              </div>
              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="avatar-section">
                  <div className="avatar-wrapper">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="avatar" />
                    ) : (
                      <FontAwesomeIcon icon={faUser} className="avatar-placeholder" />
                    )}
                    <label className="avatar-upload">
                      <FontAwesomeIcon icon={faCamera} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        hidden
                      />
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    <FontAwesomeIcon icon={faUser} /> First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    <FontAwesomeIcon icon={faUser} /> Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>
                    <FontAwesomeIcon icon={faVenusMars} /> Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn save-btn">
                    <FontAwesomeIcon icon={faSave} /> Save
                  </button>
                  <button type="button" className="btn cancel-btn" onClick={handleReturn}>
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EditProfileRole;