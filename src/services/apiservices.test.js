import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "./api";
import {
  createApiService,
  adminService,
  roleService,
  borrowService,
} from "./apiservices";

// Mock the api module
vi.mock("./api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("API Services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createApiService (Generic)", () => {
    const testService = createApiService("/test");

    it("getAll should call api.get with the correct endpoint", async () => {
      const mockData = [{ id: 1, name: "Item 1" }];
      api.get.mockResolvedValueOnce({ data: mockData });

      const result = await testService.getAll();

      expect(api.get).toHaveBeenCalledWith("/test");
      expect(result).toEqual(mockData);
    });

    it("getById should call api.get with the correct endpoint and id", async () => {
      const mockData = { id: 1, name: "Item 1" };
      api.get.mockResolvedValueOnce({ data: mockData });

      const result = await testService.getById(1);

      expect(api.get).toHaveBeenCalledWith("/test/1");
      expect(result).toEqual(mockData);
    });

    it("create should call api.post with the correct endpoint and data", async () => {
      const postData = { name: "New Item" };
      api.post.mockResolvedValueOnce({ data: postData });

      const result = await testService.create(postData);

      expect(api.post).toHaveBeenCalledWith("/test", postData);
      expect(result).toEqual(postData);
    });

    it("update should call api.put with the correct endpoint and data", async () => {
      const putData = { id: 1, name: "Updated Item" };
      api.put.mockResolvedValueOnce({ data: putData });

      const result = await testService.update(1, putData);

      expect(api.put).toHaveBeenCalledWith("/test/1", putData);
      expect(result).toEqual(putData);
    });

    it("delete should call api.delete with the correct endpoint", async () => {
      api.delete.mockResolvedValueOnce({ data: { success: true } });

      const result = await testService.delete(1);

      expect(api.delete).toHaveBeenCalledWith("/test/1");
      expect(result).toEqual({ success: true });
    });
  });

  describe("adminService", () => {
    it("getAllUsers should call api.get('/Admin/users')", async () => {
      api.get.mockResolvedValueOnce({ data: [] });
      await adminService.getAllUsers();
      expect(api.get).toHaveBeenCalledWith("/Admin/users");
    });

    it("deleteUser should call api.delete with user id", async () => {
      api.delete.mockResolvedValueOnce({ data: {} });
      await adminService.deleteUser("user-123");
      expect(api.delete).toHaveBeenCalledWith("/Admin/delete-user/user-123");
    });
  });

  describe("roleService", () => {
    it("create should call api.post with stringified name and correct headers", async () => {
      api.post.mockResolvedValueOnce({ data: {} });
      await roleService.create("Admin");
      expect(api.post).toHaveBeenCalledWith(
        "/Role",
        JSON.stringify("Admin"),
        expect.objectContaining({
          headers: { "Content-Type": "application/json" },
        })
      );
    });

    it("assignRole should call api.post with userId and roleName", async () => {
      api.post.mockResolvedValueOnce({ data: {} });
      await roleService.assignRole("user-1", "Librarian");
      expect(api.post).toHaveBeenCalledWith("/Role/assign-role-to-user", {
        userId: "user-1",
        roleName: "Librarian",
      });
    });
  });

  describe("borrowService", () => {
    it("borrowBook should call api.post with bookId", async () => {
      api.post.mockResolvedValueOnce({ data: {} });
      await borrowService.borrowBook(5);
      expect(api.post).toHaveBeenCalledWith("/BorrowRecord/borrow/5");
    });

    it("returnBook should call api.delete with borrowRecordId", async () => {
      api.delete.mockResolvedValueOnce({ data: {} });
      await borrowService.returnBook(10);
      expect(api.delete).toHaveBeenCalledWith("/BorrowRecord/return/10");
    });
  });
});
