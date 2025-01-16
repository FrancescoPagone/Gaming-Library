import axios from 'axios';
import 'flowbite';

const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

export const api = {
    getGames: async (page = 1, pageSize = 12, genre) => {
        try {
            const response = await axios.get(`${BASE_URL}/games`, {
                params: {
                    key: API_KEY,
                    page,
                    page_size: pageSize,
                    ordering: '-rating',
                    genre,
                },
            });
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch games');
        }
    },

    getGame: async (id) => {
        try {
            const [gameResponse, screenshotsResponse] = await Promise.all([
                axios.get(`${BASE_URL}/games/${id}`, {
                    params: { key: API_KEY },
                }),
                axios.get(`${BASE_URL}/games/${id}/screenshots`, {
                    params: { key: API_KEY },
                }),
            ]);

            return {
                ...gameResponse.data,
                screenshots: screenshotsResponse.data.results,
            };
        } catch (error) {
            throw new Error('Failed to fetch game details');
        }
    },

    searchGames: async (query, page = 1, genre) => {
        try {
            const response = await axios.get(`${BASE_URL}/games`, {
                params: {
                    key: API_KEY,
                    search: query,
                    page,
                    page_size: 12,
                    genre,
                },
            });
            return response.data;
        } catch (error) {
            throw new Error('Failed to search games');
        }
    },

    getGenres: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/genres`, {
                params: {
                    key: API_KEY,
                },
            });
            return response.data.results;
        } catch (error) {
            throw new Error('Failed to fetch genres');
        }
    },
};
