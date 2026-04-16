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

    update: async (id, data) => {
      try {
        const response = await api.put(`${endpoint}/${id}`, data);
        return response.data;
      } catch (error) {
        console.error(`Error updating at ${endpoint}/${id}:`, error);
        throw error;
      }
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

// ── The Admin Service ──

export const adminService = {
  // GET: /api/Admin/users
  getAllUsers: async () => {
    try {
      const response = await api.get("/Admin/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  },

  // DELETE: /api/Admin/delete-user/{userId}
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/Admin/delete-user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  },

  // GET: /api/Wishlist/admin/summary
  getWishlistSummary: async () => {
    try {
      const response = await api.get("/wishlist/admin/summary");
      return response.data;
    } catch (error) {
      console.error("Error fetching wishlist summary:", error);
      throw error;
    }
  },

  // GET: /api/Wishlist/admin/all
  getAllWishlists: async () => {
    try {
      const response = await api.get("/wishlist/admin/all");
      return response.data;
    } catch (error) {
      console.error("Error fetching all wishlists:", error);
      throw error;
    }
  },
};

// ── The Role Service ──
export const roleService = {
  // GET: /api/Role
  getAll: async () => {
    try {
      const response = await api.get("/Role");
      return response.data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  },

  // POST: /api/Role
  create: async (roleName) => {
    try {
      const response = await api.post("/Role", JSON.stringify(roleName), {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating role:", error);
      throw error;
    }
  },

  // PUT: /api/Role (Expects { roleId, newRoleName })
  update: async (roleId, newRoleName) => {
    try {
      const response = await api.put("/Role", { roleId, newRoleName });
      return response.data;
    } catch (error) {
      console.error("Error updating role:", error);
      throw error;
    }
  },

  // DELETE: /api/Role/{roleId}
  delete: async (roleId) => {
    try {
      const response = await api.delete(`/Role/${roleId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting role ${roleId}:`, error);
      throw error;
    }
  },

  // POST: /api/Role/assign-role-to-user
  assignRole: async (userId, roleName) => {
    try {
      const response = await api.post("/Role/assign-role-to-user", {
        userId,
        roleName,
      });
      return response.data;
    } catch (error) {
      console.error("Error assigning role:", error);
      throw error;
    }
  },
};

// ── The Subscription Service ──

export const subscriptionService = {
  // GET: /api/Subscription (Admin only)
  getAll: async () => {
    try {
      const response = await api.get("/Subscription");
      return response.data;
    } catch (error) {
      console.error("Error fetching all subscriptions:", error);
      throw error;
    }
  },

  // GET: /api/Subscription/{id} (Admin only)
  getById: async (id) => {
    try {
      const response = await api.get(`/Subscription/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching subscription ID ${id}:`, error);
      throw error;
    }
  },

  // POST: /api/Subscription (Admin only)
  createOrUpdate: async (subscriptionDto) => {
    try {
      const response = await api.post("/Subscription", subscriptionDto);
      return response.data;
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw error;
    }
  },

  // DELETE: /api/Subscription/user/{userId} (Admin only)
  deleteByUserId: async (userId) => {
    try {
      const response = await api.delete(`/Subscription/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing subscription for user ${userId}:`, error);
      throw error;
    }
  },

  // GET: /api/Subscription/me (Authenticated User)
  getMySubscription: async () => {
    try {
      const response = await api.get("/Subscription/me");
      return response.data;
    } catch (error) {
      console.warn("No active subscription found for current user.");
      throw error;
    }
  },
};

// ── The Borrow Service ──

export const borrowService = {
  // GET: /api/BorrowRecord for current user
  getMyHistory: async () => {
    try {
      const response = await api.get("/BorrowRecord");
      return response.data;
    } catch (error) {
      console.error("Error fetching personal borrow history:", error);
      throw error;
    }
  },

  // GET: /api/BorrowRecord/admin/all
  // ADMIN ONLY: Returns every borrow record in the database
  adminGetAll: async () => {
    try {
      const response = await api.get("/BorrowRecord/admin/all");
      return response.data;
    } catch (error) {
      console.error("Error fetching all borrow records:", error);
      throw error;
    }
  },

  // GET: /api/BorrowRecord/user/{userId}
  // ADMIN ONLY: Returns history for a specific member
  adminGetByUserId: async (userId) => {
    try {
      const response = await api.get(`/BorrowRecord/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching records for user ${userId}:`, error);
      throw error;
    }
  },

  // POST: /api/BorrowRecord/borrow/{bookId}
  borrowBook: async (bookId) => {
    try {
      const response = await api.post(`/BorrowRecord/borrow/${bookId}`);
      return response.data;
    } catch (error) {
      // The backend sends specific error messages (e.g., "Limit reached")
      // We'll catch these in the UI to show to the user
      throw error;
    }
  },

  // DELETE: /api/BorrowRecord/return/{borrowRecordId}
  returnBook: async (borrowRecordId) => {
    try {
      const response = await api.delete(
        `/BorrowRecord/return/${borrowRecordId}`,
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error processing return for record ${borrowRecordId}:`,
        error,
      );
      throw error;
    }
  },
};

export const booksService = createApiService("/books");
export const categoriesService = createApiService("/category");
export const wishlistService = createApiService("/Wishlist");
