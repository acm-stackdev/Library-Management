import { describe, it, expect } from "vitest";
import { getBookCoverUrl, formatAuthors, truncateText, filterItems } from "./libraryUtils";

describe("libraryUtils", () => {
  describe("getBookCoverUrl", () => {
    it("should return Open Library URL if ISBN is present", () => {
      const book = { isbn: "1234567890" };
      expect(getBookCoverUrl(book)).toBe(
        "https://covers.openlibrary.org/b/isbn/1234567890-L.jpg"
      );
    });

    it("should return coverImage if ISBN is missing but coverImage exists", () => {
      const book = { coverImage: "https://example.com/cover.jpg" };
      expect(getBookCoverUrl(book)).toBe("https://example.com/cover.jpg");
    });

    it("should return placeholder if both ISBN and coverImage are missing", () => {
      const book = {};
      expect(getBookCoverUrl(book)).toContain("placeholder");
    });

    it("should return placeholder if book is null", () => {
      expect(getBookCoverUrl(null)).toContain("placeholder");
    });
  });

  describe("formatAuthors", () => {
    it("should join multiple authors with a comma", () => {
      const authors = ["Author One", "Author Two"];
      expect(formatAuthors(authors)).toBe("Author One, Author Two");
    });

    it("should return the author string if it's not an array", () => {
      expect(formatAuthors("Single Author")).toBe("Single Author");
    });

    it("should return 'Unknown Author' if authors list is empty", () => {
      expect(formatAuthors([])).toBe("Unknown Author");
    });

    it("should return 'Unknown Author' if authors is null/undefined", () => {
      expect(formatAuthors(null)).toBe("Unknown Author");
    });
  });

  describe("truncateText", () => {
    it("should truncate text longer than maxLength", () => {
      const text = "This is a very long text that needs to be truncated.";
      expect(truncateText(text, 10)).toBe("This is a ...");
    });

    it("should not truncate text shorter than maxLength", () => {
      const text = "Short text";
      expect(truncateText(text, 50)).toBe("Short text");
    });

    it("should return empty string if text is null", () => {
      expect(truncateText(null)).toBe("");
    });
  });

  describe("filterItems", () => {
    const books = [
      { title: "React Guide", authorNames: ["John Doe"], isbn: "123" },
      { title: "Vue Basics", authorNames: ["Jane Smith"], isbn: "456" },
      { title: "Advanced JS", authorNames: ["John Doe", "Jane Smith"], isbn: "789" },
    ];

    it("should return all items if query is empty", () => {
      expect(filterItems(books, "", ["title"])).toHaveLength(3);
      expect(filterItems(books, "   ", ["title"])).toHaveLength(3);
    });

    it("should filter by title", () => {
      const result = filterItems(books, "react", ["title"]);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("React Guide");
    });

    it("should filter by array field (authorNames)", () => {
      const result = filterItems(books, "Jane", ["authorNames"]);
      expect(result).toHaveLength(2); // Vue Basics and Advanced JS
    });

    it("should filter by multiple fields (title and isbn)", () => {
      const result = filterItems(books, "456", ["title", "isbn"]);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Vue Basics");
    });

    it("should be case insensitive", () => {
      const result = filterItems(books, "JS", ["title"]);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Advanced JS");
    });

    it("should return empty array if no matches found", () => {
      const result = filterItems(books, "Python", ["title"]);
      expect(result).toHaveLength(0);
    });

    it("should handle null items array gracefully", () => {
      expect(filterItems(null, "query", ["title"])).toEqual([]);
    });
  });
});
