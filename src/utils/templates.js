// Template for a single book card
export const createBookCard = (book, index, isFavorite) => `
  <article class="book-card">
    <div class="book-header">
      <img src="${book.cover}" alt="${book.title}" />
      <button class="btn-heart" data-index="${index}">
        ${isFavorite ? "❤️" : "🩶"}
      </button>
    </div>
    <div class="book-info">
      <h3>${book.title}</h3>
      <p>${book.author}</p>
      <p>${book.year}</p>
    </div>
  </article>
`;

// Simple spinner template
export const getLoaderTemplate = () => '<div class="spinner"></div>';
