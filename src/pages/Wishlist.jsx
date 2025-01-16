import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';
import { Star, Trash2 } from 'lucide-react';

export default function Wishlist() {
    const { user } = useAuth();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            if (!user) return;

            try {
                const { data: wishlistItems } = await supabase
                    .from('wishlists')
                    .select('game_id')
                    .eq('user_id', user.id);

                if (wishlistItems) {
                    const gamePromises = wishlistItems.map((item) =>
                        api.getGame(item.game_id)
                    );
                    const gameResults = await Promise.all(gamePromises);
                    setGames(gameResults);
                }
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, [user]);

    const removeFromWishlist = async (gameId) => {
        try {
            await supabase
                .from('wishlists')
                .delete()
                .eq('user_id', user?.id)
                .eq('game_id', gameId);

            setGames(games.filter((game) => game.id !== gameId));
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">La mia Wishlist</h1>

            {games.length === 0 ? (
                <div className="text-center text-gray-400">
                    <p className="mb-4">La tua Wishlist è vuota!</p>
                    <Link to="/" className="text-blue-500 hover:text-blue-400">
                        Esplora i giochi!
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {games.map((game) => (
                        <div
                            key={game.id}
                            className="bg-gray-800 rounded-lg overflow-hidden relative group"
                        >
                            <Link to={`/game/${game.id}`}>
                                <div className="relative h-48">
                                    <img
                                        src={game.background_image}
                                        alt={game.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                                        <div className="flex items-center gap-2">
                                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                            <span>{game.rating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold mb-2">{game.name}</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {game.genres.slice(0, 3).map((genre) => (
                                            <span
                                                key={genre.id}
                                                className="px-2 py-1 bg-gray-700 rounded-full text-sm"
                                            >
                                                {genre.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                            <button
                                onClick={() => removeFromWishlist(game.id)}
                                className="absolute top-2 right-2 p-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}