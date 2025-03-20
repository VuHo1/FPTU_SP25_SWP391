import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { createUserDetails } from "../api/testApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMapMarkerAlt,
  faVenusMars,
  faCamera,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const AddProfileRole = ({ darkMode }) => {
  const { userId, token, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    gender: "",
    avatarUrl: "", // Changed from 'avatar' to 'avatarUrl' to store the Cloudinary URL
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isLoggedIn || !userId || !token) {
    navigate("/sign_in");
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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

    setLoading(true);
    setError(null);

    // Upload to Cloudinary
    const cloudinaryData = new FormData();
    cloudinaryData.append("file", file);
    cloudinaryData.append("upload_preset", "skincare"); // Replace with your Cloudinary upload preset
    cloudinaryData.append("cloud_name", "dhqfg7lrc"); // Replace with your Cloudinary cloud name
    cloudinaryData.append("api_key", "YOUR_API_KEY"); // Replace with your Cloudinary API key

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dhqfg7lrc/image/upload", // Replace 'dhqfg7lrc' with your cloud name
        {
          method: "POST",
          body: cloudinaryData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      const result = await response.json();
      const imageUrl = result.secure_url; // Get the secure URL from Cloudinary

      setFormData((prev) => ({ ...prev, avatarUrl: imageUrl }));
      setAvatarPreview(URL.createObjectURL(file)); // For local preview
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      setError("Failed to upload image: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newProfileData = {
        userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        gender: formData.gender,
        avatar: formData.avatarUrl, // Send the Cloudinary URL as 'avatar'
      };

      await createUserDetails(newProfileData, token);
      alert("Profile created successfully!");
      navigate("/profile-role");
    } catch (err) {
      console.error("Full error:", err.response?.data || err);
      const errorDetails = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(", ")
        : err.response?.data?.title || err.message;
      setError(`Failed to create profile: ${errorDetails}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-2);
  };

  return (
    <>
      <style>{`
        .add-profile-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8f4e1 0%, #e5e5e5 100%);
          padding: 2rem;
          transition: background 0.3s ease;
        }
        .add-profile-page.dark {
          background: linear-gradient(135deg, #1c2526 0%, #34495e 100%);
        }
        .add-profile-container {
          background: rgba(255, 255, 255, 0.98);
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 28rem;
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .add-profile-page.dark .add-profile-container {
          background: rgba(52, 73, 94, 0.98);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }
        .add-profile-container:hover {
          transform: translateY(-4px);
        }
        .add-profile-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .add-profile-header h2 {
          font-family: "Poppins", sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: #2c3e50;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .add-profile-page.dark .add-profile-header h2 {
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
        .add-profile-page.dark .avatar {
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
        .add-profile-page.dark .avatar-placeholder {
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
        .add-profile-page.dark .avatar-upload {
          background: #1abc9c;
        }
        .avatar-upload:hover {
          background: #503a28;
          transform: scale(1.1);
        }
        .add-profile-page.dark .avatar-upload:hover {
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
        .add-profile-page.dark .form-group label {
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
        .add-profile-page.dark .form-group input,
        .add-profile-page.dark .form-group select {
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
        .add-profile-page.dark .form-group input:focus,
        .add-profile-page.dark .form-group select:focus {
          border-color: #1abc9c;
          box-shadow: 0 0 8px rgba(26, 188, 156, 0.3);
        }
        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }
        .btn {
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
        .add-profile-page.dark .btn {
          background: #1abc9c;
        }
        .btn:hover {
          background: #503a28;
          transform: translateY(-2px);
        }
        .add-profile-page.dark .btn:hover {
          background: #16a085;
        }
        .cancel-btn {
          background: #7f8c8d;
        }
        .add-profile-page.dark .cancel-btn {
          background: #bdc3c7;
        }
        .cancel-btn:hover {
          background: #6c757d;
        }
        .add-profile-page.dark .cancel-btn:hover {
          background: #a1a9ac;
        }
        .error {
          font-family: "Roboto", sans-serif;
          font-size: 1rem;
          color: #721c24;
          background: #f8d7da;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .add-profile-page.dark .error {
          color: #fff;
          background: #f44336;
        }
      `}</style>

      <div className={`add-profile-page ${darkMode ? "dark" : ""}`}>
        <div className="add-profile-container">
          <div className="add-profile-header">
            <h2>
              <FontAwesomeIcon icon={faUser} /> Add Profile
            </h2>
          </div>
          {error && <div className="error">{error}</div>}
          <form className="add-profile-form" onSubmit={handleSubmit}>
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
                    disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn save-btn" disabled={loading}>
                <FontAwesomeIcon icon={faSave} /> {loading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="btn cancel-btn"
                onClick={handleCancel}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProfileRole;