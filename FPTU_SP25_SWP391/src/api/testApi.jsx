// configApi.js
import axios from "axios";

const isLocal = true; // Set to true for Swagger testing at localhost:7063, false for production
const baseURL = isLocal
  ? "https://localhost:7063" // Local Swagger URL
  : "https://petserviceplatform-dpgyc0c3fcg9dtc7.southeastasia-01.azurewebsites.net"; // Production URL

const apiClient = axios.create({
  baseURL,
  timeout: 10000, // 10-second timeout
});

//authencation
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
      `/api/Auth/user/register/user`,
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

//services
export const getListServices = async (pageIndex = 0, pageSize = 100) => {
  try {
    const response = await apiClient.get(
      `/api/service/GetListServices?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return response; // Trả về dữ liệu
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error; // Ném lại lỗi để xử lý bên ngoài
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
          accept: "*/*",
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
    const reponse = await apiClient.post(
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
    return reponse;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const getSubCatergoy = async () => {
  try {
    const response = await apiClient.get(`/Api/GetAllSubCategories`);
    return response;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

//booking

export const postBooking = async (formData, token) => {
  try {
    const reponse = await apiClient.post(
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
    return reponse;
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
    const reponse = await apiClient.post(
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
    return reponse;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};