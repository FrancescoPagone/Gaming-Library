import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function GameCard({ game }) {
    // Se non abbiamo un game object valido, non renderizziamo nulla
    if (!game || typeof game !== 'object') {
        return null;
    }

    // Estrai i dati con valori di default
    const {
        id,
        name = 'Titolo non disponibile',
        background_image = '',
        rating = 0,
        genres = [],
        platforms = [],
    } = game;

    // Se non abbiamo un ID, non possiamo creare il link
    if (!id) {
        return null;
    }

    return (
        <Link
            to={`/game/${id}`}
            className="group bg-gray-800 dark:bg-gray-900 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
        >
            <div className="relative aspect-video">
                {background_image ? (
                    <img
                        src={background_image}
                        alt={name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                            e.target.src = '/placeholder-game.jpg'; // Assicurati di avere un'immagine placeholder
                            e.target.onerror = null; // Previene loop infiniti
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400">Immagine non disponibile</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                {typeof rating === 'number' && (
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="text-white">{rating.toFixed(1)}</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4">
                <h2 className="text-xl font-semibold text-white mb-2 line-clamp-1">
                    {name}
                </h2>
                
                {/* Generi */}
                {Array.isArray(genres) && genres.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {genres.slice(0, 3).map((genre) => (
                            genre && genre.id && (
                                <span
                                    key={genre.id}
                                    className="px-2 py-1 bg-gray-700 dark:bg-gray-800 rounded-full text-sm text-gray-200"
                                >
                                    {genre.name || 'Genere sconosciuto'}
                                </span>
                            )
                        ))}
                    </div>
                )}

                {/* Piattaforme */}
                {Array.isArray(platforms) && platforms.length > 0 && (
                    <div>
                        <h3 className="font-semibold mb-2 mt-2">Piattaforme</h3>
                        <div className="flex flex-wrap gap-2">
                            {platforms.slice(0, 3).map((platformObj) => (
                                platformObj?.platform?.id && (
                                    <span
                                        key={platformObj.platform.id}
                                        className="px-2 py-1 bg-gray-700 dark:bg-gray-800 rounded-full text-sm text-gray-200"
                                    >
                                        {platformObj.platform.name || 'Piattaforma sconosciuta'}
                                    </span>
                                )
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
}