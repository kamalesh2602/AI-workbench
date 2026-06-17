import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";

function Login() {

    const navigate =
        useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");
    useEffect(() => {

  const token =
    localStorage.getItem(
      "token"
    );

  if (token) {
    navigate("/");
  }

}, []);
    const handleLogin =
        async () => {

            try {

                const data =
                    await loginUser(
                        email,
                        password
                    );

                localStorage.setItem(
                    "token",
                    data.token
                );

                navigate("/");

            } catch (error) {

                console.error(error);

            }
        };

    return (

        <div>

            <h1>Login</h1>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                }
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
            />

            <button
                onClick={handleLogin}
            >
                Login
            </button>
            <p>
                Don't have an account?
                <Link to="/register">
                    Register
                </Link>
            </p>
        </div>


    );
}

export default Login;