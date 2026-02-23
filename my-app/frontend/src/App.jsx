import { useState } from "react";
import { useApolloClient, useQuery } from "@apollo/client/react";

import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Recommendations from "./components/Recommendations";
import LoginForm from "./components/LoginForm";
import { ME } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(localStorage.getItem("books-user-token"));
  const client = useApolloClient();
  const { data: userData } = useQuery(ME, { skip: !token });

  const onLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  const favoriteGenre = userData?.me?.favoriteGenre || null;

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <div>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommendations")}>
              recommendations
            </button>
            <button onClick={onLogout}>logout</button>
          </div>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      <Authors show={page === "authors"} token={token} />
      <Books show={page === "books"} />
      <NewBook show={page === "add"} />
      <Recommendations
        show={page === "recommendations"}
        favoriteGenre={favoriteGenre}
      />
      <LoginForm show={page === "login"} setToken={setToken} />
    </div>
  );
};

export default App;
