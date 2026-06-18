import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
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

                setError("");

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

                setError(
                    "Invalid email or password"
                );

            }
        };

    return (
        <div className="auth-view-wrapper">

            <div className="auth-brand-header">
                <h1>CogniDesk</h1>

                <p>
                    AI-Powered Workspace for Research & Document Intelligence
                </p>
            </div>

            <div className="auth-panel-card">

                <h2>
                    Access Terminal / Login
                </h2>

                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) =>
                        setEmail(
                            e.target.value
                        )
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(
                            e.target.value
                        )
                    }
                />

                <button
                    onClick={handleLogin}
                >
                    Initialize Session
                </button>

                {
                    error && (
                        <p
                            className="error"
                        >
                            {error}
                        </p>
                    )
                }

                <p className="auth-switch-text">

                    Don't have an account?

                    {" "}

                    <Link
                        to="/register"
                    >
                        Register New Environment
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Login;