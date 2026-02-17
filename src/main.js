console.log("Czysty start!");

const searchForm = document.querySelector("#search");
const searchInput = document.querySelector("#search-input");
const booksContainer = document.querySelector("#book-section");
const favoriteContainer = document.querySelector("#favorite-section");
const bookTab = document.querySelector("#tab-books");
const favTab = document.querySelector("#tab-favorites");

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  console.log("gotowe");

  const book = searchInput.value.trim();
  console.log(book);

  if (book === "") {
    alert("Input book name!");
    return;
  }

  switchTab("books");

  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${book}`,
    );
    booksContainer.innerHTML = "";
    const data = await response.json();
    console.log(data);

    if (data.numFound === 0) {
      booksContainer.innerHTML = '<p class="info-text"> No books found 😞 </p>';
      return;
    }

    const books = data.docs.slice(0, 10);

    books.forEach((book) => {
      const coverImage = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : "https://placehold.co/180x280?text=No+Cover";

      const author = book.author_name ? book.author_name[0] : "Unknown Author";

      const year = book.first_publish_year
        ? book.first_publish_year
        : "Unknown publish year";

      const html = `
        <article class="book-card">
          <img src="${coverImage}" alt="${book.title}" />
          <div class="book-info">
            <h3>${book.title}</h3>
            <p>${author}</p>
            <p>${year}</p>
          </div>
        </article>
      `;

      booksContainer.innerHTML += html;
    });

    searchInput.value = "";
  } catch (error) {
    console.error("Something goes wrong:", error);
  }
});

function switchTab(mode) {
  if (mode === "books") {
    bookTab.classList.add("active");
    favTab.classList.remove("active");

    booksContainer.classList.add("active");
    favoriteContainer.classList.remove("active");
  } else {
    bookTab.classList.remove("active");
    favTab.classList.add("active");

    booksContainer.classList.remove("active");
    favoriteContainer.classList.add("active");
  }
}

bookTab.addEventListener("click", () => {
  switchTab("books");
});

favTab.addEventListener("click", () => {
  switchTab("favorites");
});
