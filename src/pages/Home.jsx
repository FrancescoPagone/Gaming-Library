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
    const [genres, setGenres] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

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

    // Reset page and games when filters or search change
    useEffect(() => {
        setGames([]);
        setPage(1);
        setHasMore(true);
        setError(null);
    }, [searchQuery, selectedGenre, selectedPlatform]);

    useEffect(() => {
        const fetchGenresAndPlatforms = async () => {
            try {
                const [genresData, platformsData] = await Promise.all([
                    api.getGenres(),
                    api.getPlatforms()
                ]);
                setGenres(genresData);
                setPlatforms(platformsData);
            } catch (err) {
                console.error('Errore nel caricamento dei generi e delle piattaforme', err);
                setError('Errore nel caricamento dei filtri. Alcune funzionalità potrebbero essere limitate.');
            }
        };

        fetchGenresAndPlatforms();
    }, []);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = searchQuery
                    ? await api.searchGames(searchQuery, page, selectedGenre, selectedPlatform)
                    : await api.getGames(page, 12, selectedGenre, selectedPlatform);

                if (!data || !Array.isArray(data.results)) {
                    throw new Error('Formato dati non valido dalla API');
                }

                setGames((prev) =>
                    page === 1 ? data.results : [...prev, ...data.results]
                );
                setHasMore(data.next !== null);
            } catch (err) {
                console.error('Errore nel caricamento dei giochi:', err);
                setError('Impossibile caricare i giochi. Riprova più tardi.');
                setGames([]);
                setHasMore(false);
            } finally {
                setLoading(false);
                setIsInitialLoad(false);
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

    const renderContent = () => {
        if (error) {
            return (
                <div className="bg-red-500 text-white p-4 rounded-lg mb-8">
                    {error}
                </div>
            );
        }

        if (!loading && games.length === 0 && !isInitialLoad) {
            return (
                <div className="text-center text-gray-400 mt-8 p-8 bg-gray-800 rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">Nessun gioco trovato</h2>
                    <p>Prova a modificare i filtri o la ricerca</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}

                {loading && Array.from({ length: 4 }).map((_, i) => (
                    <GameCardSkeleton key={i} />
                ))}
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-white">
                {searchQuery ? `Risultati della ricerca: ${searchQuery}` : 'Giochi Popolari'}
            </h1>

            <div className="flex flex-wrap gap-4 mb-8">
                <select 
                    className="px-4 py-2 bg-gray-700 dark:bg-gray-800 rounded-full text-gray-200"
                    value={selectedGenre}
                    onChange={handleGenreChange}
                    disabled={loading && isInitialLoad}
                >
                    <option value="">Tutti i generi</option>
                    {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>{genre.name}</option>
                    ))}
                </select>

                <select 
                    className="px-4 py-2 bg-gray-700 dark:bg-gray-800 rounded-full text-gray-200"
                    value={selectedPlatform}
                    onChange={handlePlatformChange}
                    disabled={loading && isInitialLoad}
                >
                    <option value="">Tutte le piattaforme</option>
                    {platforms.map((platform) => (
                        <option key={platform.id} value={platform.id}>{platform.name}</option>
                    ))}
                </select>
            </div>

            {renderContent()}

            {hasMore && !error && <div ref={loadingRef} className="h-20" />}
        </div>
    );
}