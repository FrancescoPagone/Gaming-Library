import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function GameCard({ game }) {
    return (
        <Link
            to={`/game/${game.id}`}
            className="group bg-gray-800 dark:bg-gray-900 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
        >
            <div className="relative aspect-video">
                <img
                    src={game.background_image}
                    alt={game.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-white">{game.rating.toFixed(1)}</span>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <h2 className="text-xl font-semibold text-white mb-2 line-clamp-1">
                    {game.name}
                </h2>
                <div className="flex flex-wrap gap-2">
                    {game.genres.slice(0, 3).map((genre) => (
                        <span
                            key={genre.id}
                            className="px-2 py-1 bg-gray-700 dark:bg-gray-800 rounded-full text-sm text-gray-200"
                        >
                            {genre.name}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}