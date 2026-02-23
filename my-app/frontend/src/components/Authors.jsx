import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const Authors = (props) => {
  const { loading, error, data } = useQuery(ALL_AUTHORS);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [birthYear, setBirthYear] = useState("");

  const [editAuthor, { loading: editLoading }] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      setSelectedAuthor("");
      setBirthYear("");
    },
    onError: (error) => {
      console.error("Error updating author:", error.message);
    },
  });

  if (!props.show) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const authors = data?.allAuthors ?? [];

  const handleSetBirthYear = (event) => {
    event.preventDefault();

    if (!selectedAuthor || !birthYear) {
      console.error("Author and birth year are required");
      return;
    }

    editAuthor({
      variables: {
        name: selectedAuthor,
        setBornTo: parseInt(birthYear),
      },
    });
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {props.token ? (
        <div>
          <h3>Set birthyear</h3>
          <form onSubmit={handleSetBirthYear}>
            <div>
              <label>
                name
                <select
                  value={selectedAuthor}
                  onChange={(e) => setSelectedAuthor(e.target.value)}
                >
                  <option value="">-- Select Author --</option>
                  {authors.map((a) => (
                    <option key={a.id} value={a.name}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div>
              <label>
                born
                <input
                  type="number"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                />
              </label>
            </div>
            <button type="submit" disabled={editLoading}>
              {editLoading ? "updating..." : "update"}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default Authors;
