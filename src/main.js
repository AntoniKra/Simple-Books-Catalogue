console.log("Czysty start!");

const searchForm = document.querySelector("#search");
const searchInput = document.querySelector("#search-input");
const booksContainer = document.querySelector("#second-section");

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  console.log("gotowe");

  const book = searchInput.value.trim();
  console.log(book);

  if (book === "") {
    alert("Input book name!");
    return;
  }

  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${book}`,
    );
    booksContainer.innerHTML = "";
    const data = await response.json();
    console.log(data);

    if (data.numFound === 0) {
      booksContainer.innerHTML = '<p id="info-text"> 1 </p>';
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
          <h3>${book.title}</h3>
          <p>${author}</p>
          <p>${year}</p>
        </article>
      `;

      booksContainer.innerHTML += html;
    });

    searchInput.value = "";
  } catch (error) {
    console.error("Something goes wrong:", error);
  }
});
