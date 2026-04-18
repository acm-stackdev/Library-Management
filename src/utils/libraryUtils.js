export const getBookCoverUrl = (book) => {
  if (!book) return "https://via.placeholder.com/300x400?text=No+Cover";
  
  if (book.isbn) {
    return `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;
  }
  
  return book.coverImage || "https://via.placeholder.com/300x400?text=No+Cover";
};

export const formatAuthors = (authors) => {
  if (!authors) return "Unknown Author";
  if (Array.isArray(authors)) {
    return authors.length > 0 ? authors.join(", ") : "Unknown Author";
  }
  return authors;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Generic filter function for searching through arrays of objects
 * @param {Array} items - The list of items to filter
 * @param {string} query - The search query
 * @param {Array} fields - The keys to search in (supports nested arrays like authorNames)
 */
export const filterItems = (items, query, fields) => {
  if (!query || !query.trim()) return items;
  if (!items || !Array.isArray(items)) return [];

  const lowerQuery = query.toLowerCase().trim();

  return items.filter((item) => {
    return fields.some((field) => {
      const value = item[field];

      if (!value) return false;

      if (Array.isArray(value)) {
        return value.some(
          (val) => val && val.toString().toLowerCase().includes(lowerQuery)
        );
      }

      return value.toString().toLowerCase().includes(lowerQuery);
    });
  });
};
