import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { supabase } from '../lib/supabase';
import { Heart, Star, Send, Home, ChevronRight } from 'lucide-react';

export default function GameDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const [game, setGame] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(null);

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const gameData = await api.getGame(Number(id));
                console.log('Game data:', gameData);
                setGame(gameData);
                setActiveImage(gameData.background_image);

                if (user) {
                    const { data: wishlistData } = await supabase
                        .from('wishlists')
                        .select('*')
                        .eq('user_id', user.id)
                        .eq('game_id', id)
                        .single();
                    setIsWishlisted(!!wishlistData);
                }

                const { data: commentsData } = await supabase
                    .from('comments')
                    .select('*')
                    .eq('game_id', id)
                    .order('created_at', { ascending: false });
                setComments(commentsData || []);
            } catch (error) {
                console.error('Error fetching game:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGame();
    }, [id, user]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!user || !newComment.trim()) return;

        try {
            const { data: comment } = await supabase
                .from('comments')
                .insert([
                    {
                        user_id: user.id,
                        game_id: Number(id),
                        content: newComment.trim(),
                    },
                ])
                .select()
                .single();

            if (comment) {
                setComments([comment, ...comments]);
                setNewComment('');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const toggleWishlist = async () => {
        if (!user) return;

        try {
            if (isWishlisted) {
                await supabase
                    .from('wishlists')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('game_id', id);
            } else {
                await supabase
                    .from('wishlists')
                    .insert([{ user_id: user.id, game_id: Number(id) }]);
            }
            setIsWishlisted(!isWishlisted);
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await supabase
                .from('comments')
                .delete()
                .eq('id', commentId);
            
            setComments(comments.filter(comment => comment.id !== commentId));
        } catch (error) {
            console.error('Errore durante l\'eliminazione del commento:', error);
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse max-w-6xl mx-auto px-4">
                <div className="h-96 bg-gray-700 rounded-lg mb-8" />
                <div className="space-y-4">
                    <div className="h-8 bg-gray-700 rounded w-1/2" />
                    <div className="h-4 bg-gray-700 rounded w-1/4" />
                    <div className="h-4 bg-gray-700 rounded w-3/4" />
                </div>
            </div>
        );
    }

    if (!game) return <div>Gioco non trovato</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
                <Link to="/" className="flex items-center gap-1 hover:text-white">
                    <Home className="w-4 h-4" />
                    Home
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">{game.name}</span>
            </nav>


            <div className="relative rounded-lg overflow-hidden mb-8">
                <img
                    src={activeImage || game.background_image
                    } alt={game.name}
                    className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-4">{game.name}</h1>
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                    <span>{game.rating.toFixed(1)}</span>
                                </div>
                                <span>|</span>
                                <span>{game.released}</span>
                            </div>
                        </div>
                        {user && (
                            <button
                                onClick={toggleWishlist}
                                className="p-3 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors"
                            >
                                <Heart
                                    className={`w-6 h-6 ${isWishlisted ? 'text-red-500 fill-current' : 'text-white'}`}
                                />
                            </button>
                        )}
                    </div>
                </div>
            </div>


            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Immagini</h2>
                <div className="grid grid-cols-4 gap-4">
                    {activeImage && (
                        <img
                            src={activeImage}
                            alt="Main"
                            onClick={() => setActiveImage(activeImage)}
                            className={`w-full h-24 object-cover rounded-lg cursor-pointer transition-opacity ${activeImage === activeImage ? 'opacity-100' : 'opacity-60'}`}
                        />
                    )}
                    {game.screenshots && game.screenshots.length > 0 ? (
                        game.screenshots.map((screenshot) => (
                            <img
                                key={screenshot.id}
                                src={screenshot.image}
                                alt={`Screenshot ${screenshot.id}`}
                                onClick={() => setActiveImage(screenshot.image)}
                                className={`w-full h-24 object-cover rounded-lg cursor-pointer transition-opacity ${activeImage === screenshot.image ? 'opacity-100' : 'opacity-60'}`}
                            />
                        ))
                    ) : (
                        <p className="text-gray-400">Nessuno screenshot disponibile.</p>
                    )}
                </div>
            </div>


            <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold mb-4">Descrizione</h2>
                    <p className="text-gray-300 whitespace-pre-line">{game.description_raw}</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">Developers</h3>
                        <div className="flex flex-wrap gap-2">
                            {game.developers.map((dev) => (
                                <span key={dev.id} className="px-3 py-1 bg-gray-800 rounded-full text-sm">{dev.name}</span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Publishers</h3>
                        <div className="flex flex-wrap gap-2">
                            {game.publishers.map((pub) => (
                                <span key={pub.id} className="px-3 py-1 bg-gray-800 rounded-full text-sm">{pub.name}</span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Piattaforma</h3>
                        <div className="flex flex-wrap gap-2">
                            {game.platforms.map((p) => (
                                <span key={p.platform.id} className="px-3 py-1 bg-gray-800 rounded-full text-sm">{p.platform.name}</span>
                            ))}
                        </div>
                    </div>

                    {game.website && (
                        <div>
                            <h3 className="font-semibold mb-2">Sito</h3>
                            <a
                                href={game.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300"
                            >
                                {game.website}
                            </a>
                        </div>
                    )}
                </div>
            </div>


            {game.platforms.some((p) => p.requirements) && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Requisiti di sistema</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {game.platforms.filter((p) => p.requirements).map((p) => (
                            <div key={p.platform.id} className="bg-gray-800 rounded-lg p-6">
                                <h3 className="font-semibold mb-4">{p.platform.name}</h3>
                                {p.requirements?.minimum && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Minimo:</h4>
                                        <p className="text-sm whitespace-pre-line">{p.requirements.minimum}</p>
                                    </div>
                                )}
                                {p.requirements?.recommended && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Raccomandato:</h4>
                                        <p className="text-sm whitespace-pre-line">{p.requirements.recommended}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Comments Section */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Commenti</h2>
                {user ? (
                    <form onSubmit={handleAddComment} className="mb-6">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Lascia un commento..."
                                className="flex-1 bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="px-4 py-2 bg-blue-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                Invia
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="text-gray-400 mb-6">Fai il Login per lasciare un commento.</p>
                )}

                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold">{user?.username}</span>
                                <span className="text-gray-400 text-sm">{new Date(comment.created_at).toLocaleDateString()}</span>
                            </div>
                            <p>{comment.content}</p>
                            <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-red-500 hover:text-red-400"
                            >
                                Elimina
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}