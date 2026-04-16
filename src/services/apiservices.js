import api from "./api";

export const createApiService = (endpoint) => {
  return {
    getAll: async () => {
      try {
        const response = await api.get(endpoint);
        return response.data;
      } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error);
        throw error;
      }
    },

    getById: async (id) => {
      try {
        const response = await api.get(`${endpoint}/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching from ${endpoint}/${id}:`, error);
        throw error;
      }
    },

    create: async (data) => {
      try {
        const response = await api.post(endpoint, data);
        return response.data;
      } catch (error) {
        console.error(`Error creating at ${endpoint}:`, error);
        throw error;
      }
    },

    postById: async (id) => {
      const response = await api.post(`${endpoint}/${id}`);
      return response.data;
    },

    delete: async (id) => {
      try {
        const response = await api.delete(`${endpoint}/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error deleting from ${endpoint}/${id}:`, error);
        throw error;
      }
    },
  };
};

export const booksService = createApiService("/books");
export const categoriesService = createApiService("/category");
export const wishlistService = createApiService("/Wishlist");
