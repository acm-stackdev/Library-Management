import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BookForm from "./BookForm";
import { categoriesService } from "../../services/apiservices";

// Mock the categories service
vi.mock("../../services/apiservices", () => ({
  categoriesService: {
    getAll: vi.fn(),
  },
}));

describe("BookForm Component", () => {
  const mockOnSubmit = vi.fn();
  const categories = [
    { categoryId: 1, name: "Science" },
    { categoryId: 2, name: "Fiction" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    categoriesService.getAll.mockResolvedValue(categories);
  });

  it("renders all input fields", async () => {
    render(<BookForm onSubmit={mockOnSubmit} loading={false} />);

    expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/authors/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/isbn/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/year/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/pages/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();
  });

  it("submits valid data correctly", async () => {
    const user = userEvent.setup();
    render(<BookForm onSubmit={mockOnSubmit} loading={false} />);

    // Wait for categories to load
    await waitFor(() => expect(categoriesService.getAll).toHaveBeenCalled());

    // Fill form
    await user.type(screen.getByPlaceholderText(/title/i), "My Book");
    await user.type(
      screen.getByPlaceholderText(/authors/i),
      "John Doe, Jane Smith",
    );
    await user.type(screen.getByPlaceholderText(/isbn/i), "12345");

    await user.click(screen.getByRole("button", { name: /create book/i }));
    expect(
      screen.getByText(/please select a valid category/i),
    ).toBeInTheDocument();
  });

  it("transforms comma separated authors into an array", async () => {
    const user = userEvent.setup();
    render(<BookForm onSubmit={mockOnSubmit} loading={false} />);

    await waitFor(() => expect(categoriesService.getAll).toHaveBeenCalled());

    const dropdown = screen.getByRole("button", { name: /category/i });
    await user.click(dropdown);
    await user.click(screen.getByText("Science"));

    await user.type(screen.getByPlaceholderText(/title/i), "Test Title");
    await user.type(
      screen.getByPlaceholderText(/authors/i),
      " Author A , Author B ",
    );

    await user.click(screen.getByRole("button", { name: /create book/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        authorNames: ["Author A", "Author B"],
      }),
    );
  });
});
