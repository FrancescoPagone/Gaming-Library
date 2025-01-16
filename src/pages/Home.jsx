import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import GameCard from '../components/GameCard';
import GameCardSkeleton from '../components/GameCardSkeleton';

export default function Home() {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();
    const loadingRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    useEffect(() => {
        setGames([]);
        setPage(1);
        setHasMore(true);
    }, [searchQuery]);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = searchQuery
                    ? await api.searchGames(searchQuery, page)
                    : await api.getGames(page);

                setGames((prev) =>
                    page === 1 ? data.results : [...prev, ...data.results]
                );
                setHasMore(data.next !== null);
            } catch (err) {
                setError('Impossibile caricare i giochi. Riprova per favore.');
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, [page, searchQuery]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-white">
                {searchQuery ? `Risultati della ricerca: ${searchQuery}` : 'Giochi Popolari'}
            </h1>

            {error && (
                <div className="bg-red-500 text-white p-4 rounded-lg mb-8">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}

                {loading && Array.from({ length: 4 }).map((_, i) => (
                    <GameCardSkeleton key={i} />
                ))}
            </div>

            {!loading && !error && games.length === 0 && (
                <div className="text-center text-gray-400 mt-8">
                    Nessun gioco trovato.
                </div>
            )}

            <div ref={loadingRef} className="h-20" />
        </div>
    );
}