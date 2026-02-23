import { useState } from "react";
import { useQuery, useSubscription, useApolloClient } from "@apollo/client/react";
import { ALL_BOOKS, BOOK_ADDED } from "../queries";
import { addBookToCache } from "../utils/apolloCache";

const Books = (props) => {
  if (!props.show) {
    return null;
  }

  const [selectedGenre, setSelectedGenre] = useState(null);
  const allBooks = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre },
  });
  const { data: dataGenres } = useQuery(ALL_BOOKS);
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;
      alert(`New book added: ${addedBook.title} by ${addedBook.author.name}`);
      addBookToCache(client.cache, addedBook);
    },
  });

  if (allBooks.loading) {
    return <div>Loading...</div>;
  }

  if (allBooks.error) {
    return <div>Error: {allBooks.error.message}</div>;
  }

  const books = allBooks.data?.allBooks ?? [];
  const allBooksForGenres = dataGenres?.allBooks ?? [];
  const genres = [...new Set(allBooksForGenres.flatMap((b) => b.genres))];

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author?.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setSelectedGenre(null)}
          style={{
            fontWeight: selectedGenre === null ? "bold" : "normal",
          }}
        >
          all
        </button>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            style={{
              fontWeight: selectedGenre === genre ? "bold" : "normal",
              marginLeft: "5px",
            }}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Books;
