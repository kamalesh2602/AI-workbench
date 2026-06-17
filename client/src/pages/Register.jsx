import { useState } from "react";
import { useNavigate , Link} from "react-router-dom";

import {registerUser} from "../services/authService";

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

        <div>

            <h1>Register</h1>

            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) =>
                    setName(e.target.value)
                }
            />

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
                onClick={handleRegister}
            >
                Register
            </button>
            <p>
                Already have an account?
                <Link to="/login">
                    Login
                </Link>
            </p>

        </div>

    );
}

export default Register;