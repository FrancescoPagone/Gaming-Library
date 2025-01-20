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
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState('');
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

    const [genres, setGenres] = useState([]);
    const [platforms, setPlatforms] = useState([]);

    // Reset page and games when filters or search change
    useEffect(() => {
        setGames([]);
        setPage(1);
        setHasMore(true);
    }, [searchQuery, selectedGenre, selectedPlatform]);

    useEffect(() => {
        const fetchGenresAndPlatforms = async () => {
            try {
                const genresData = await api.getGenres();
                const platformsData = await api.getPlatforms();
                setGenres(genresData);
                setPlatforms(platformsData);
            } catch (err) {
                console.error('Errore nel caricamento dei generi e delle piattaforme', err);
            }
        };

        fetchGenresAndPlatforms();
    }, []);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                setLoading(true);
                setError(null);

                // Log per debug
                console.log('Fetching games with filters:', {
                    page,
                    genre: selectedGenre,
                    platform: selectedPlatform
                });

                const data = searchQuery
                    ? await api.searchGames(searchQuery, page, selectedGenre, selectedPlatform)
                    : await api.getGames(page, 12, selectedGenre, selectedPlatform);

                // Verifica se i giochi ricevuti corrispondono ai filtri
                console.log('Received games:', data.results);

                setGames((prev) =>
                    page === 1 ? data.results : [...prev, ...data.results]
                );
                setHasMore(data.next !== null);
            } catch (err) {
                console.error('Error fetching games:', err);
                setError('Impossibile caricare i giochi. Riprova per favore.');
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, [page, searchQuery, selectedGenre, selectedPlatform]);
    const handleGenreChange = (event) => {
        setSelectedGenre(event.target.value);
    };

    const handlePlatformChange = (event) => {
        setSelectedPlatform(event.target.value);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-white">
                {searchQuery ? `Risultati della ricerca: ${searchQuery}` : 'Giochi Popolari'}
            </h1>

            <div className="flex flex-wrap gap-4 mb-8">
                {/* Dropdown per i generi */}
                <select
                    className="px-4 py-2 bg-gray-700 dark:bg-gray-800 rounded-full text-gray-200"
                    value={selectedGenre}
                    onChange={handleGenreChange}
                >
                    <option value="">Tutti i generi</option>
                    {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>{genre.name}</option>
                    ))}
                </select>

                {/* Dropdown per le piattaforme */}
                <select
                    className="px-4 py-2 bg-gray-700 dark:bg-gray-800 rounded-full text-gray-200"
                    value={selectedPlatform}
                    onChange={handlePlatformChange}
                >
                    <option value="">Tutte le piattaforme</option>
                    {platforms.map((platform) => (
                        <option key={platform.id} value={platform.id}>{platform.name}</option>
                    ))}
                </select>
            </div>

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