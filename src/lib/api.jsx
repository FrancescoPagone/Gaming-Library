import axios from 'axios';
import 'flowbite';

const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

export const api = {
    getGames: async (page = 1, pageSize = 12, genre = '', platform = '') => {
        try {
            const params = {
                key: API_KEY,
                page,
                page_size: pageSize,
                ordering: '-rating',
            };

            // Aggiungi i filtri solo se sono valori validi
            if (genre && genre !== 'null' && genre !== 'undefined') {
                params.genres = genre;
            }

            if (platform && platform !== 'null' && platform !== 'undefined') {
                params.parent_platforms = platform; // Cambiato da platforms a parent_platforms
            }

            // Log per debug
            console.log('Request params:', params);

            const response = await axios.get(`${BASE_URL}/games`, { params });
            
            // Log per debug
            console.log('Response data:', response.data);
            
            return response.data;
        } catch (error) {
            console.error('API Error:', error.response?.data || error.message);
            throw new Error('Failed to fetch games');
        }
    },

    searchGames: async (query, page = 1, genre = '', platform = '') => {
        try {
            const params = {
                key: API_KEY,
                search: query,
                page,
                page_size: 12,
            };

            if (genre && genre !== 'null' && genre !== 'undefined') {
                params.genres = genre;
            }

            if (platform && platform !== 'null' && platform !== 'undefined') {
                params.parent_platforms = platform; // Cambiato da platforms a parent_platforms
            }

            // Log per debug
            console.log('Search params:', params);

            const response = await axios.get(`${BASE_URL}/games`, { params });
            return response.data;
        } catch (error) {
            console.error('API Error:', error.response?.data || error.message);
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

    getPlatforms: async () => {
        try {
            // Modifichiamo per ottenere le parent platforms invece di tutte le platforms
            const response = await axios.get(`${BASE_URL}/platforms/lists/parents`, {
                params: {
                    key: API_KEY,
                },
            });
            return response.data.results;
        } catch (error) {
            console.error('API Error:', error.response?.data || error.message);
            throw new Error('Failed to fetch platforms');
        }
    },

    getGame: async (id) => {
        const response = await fetch(`${BASE_URL}/games/${id}?key=${API_KEY}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    },
};