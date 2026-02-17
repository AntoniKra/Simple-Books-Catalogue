import { fetchBooksFromApi } from "./api/books.js";
import { formatBook, debounce } from "./utils/helpers.js";
import { createBookCard, getLoaderTemplate } from "./utils/templates.js";

// --- SELECTORS ---
const searchForm = document.querySelector("#search");
const searchInput = document.querySelector("#search-input");
const booksContainer = document.querySelector("#book-section");
const favoriteContainer = document.querySelector("#favorite-section");
const bookTab = document.querySelector("#tab-books");
const favTab = document.querySelector("#tab-favorites");

// --- STATE ---
let currentBooks = [];
let favoriteBooks = JSON.parse(localStorage.getItem("favoriteBooks")) || [];

// --- CORE FUNCTIONS ---

async function fetchBooks(query) {
  try {
    booksContainer.innerHTML = getLoaderTemplate();
    const data = await fetchBooksFromApi(query);
    booksContainer.innerHTML = "";

    if (!data.numFound) {
      booksContainer.innerHTML = '<p class="info-text">No books found 😞</p>';
      return;
    }

    currentBooks = data.docs.slice(0, 10);
    renderBooks();
  } catch (err) {
    console.error(err);
    booksContainer.innerHTML = '<p class="info-text">Connection error ⚠️</p>';
  }
}

function renderBooks() {
  booksContainer.innerHTML = currentBooks
    .map((rawBook, index) => {
      const book = formatBook(rawBook);
      const isFav = favoriteBooks.some((fav) => fav.title === book.title);
      return createBookCard(book, index, isFav);
    })
    .join("");
}

function renderFavorites() {
  if (!favoriteBooks.length) {
    favoriteContainer.innerHTML =
      '<div class="info-text"><p>No favorites yet 😞</p></div>';
    return;
  }
  favoriteContainer.innerHTML = favoriteBooks
    .map((book, i) => createBookCard(book, i, true))
    .join("");
}

const updateFavorites = () => {
  localStorage.setItem("favoriteBooks", JSON.stringify(favoriteBooks));
  renderFavorites();
};

// --- TABS LOGIC ---
function switchTab(mode) {
  const isBooks = mode === "books";
  bookTab.classList.toggle("active", isBooks);
  favTab.classList.toggle("active", !isBooks);
  booksContainer.classList.toggle("active", isBooks);
  favoriteContainer.classList.toggle("active", !isBooks);
  if (!isBooks) renderFavorites();
}

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  switchTab("books");
  await fetchBooks(query);
});

searchInput.addEventListener(
  "input",
  debounce(async (e) => {
    const query = e.target.value.trim();

    if (query.length < 3) return;

    switchTab("books");
    await fetchBooks(query);
  }, 500),
);

// --- EVENT LISTENERS ---
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return alert("Input book name!");
  switchTab("books");
  await fetchBooks(query);
  searchInput.value = "";
});

booksContainer.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-heart");
  if (!btn) return;
  const book = formatBook(currentBooks[btn.dataset.index]);
  const idx = favoriteBooks.findIndex((fav) => fav.title === book.title);

  if (idx !== -1) {
    favoriteBooks.splice(idx, 1);
    btn.innerText = "🩶";
  } else {
    favoriteBooks.push(book);
    btn.innerText = "❤️";
  }
  updateFavorites();
});

favoriteContainer.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-heart");
  if (!btn) return;
  favoriteBooks.splice(btn.dataset.index, 1);
  updateFavorites();
  renderBooks();
});

bookTab.addEventListener("click", () => switchTab("books"));
favTab.addEventListener("click", () => switchTab("favorites"));

// INITIAL LOAD
fetchBooks("javascript");
