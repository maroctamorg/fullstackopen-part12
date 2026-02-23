import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { LOGIN } from "../queries";

const LoginForm = ({ setToken, show }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value;
      setToken(token);
      localStorage.setItem("books-user-token", token);

      setUsername("");
      setPassword("");
    },
    onError: (error) => {
      console.error("Login error:", error.message);
      alert("Login failed: " + error.message);
    },
  });

  const submit = (event) => {
    event.preventDefault();
    login({ variables: { username, password } });
  };

  if (!show) {
    return null;
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username{" "}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{" "}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
