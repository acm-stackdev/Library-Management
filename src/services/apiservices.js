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
  };
};

export const booksService = createApiService("/books");
