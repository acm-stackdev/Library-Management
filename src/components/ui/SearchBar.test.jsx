import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import SearchBar from "./SearchBar";

describe("SearchBar Component", () => {
  it("renders with the correct placeholder", () => {
    render(
      <SearchBar
        value=""
        onChange={() => {}}
        onClear={() => {}}
        placeholder="Find a book..."
      />,
    );

    expect(screen.getByPlaceholderText("Find a book...")).toBeInTheDocument();
  });

  it("calls onChange when the user types", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar value="" onChange={handleChange} onClear={() => {}} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "React");

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenLastCalledWith("t");
  });

  it("shows the clear button only when there is a value", () => {
    const { rerender } = render(
      <SearchBar value="" onChange={() => {}} onClear={() => {}} />,
    );

    expect(screen.queryByTitle("Clear search")).not.toBeInTheDocument();

    rerender(
      <SearchBar value="Testing" onChange={() => {}} onClear={() => {}} />,
    );
    expect(screen.getByTitle("Clear search")).toBeInTheDocument();
  });

  it("calls onClear when the clear button is clicked", async () => {
    const handleClear = vi.fn();
    const user = userEvent.setup();

    render(
      <SearchBar value="Some text" onChange={() => {}} onClear={handleClear} />,
    );

    const clearButton = screen.getByTitle("Clear search");
    await user.click(clearButton);

    expect(handleClear).toHaveBeenCalledTimes(1);
  });
});
