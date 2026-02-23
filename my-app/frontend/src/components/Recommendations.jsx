import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";

const Recommendations = (props) => {
  const { loading, error, data } = useQuery(ALL_BOOKS, {
    variables: { genre: props.favoriteGenre },
    skip: !props.favoriteGenre,
  });

  if (!props.show) {
    return null;
  }

  const favoriteGenre = props.favoriteGenre;

  if (!favoriteGenre) {
    return (
      <div>
        <h2>recommendations</h2>
        <p>
          No favorite genre set. Please select a favorite genre in your profile
          settings.
        </p>
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const books = data?.allBooks ?? [];

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favourite genre <strong>{favoriteGenre}</strong>
      </p>

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
    </div>
  );
};

export default Recommendations;
