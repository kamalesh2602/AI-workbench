import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { registerUser } from "../services/authService";

function Register() {

    const navigate =
        useNavigate();

    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const handleRegister =
        async () => {

            try {

                await registerUser(
                    name,
                    email,
                    password
                );

                navigate("/login");

            } catch (error) {

                console.error(error);

            }
        };

    return (
        <div className="auth-view-wrapper">
            {/* BRAND IDENTITY HEADER */}
            <div className="auth-brand-header">
                <h1>CogniDesk</h1>
                <p>AI-Powered Workspace for Research & Document Intelligence</p>
            </div>

            <div className="auth-panel-card">
                <h2>Create Credentials / Register</h2>

                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button onClick={handleRegister}>
                    Deploy Account
                </button>

                <p className="auth-switch-text">
                    Already have an account? <Link to="/login">Login to Terminal</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;