import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import FormDropdown from "./FormDropdown";
import { Shield } from "lucide-react";

describe("FormDropdown Component", () => {
  const options = [
    { id: "admin", name: "Admin" },
    { id: "user", name: "User" },
    { id: "librarian", name: "Librarian" },
  ];

  it("renders with placeholder when no value is selected", () => {
    render(
      <FormDropdown
        options={options}
        value={null}
        onChange={() => {}}
        placeholder="Select Role"
      />,
    );
    expect(screen.getByText("Select Role")).toBeInTheDocument();
  });

  it("renders with selected option name", () => {
    render(
      <FormDropdown options={options} value="admin" onChange={() => {}} />,
    );
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("renders an icon when provided", () => {
    const { container } = render(
      <FormDropdown
        options={options}
        value="admin"
        onChange={() => {}}
        icon={Shield}
      />,
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("opens the options list when clicked", async () => {
    const user = userEvent.setup();
    render(<FormDropdown options={options} value="user" onChange={() => {}} />);

    const button = screen.getByRole("button");
    await user.click(button);

    // After clicking, options should be visible
    options.forEach((opt) => {
      const elements = screen.getAllByText(opt.name);
      expect(elements.length).toBeGreaterThan(0);
      expect(elements[0]).toBeInTheDocument();
    });
  });

  it("calls onChange when an option is selected", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(
      <FormDropdown options={options} value="user" onChange={handleChange} />,
    );

    const button = screen.getByRole("button");
    await user.click(button);

    // Get the option from the listbox, not the button
    const adminOption = screen.getByRole("option", { name: "Admin" });
    await user.click(adminOption);

    expect(handleChange).toHaveBeenCalledWith("admin");
  });

  it("applies correct size classes", () => {
    const { rerender } = render(
      <FormDropdown
        options={options}
        value="user"
        onChange={() => {}}
        size="sm"
      />,
    );
    // Check for small container class
    expect(screen.getByRole("button").closest("div")).toHaveClass("w-40");

    rerender(
      <FormDropdown
        options={options}
        value="user"
        onChange={() => {}}
        size="md"
      />,
    );
    // Check for medium/full container class
    expect(screen.getByRole("button").closest("div")).toHaveClass("w-full");
  });
});
