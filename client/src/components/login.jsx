import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || data.message || "Login Failed");
                return;
            }
            localStorage.setItem("token", data.accessToken);
            navigate('/');
            setUsername("");
            setPassword("");
        } catch (err) {
            setError("Server not reachable. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg space-y-5"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Login
                </h2>

                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                >
                    Login
                </button>

                <button
                    type="button"
                    onClick={() => { navigate('/signup') }}
                    className="text-center text-sm text-gray-600 hover:underline w-full"
                >
                    Don’t have an account? Sign up
                </button>
            </form>
        </div>
    );
}
