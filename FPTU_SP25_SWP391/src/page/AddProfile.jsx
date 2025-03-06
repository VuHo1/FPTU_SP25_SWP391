import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { createUserDetails } from "../api/testApi"; // We'll add this to testApi.jsx

const AddProfile = ({ darkMode }) => {
  const { userId, token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    gender: "",
    avatar: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = { userId, ...formData };
      await createUserDetails(data, token);
      alert("Profile created successfully!");
      navigate("/profile");
    } catch (err) {
      setError(`Failed to create profile: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .add-profile-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #f8f4e1 0%, #e5e5e5 100%);
          padding: 40px 20px;
          transition: background 0.3s ease;
        }
        .add-profile-page.dark {
          background: linear-gradient(135deg, #1c2526 0%, #34495e 100%);
        }
        .add-profile-container {
          background: rgba(255, 255, 255, 0.95);
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 600px;
          transition: background 0.3s ease;
        }
        .add-profile-page.dark .add-profile-container {
          background: rgba(52, 73, 94, 0.95);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
        }
        .add-profile-container h2 {
          font-size: 24px;
          font-family: "Poppins", sans-serif;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 20px;
        }
        .add-profile-page.dark .add-profile-container h2 {
          color: #ecf0f1;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          font-size: 16px;
          font-family: "Roboto", sans-serif;
          color: #2c3e50;
          margin-bottom: 5px;
        }
        .add-profile-page.dark .form-group label {
          color: #ecf0f1;
        }
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          font-family: "Roboto", sans-serif;
          border: 1px solid #ddd;
          border-radius: 5px;
          background: #fff;
          color: #2c3e50;
          transition: border-color 0.3s ease;
        }
        .add-profile-page.dark .form-group input,
        .add-profile-page.dark .form-group select {
          border-color: #5a758c;
          background: #34495e;
          color: #ecf0f1;
        }
        .form-group input:focus,
        .form-group select:focus {
          border-color: #6c4f37;
          outline: none;
        }
        .add-profile-page.dark .form-group input:focus,
        .add-profile-page.dark .form-group select:focus {
          border-color: #1abc9c;
        }
        .submit-btn {
          padding: 12px 25px;
          font-size: 16px;
          font-family: "Poppins", sans-serif;
          font-weight: 600;
          color: #fff;
          background: #6c4f37;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
        }
        .add-profile-page.dark .submit-btn {
          background: #1abc9c;
        }
        .submit-btn:hover {
          background: #503a28;
          transform: scale(1.05);
        }
        .add-profile-page.dark .submit-btn:hover {
          background: #16a085;
        }
        .submit-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
        }
        .error {
          color: #721c24;
          background: #f8d7da;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 20px;
          font-family: "Roboto", sans-serif;
        }
        .add-profile-page.dark .error {
          color: #fff;
          background: #f44336;
        }
      `}</style>

      <div className={`add-profile-page ${darkMode ? "dark" : ""}`}>
        <div className="add-profile-container">
          <h2>Add Profile Information</h2>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Avatar URL</label>
              <input
                type="text"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProfile;