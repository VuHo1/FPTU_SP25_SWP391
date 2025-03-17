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
export const updatePassword = async (data) => {
  try {
    const response = await apiClient.put(`/api/users/update-password`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    });
    console.log("Password updated successfully:", response.data);
    return response;
  } catch (error) {
    console.error("Error updating password:", error.response?.data || error);
    throw error;
  }
};

// Services
export const getServiceCategories = async (token) => {
  try {
    const response = await apiClient.get(`/api/ServiceCategory`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
    });
    console.log("Service Categories Response:", response.data);
    return response;
  } catch (error) {
    console.error("Error fetching service categories:", JSON.stringify(error.response?.data, null, 2));
    throw error;
  }
};

export const getListServicesByUserId = async (userId, token) => {
  try {
    console.log("Calling GET /api/services/user with userId:", userId);
    const response = await apiClient.get(`/api/services/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
    });
    console.log("Services Response:", response.data);
    return response;
  } catch (error) {
    console.error("Error fetching services by user ID:", JSON.stringify(error.response?.data, null, 2));
    throw error;
  }
};

export const getAllServices = async (token) => {
  try {
    const response = await apiClient.get(`/api/Service`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
    });
    console.log("All Services Response:", response.data);
    return response;
  } catch (error) {
    console.error("Error fetching all services:", JSON.stringify(error.response?.data, null, 2));
    throw error;
  }
};

export const postCreateService = async (serviceData, token) => {
  try {
    const response = await apiClient.post(`/api/Service`, serviceData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Created service:", response.data);
    return response;
  } catch (error) {
    console.error("Error creating service:", JSON.stringify(error.response?.data, null, 2));
    throw error;
  }
};

export const updateService = async (serviceId, serviceData, token) => {
  try {
    console.log("Calling PUT /api/Service with serviceId:", serviceId, "and data:", serviceData);
    const response = await apiClient.put(`/api/Service/${serviceId}`, serviceData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Updated Service Response:", response.data);
    return response;
  } catch (error) {
    console.error("Error updating service:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteService = async (serviceId, token) => {
  try {
    const response = await apiClient.delete(`/api/Service/${serviceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
    });
    console.log("Deleted service:", serviceId);
    return response;
  } catch (error) {
    console.error("Error deleting service:", JSON.stringify(error.response?.data, null, 2));
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
// export const getUserDetails = async (userId, token) => {
//   try {
//     console.log("Making GET request to /api/UserDetails/", userId);
//     const response = await apiClient.get(`/api/UserDetails/${userId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         Accept: "*/*",
//       },
//     });
//     console.log("GET UserDetails response:", response.data);
//     return response;
//   } catch (error) {
//     console.error("Error fetching user details:", error.response?.data || error);
//     throw error;
//   }
// };
// User Details
export const getUserDetails = async (userId, token) => {
  try {
    console.log("Making GET request to /api/UserDetails/", userId);
    const response = await apiClient.get(`/api/UserDetails/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",

        Accept: "*/*",
      },
    });
    console.log("GET UserDetails response:", response.data);
    return response;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log("No user details found for userId:", userId);
      return { data: {} }; // Return empty object for 404
    }
    console.error("Error fetching user details:", error.response?.data || error);
    throw error; // Throw for other errors (e.g., 500, 401)
  }
};

// export const updateUserDetails = async (userId, data, token) => {
//   try {
//     console.log("Making PUT request to /api/UserDetails/UpdateUser", userId);
//     console.log("Update data being sent:", Object.fromEntries(data));
//     const response = await apiClient.put(`/api/UserDetails/UpdateUser/${userId}`, data, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         Accept: "*/*",
//       },
//     });
//     console.log("PUT UserDetails response:", response.data);
//     return response;
//   } catch (error) {
//     console.error("Error updating user details:", error.response?.data || error);
//     throw error;
//   }
// };
export const updateUserDetails = async (userId, data, token) => {
  try {
    console.log("Making PUT request to /api/UserDetails/UpdateUser");
    const formData = new FormData();
    formData.append("UserId", userId); // Add UserId to the body
    formData.append("FirstName", data.get("firstName"));
    formData.append("LastName", data.get("lastName"));
    formData.append("Address", data.get("address"));
    formData.append("Gender", data.get("gender"));
    if (data.get("Avatar")) {
      formData.append("avatarFile", data.get("Avatar")); // Match server's expected field name
    }

    console.log("Update data being sent:", Object.fromEntries(formData));
    const response = await apiClient.put(`/api/UserDetails/UpdateUser`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
        // No need to set Content-Type; Axios sets it to multipart/form-data automatically
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
    const response = await apiClient.post(`/api/UserDetails/CreateUserDetail`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
        Accept: "*/*",
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating user details:", error.response?.data || error);
    throw error;
  }
};

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
export const getAllTherapistSpecialties = async (token) => {
  try {
    const response = await apiClient.get(`/api/TherapistSpecialty/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/plain",
      },
    });
    console.log("All therapist specialties:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching therapist specialties:", error.response?.data || error);
    throw error;
  }
};

export const updateTherapistCategories = async (therapistId, categoryIds, token) => {
  try {
    console.log("Updating therapist categories for therapistId:", therapistId, "with categoryIds:", categoryIds);
    if (!therapistId) throw new Error("therapistId is required");
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      console.log("No valid category IDs provided; skipping update.");
      return [];
    }
    if (!token) throw new Error("Authentication token is required");

    const validCategoryIds = categoryIds
      .filter(id => id !== null && id !== undefined)
      .map(id => Number(id));

    const requests = validCategoryIds.map(categoryId =>
      apiClient.post(
        `/api/TherapistSpecialty/create`,
        {
          therapistId: Number(therapistId), // Lowercase to match API
          serviceCategoryId: Number(categoryId), // Lowercase to match API
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      )
    );

    const responses = await Promise.all(requests);
    console.log("Therapist categories updated successfully:", responses.map(res => res.data));
    return responses;
  } catch (error) {
    console.error("Error updating therapist categories:", error.response?.data || error);
    throw error;
  }
};

export const createTherapistSpecialty = async (therapistId, serviceCategoryId, token) => {
  try {
    console.log("Creating therapist specialty:", { therapistId, serviceCategoryId });
    if (!therapistId || !serviceCategoryId) throw new Error("therapistId and serviceCategoryId are required");
    if (!token) throw new Error("Authentication token is required");

    const response = await apiClient.post(
      `/api/TherapistSpecialty/create`,
      {
        therapistId: Number(therapistId),
        serviceCategoryId: Number(serviceCategoryId),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Therapist specialty created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating therapist specialty:", error.response?.data || error);
    throw error;
  }
};
// Add this to your existing API file (e.g., test.api.js)

// ... (existing imports and code remain unchanged)

export const createTherapistSchedule = async (scheduleData, token) => {
  try {
    const response = await apiClient.post("/api/TherapistSchedule", scheduleData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Schedule created successfully:", response.data);
    return response;
  } catch (error) {
    console.error("Error creating schedule:", JSON.stringify(error.response?.data, null, 2));
    throw error;
  }
};

export const getTherapistSchedules = async (token) => {
  try {
    const response = await apiClient.get("/api/TherapistSchedule", {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Fetched therapist schedules (raw):", JSON.stringify(response.data, null, 2));
    return response;
  } catch (error) {
    console.error("Error fetching therapist schedules:", error.response?.data || error);
    throw error;
  }
};