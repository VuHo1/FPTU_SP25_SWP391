// page/Profile.jsx
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

const Profile = ({ darkMode }) => {
  const { userId, token, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);
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

  // Log auth values on mount and when they change
  useEffect(() => {
    console.log("Auth values:", { userId, token, isLoggedIn });
    
    if (!isLoggedIn || !userId || !token) {
      console.log("Missing auth data, redirecting to /*");
      navigate("/*");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        console.log("Fetching user details for userId:", userId);
        
        const response = await getUserDetails(userId, token);
        console.log("API Response from getUserDetails:", response);
        console.log("Response data:", response.data);

        const data = response.data || {};
        setUserDetails(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          address: data.address || "",
          gender: data.gender || "",
          avatar: null,
        });
        setAvatarPreview(data.avatar || null);
        console.log("Updated userDetails state:", data);
      } catch (err) {
        console.error("Error fetching user details:", err.response || err);
        setError(`Failed to load profile: ${err.message}`);
      } finally {
        setLoading(false);
        console.log("Loading complete, current states:", { loading: false, userDetails, error });
      }
    };

    fetchUserDetails();
  }, [userId, token, isLoggedIn, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    console.log("Form data updated:", { ...formData, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
      console.log("Avatar file selected:", file.name);
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

      console.log("Submitting update with data:");
      for (let pair of updatedData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await updateUserDetails(userId, updatedData, token);
      console.log("Update API Response:", response);
      console.log("Updated data:", response.data);

      alert("Profile updated successfully!");
      setEditMode(false);

      // Refresh user details
      const updatedResponse = await getUserDetails(userId, token);
      console.log("Refresh API Response:", updatedResponse);
      setUserDetails(updatedResponse.data || {});
    } catch (err) {
      console.error("Error updating profile:", err.response || err);
      setError(`Failed to update profile: ${err.message}`);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setError(null);
    console.log("Edit mode toggled:", !editMode);
  };

  if (loading) {
    console.log("Rendering loading state");
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    console.log("Rendering error state:", error);
    return <div className="error">{error}</div>;
  }

  if (!userDetails) {
    console.log("No user details available");
    return (
      <div className={`profile-page ${darkMode ? "dark" : ""}`}>
        <div className="profile-container">
          <h2>User Profile</h2>
          <p>No user details available.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* Your existing CSS remains unchanged */
        .profile-page {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f5f5f5;
            padding: 20px;
            transition: background-color 0.3s ease;
        }
        /* ... rest of your CSS ... */
      `}</style>

      <div className={`profile-page ${darkMode ? "dark" : ""}`}>
        <div className="profile-container">
          <h2>User Profile</h2>
          <div className="avatar-section">
            <div className="avatar-wrapper">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="avatar-image" />
              ) : (
                <FontAwesomeIcon icon={faUser} className="avatar-placeholder" />
              )}
              {editMode && (
                <label className="avatar-upload">
                  <FontAwesomeIcon icon={faCamera} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    hidden
                  />
                </label>
              )}
            </div>
          </div>

          {editMode ? (
            <form onSubmit={handleSubmit} className="profile-form">
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
                <button type="submit" className="btn btn-save">
                  <FontAwesomeIcon icon={faSave} /> Save
                </button>
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={toggleEditMode}
                >
                  <FontAwesomeIcon icon={faTimes} /> Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <p>
                <FontAwesomeIcon icon={faUser} />{" "}
                <strong>Name:</strong> {userDetails.firstName || "N/A"}{" "}
                {userDetails.lastName || "N/A"}
              </p>
              <p>
                <FontAwesomeIcon icon={faMapMarkerAlt} />{" "}
                <strong>Address:</strong> {userDetails.address || "Not provided"}
              </p>
              <p>
                <FontAwesomeIcon icon={faVenusMars} />{" "}
                <strong>Gender:</strong> {userDetails.gender || "Not provided"}
              </p>
              <button className="btn btn-edit" onClick={toggleEditMode}>
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;