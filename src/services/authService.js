import api from "./api";

const authService = {
  login: async (email, password) => {
    const response = await api.post("/account/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (name, email, password) => {
    try {
      const response = await api.post("/account/register", {
        name,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  forgetPassword: async (email) => {
    try {
      const response = await api.post("/account/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  resetPassword: async (email, token, newPassword) => {
    try {
      const response = await api.post("/account/reset-password", {
        email,
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: () => {
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("user"));
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("user");
  },
};

export default authService;
