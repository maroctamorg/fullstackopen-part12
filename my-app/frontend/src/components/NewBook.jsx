import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from "../queries";
import { addBookToCache } from "../utils/apolloCache";

const NewBook = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [addBook, { loading, error }] = useMutation(ADD_BOOK, {
    refetchQueries: [
      { query: ALL_BOOKS, variables: { genre: null } },
      { query: ALL_AUTHORS },
    ],
    onCompleted: () => {
      setTitle("");
      setPublished("");
      setAuthor("");
      setGenres([]);
      setGenre("");
    },
    onError: (error) => {
      console.error("Error adding book:", error.message);
    },
    update: (cache, response) => {
      const addedBook = response.data.addBook;
      addBookToCache(cache, addedBook);
    }
  });

  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    const publishedInt = parseInt(published);

    try {
      await addBook({
        variables: {
          title,
          author,
          published: publishedInt,
          genres,
        },
      });
    } catch (error) {
      console.error("Failed to add book:", error);
    }
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      {error && <div style={{ color: "red" }}>Error: {error.message}</div>}
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit" disabled={loading}>
          {loading ? "creating..." : "create book"}
        </button>
      </form>
    </div>
  );
};

export default NewBook;
