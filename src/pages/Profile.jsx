import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Link, Navigate } from 'react-router-dom';

export default function Profile() {
    const { user } = useAuth();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (user) {
            setEmail(user.email);
            fetchComments(); // Carica i commenti dell'utente
        }
    }, [user]);

    const fetchComments = async () => {
        try {
            const { data: commentsData } = await supabase
                .from('comments')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            setComments(commentsData || []);
        } catch (error) {
            console.error('Errore nel caricamento dei commenti:', error);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Aggiorna l'email
            const { error: emailError } = await supabase.auth.updateUser({ email });
            if (emailError) throw emailError;

            // Aggiorna la password
            if (newPassword) {
                const { error: passwordError } = await supabase.auth.updateUser({ password: newPassword });
                if (passwordError) throw passwordError;
            }

            alert('Profilo aggiornato con successo!');
        } catch (error) {
            setError('Errore durante l\'aggiornamento del profilo: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg">
            <h1 className="text-3xl font-bold mb-8 text-center">Dashboard Profilo</h1>

            {error && (
                <div className="bg-red-500 text-white p-3 rounded-lg">{error}</div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6 mb-8">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                        Nuova Password
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Aggiornamento...' : 'Aggiorna Profilo'}
                </button>
            </form>

            <h2 className="text-2xl font-bold mb-4">I tuoi Commenti</h2>
            {comments.length === 0 ? (
                <p className="text-gray-400">Non hai lasciato commenti.</p>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-700 p-4 rounded-lg">
                            <p>{comment.content}</p>
                            <span className="text-gray-400 text-sm">{new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                    ))}
                </div>
            )}

            <p className="text-center text-gray-400 mt-6">
                <Link to="/" className="text-blue-500 hover:text-blue-400">
                    Torna alla Home
                </Link>
            </p>
        </div>
    );
} 