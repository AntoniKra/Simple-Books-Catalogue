// Normalizes API data to our application's format
export const formatBook = (book) => ({
  title: book.title,
  author: book.author_name?.[0] || "Unknown",
  year: book.first_publish_year || "Unknown",
  cover: book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : "https://placehold.co/180x280?text=No+Cover",
});

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};
