// Function responsible solely for fetching data from the API
export async function fetchBooksFromApi(query) {
  const response = await fetch(
    `https://openlibrary.org/search.json?q=${query}`,
  );
  if (!response.ok) throw new Error("Network error");
  return await response.json();
}
