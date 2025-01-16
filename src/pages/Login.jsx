import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(email, password);
            navigate('/');
        } catch (error) {
            setError('Errore nel login. Controlla le tue credenziali.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Login</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-500 text-white p-3 rounded-lg">{error}</div>
                )}

                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Accesso in corso...' : 'Accedi'}
                </button>

                <p className="text-center text-gray-400">
                    Non hai un'account?{' '}
                    <Link to="/register" className="text-blue-500 hover:text-blue-400">
                        Registrati
                    </Link>
                </p>
            </form>
        </div>
    );
}