import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@fortawesome/free-solid-svg-icons";

const EditProfile = ({ darkMode }) => {
  const { userId, token, isLoggedIn } = useAuth();
  const navigate = useNavigate();
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
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          address: data.address || "",
          gender: data.gender || "",
          avatar: null,
        });
        setAvatarPreview(data.avatar || null);
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
      setFormData((prev) => ({ ...prev, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
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
        updatedData.append("avatar", formData.avatar);
      }

      await updateUserDetails(userId, updatedData, token);
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      setError(`Failed to update profile: ${err.message}`);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
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
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #f8f4e1 0%, #e5e5e5 100%);
          padding: 20px;
          transition: background 0.3s ease;
        }
        .profile-page.dark {
          background: linear-gradient(135deg, #1c2526 0%, #34495e 100%);
        }
        .profile-container {
          background: rgba(255, 255, 255, 0.95);
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 500px;
          text-align: center;
          transition: background 0.3s ease;
        }
        .profile-page.dark .profile-container {
          background: rgba(52, 73, 94, 0.95);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
        }
        .profile-header {
          margin-bottom: 20px;
        }
        .profile-header h2 {
          font-size: 24px;
          font-family: "Poppins", sans-serif;
          font-weight: 600;
          color: #2c3e50;
          margin: 0;
        }
        .profile-page.dark .profile-header h2 {
          color: #ecf0f1;
        }
        .avatar-section {
          margin-bottom: 20px;
        }
        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #6c4f37;
        }
        .profile-page.dark .avatar {
          border-color: #1abc9c;
        }
        .avatar-placeholder {
          font-size: 60px;
          color: #6c4f37;
        }
        .profile-page.dark .avatar-placeholder {
          color: #1abc9c;
        }
        .avatar-wrapper {
          position: relative;
          display: inline-block;
        }
        .avatar-upload {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #6c4f37;
          color: #fff;
          padding: 5px;
          border-radius: 50%;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .profile-page.dark .avatar-upload {
          background: #1abc9c;
        }
        .avatar-upload:hover {
          background: #503a28;
        }
        .profile-page.dark .avatar-upload:hover {
          background: #16a085;
        }
        .form-group {
          margin-bottom: 15px;
          text-align: left;
        }
        .form-group label {
          display: flex;
          align-items: center;
          font-size: 16px;
          color: #2c3e50;
          font-family: "Roboto", sans-serif;
          margin-bottom: 5px;
        }
        .profile-page.dark .form-group label {
          color: #ecf0f1;
        }
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          font-family: "Roboto", sans-serif;
          border: 1px solid #ccc;
          border-radius: 5px;
          background: #fff;
          color: #2c3e50;
          transition: border-color 0.3s ease;
        }
        .profile-page.dark .form-group input,
        .profile-page.dark .form-group select {
          border-color: #ecf0f1;
          background: #2c3e50;
          color: #ecf0f1;
        }
        .form-group input:focus,
        .form-group select:focus {
          border-color: #6c4f37;
          outline: none;
        }
        .profile-page.dark .form-group input:focus,
        .profile-page.dark .form-group select:focus {
          border-color: #1abc9c;
        }
        .form-actions {
          display: flex;
          justify-content: space-between;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          padding: 10px 20px;
          font-size: 16px;
          font-family: "Poppins", sans-serif;
          font-weight: 600;
          color: #fff;
          background: #6c4f37;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
          margin: 10px;
        }
        .profile-page.dark .btn {
          background: #1abc9c;
        }
        .btn:hover {
          background: #503a28;
          transform: scale(1.05);
        }
        .profile-page.dark .btn:hover {
          background: #16a085;
        }
        .cancel-btn {
          background: #7f8c8d;
        }
        .profile-page.dark .cancel-btn {
          background: #bdc3c7;
        }
        .cancel-btn:hover {
          background: #6c757d;
        }
        .profile-page.dark .cancel-btn:hover {
          background: #a1a9ac;
        }
        .loading,
        .error {
          font-size: 18px;
          color: #2c3e50;
          text-align: center;
          padding: 20px;
        }
        .profile-page.dark .loading,
        .profile-page.dark .error {
          color: #ecf0f1;
        }
      `}</style>

      <div className={`profile-page ${darkMode ? "dark" : ""}`}>
        <div className="profile-container">
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
              <button type="button" className="btn cancel-btn" onClick={handleCancel}>
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;