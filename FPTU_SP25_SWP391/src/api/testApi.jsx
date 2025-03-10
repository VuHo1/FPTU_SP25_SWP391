import axios from "axios";

const isLocal = true;
const baseURL = isLocal
  ? "https://localhost:7063"
  : "https://skincarebooking-eccebca6feeeakh9.southeastasia-01.azurewebsites.net";

const apiClient = axios.create({
  baseURL,
  timeout: 10000,
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

// export const forgotPassword = async (email) => {
//   try {
//     const formData = new FormData();
//     formData.append("EmailOrPhoneNumber", email);
//     const response = await apiClient.post(`/api/Auth/user/password/forgot`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Accept: "*/*",
//       },
//     });
//     return response;
//   } catch (error) {
//     console.error("Error during forgot password:", error);
//     throw error;
//   }
// };

// export const resetPassword = async (token, newPassword) => {
//   try {
//     const data = { token, newPassword };
//     const response = await apiClient.post(`/api/Auth/user/password/reset`, data, {
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "*/*",
//       },
//     });
//     return response;
//   } catch (error) {
//     console.error("Error during reset password:", error);
//     throw error;
//   }
// };

export const signUpUser = async (data) => {
  try {
    const response = await apiClient.post(`/api/users`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    });
    return response;
  } catch (error) {
    console.error("Error during user signup:", error);
    throw error;
  }
};

// export const signUpShop = async (data) => {
//   try {
//     const response = await apiClient.post(`/api/Auth/user/register/shop`, data, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Accept: "*/*",
//       },
//     });
//     return response;
//   } catch (error) {
//     console.error("Error during shop signup:", error);
//     throw error;
//   }
// };

// export const verifyEmail = async (dataOTP) => {
//   try {
//     const response = await apiClient.post(`/api/Auth/user/otp/verify`, dataOTP, {
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "*/*",
//       },
//     });
//     return response;
//   } catch (error) {
//     console.error("Error during email verification:", error);
//     throw error;
//   }
// };

// Services
export const getServiceCategories = async (token) => {
  try {
    const response = await apiClient.get(`/api/ServiceCategory`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching service categories:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getServiceById = async (id) => {
  try {
    const response = await apiClient.get(`/api/service/ViewServiceById?serviceId=${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching service by ID:", error);
    throw error;
  }
};

export const getListServicesByUserId = async (userId, token) => {
  try {
    const response = await apiClient.get(`/api/service/ViewListServicesByUserId?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching services by user ID:", error);
    throw error;
  }
};

export const postCreateService = async (formData, token) => {
  try {
    const response = await apiClient.post(`/api/service/CreateService`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
};

export const postServiceCategory = async (serviceData, token) => {
  try {
    const response = await apiClient.post(`/api/ServiceCategory`, serviceData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating service category:", error);
    throw error;
  }
};

export const getSubCategory = async () => {
  try {
    const response = await apiClient.get(`/Api/GetAllSubCategories`);
    return response;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
};

// Booking
export const postBooking = async (formData, token) => {
  try {
    const response = await apiClient.post(`/api/Booking/user/booking`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating booking:", error);
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
    console.error("Error fetching booking by ID:", error);
    throw error;
  }
};

export const postCheckout = async (bookingId, token) => {
  try {
    const response = await apiClient.post(`/api/Booking/payment/check-out/${bookingId}`, {}, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error during checkout:", error);
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
    throw error;
  }
};

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

// testApi.js (updated section only - add these to your existing file)
export const updateServiceCategory = async (serviceCategoryId, serviceData, token) => {
  try {
    const response = await apiClient.put(`/api/ServiceCategory/${serviceCategoryId}`, serviceData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating service category:", error);
    throw error;
  }
};

export const deleteServiceCategory = async (serviceCategoryId, token) => {
  try {
    const response = await apiClient.delete(`/api/ServiceCategory/${serviceCategoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
    });
    return response;
  } catch (error) {
    console.error("Error deleting service category:", error);
    throw error;
  }
};