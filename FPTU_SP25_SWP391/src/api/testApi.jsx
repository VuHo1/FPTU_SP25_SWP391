import axios from "axios";

const isLocal = true; // Set to true for Swagger testing at localhost:7063, false for production
const baseURL = isLocal
  ? "https://localhost:7063" // Local Swagger URL
  : "https://skincarebooking-eccebca6feeeakh9.southeastasia-01.azurewebsites.net"; // Production URL

const apiClient = axios.create({
  baseURL,
  timeout: 10000, // 10-second timeout
});

// Authentication
export const login = async (data) => {
  try {
    const response = await apiClient.post(`/api/auth/login`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    });
    return response;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const formData = new FormData();
    formData.append("EmailOrPhoneNumber", email);

    const response = await apiClient.post(
      `/api/Auth/user/password/forgot`,
      formData,
      {
        headers: {
          "Content-Type": `multipart/form-data`,
          Accept: "*/*",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const data = {
      token: token,
      newPassword: newPassword,
    };
    const response = await apiClient.post(
      `/api/Auth/user/password/reset`,
      data,
      {
        headers: {
          "Content-Type": `application/json`,
          Accept: "*/*",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const signUpUser = async (data) => {
  try {
    const response = await apiClient.post(
      `/api/users`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const signUpShop = async (data) => {
  try {
    const response = await apiClient.post(
      `/api/Auth/user/register/shop`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "*/*",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const verifyEmail = async (dataOTP) => {
  try {
    const response = await apiClient.post(
      `/api/Auth/user/otp/verify`,
      dataOTP,
      {
        headers: {
          "Content-Type": `application/json`,
          Accept: "*/*",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

// Services
export const getListServices = async (pageIndex = 0, pageSize = 100) => {
  try {
    const response = await apiClient.get(
      `/api/service/GetListServices?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const getServiceById = async (id) => {
  try {
    const response = await apiClient.get(
      `/api/service/ViewServiceById?serviceId=${id}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const getListServicesByUserId = async (userId, token) => {
  try {
    const response = await apiClient.get(
      `/api/service/ViewListServicesByUserId?userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const postCreateService = async (formData, token) => {
  try {
    const response = await apiClient.post(
      `/api/service/CreateService`,
      formData,
      {
        headers: {
          "Content-Type": `multipart/form-data`,
          Accept: "text/plain",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const getSubCategory = async () => {
  try {
    const response = await apiClient.get(`/Api/GetAllSubCategories`);
    return response;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

// Booking
export const postBooking = async (formData, token) => {
  try {
    const response = await apiClient.post(
      `/api/Booking/user/booking`,
      formData,
      {
        headers: {
          "Content-Type": `multipart/form-data`,
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const getBookingById = async (id, token) => {
  try {
    const response = await apiClient.get(`/api/Booking/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const postCheckout = async (bookingId, token) => {
  try {
    const response = await apiClient.post(
      `/api/Booking/payment/check-out/${bookingId}`,
      {},
      {
        headers: {
          "Content-Type": `multipart/form-data`,
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

// User Details
export const getUserDetails = async (userId, token) => {
  try {
    console.log("Making GET request to /api/UserDetails/", userId);
    const response = await apiClient.get(`/api/UserDetails/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
    });
    console.log("GET UserDetails response:", response.data);
    return response;
  } catch (error) {
    console.error("Error fetching user details:", error.response?.data || error);
    throw error;
  }
};

export const updateUserDetails = async (userId, data, token) => {
  try {
    console.log("Making PUT request to /api/UserDetails/", userId);
    console.log("Update data being sent:", Object.fromEntries(data));
    const response = await apiClient.put(`/api/UserDetails/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
        Accept: "*/*",
      },
    });
    console.log("PUT UserDetails response:", response.data);
    return response;
  } catch (error) {
    console.error("Error updating user details:", error.response?.data || error);
    throw error;
  }
};

// Admin-specific endpoints
export const createTherapist = async (data, token) => {
  try {
    const response = await apiClient.post(`/api/users/create-therapist`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating therapist:", error);
    throw error;
  }
};

export const createStaff = async (data, token) => {
  try {
    const response = await apiClient.post(`/api/users/create-staff`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating staff:", error);
    throw error;
  }
};

// Fetch all users
export const getAllUsers = async (token) => {
  try {
    const response = await apiClient.get(`/api/users`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("All users response:", response.data);
    return response;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

// In testApi.jsx
export const deleteUser = async (userId, token) => {
  try {
    const response = await apiClient.delete(`/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
    });
    return response;
  } catch (error) {
    console.error("Error deleting user:", error.response?.data || error);
    throw error; // Let the caller handle the error
  }
};
// In testApi.jsx, add this function
export const createUserDetails = async (data, token) => {
  try {
    const response = await apiClient.post(`/api/UserDetails`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating user details:", error.response?.data || error);
    throw error;
  }
};