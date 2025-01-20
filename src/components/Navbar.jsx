import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Heart, LogIn, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            setIsOpen(false);
            navigate('/login');
        } catch (error) {
            console.error('Errore durante il logout:', error);
        }
    };

    React.useEffect(() => {
        const closeDropdown = (e) => {
            if (isOpen && !e.target.closest('#dropdown')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', closeDropdown);
        return () => document.removeEventListener('click', closeDropdown);
    }, [isOpen]);

    return (
        <nav className="bg-gray-800 py-4">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="text-xl font-bold text-white">
                        Gaming Library
                    </Link>

                    <div className="hidden md:flex items-center space-x-4">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Cerca i giochi..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button type="submit" className="absolute right-3 top-2.5">
                                <Search className="w-5 h-5 text-gray-400" />
                            </button>
                        </form>

                        {user ? (
                            <>
                                <Link
                                    to="/wishlist"
                                    className="text-white hover:text-gray-300 flex items-center gap-2"
                                >
                                    <Heart className="w-5 h-5" />
                                    Lista Preferiti
                                </Link>

                                <div className="relative">
                                    <button
                                        id="dropdownDefaultButton"
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsOpen(!isOpen);
                                        }}
                                    >
                                        {user.email}
                                        <svg
                                            className={`w-2.5 h-2.5 ms-3 transition-transform ${isOpen ? 'rotate-180' : ''
                                                }`}
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 10 6"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="m1 1 4 4 4-4"
                                            />
                                        </svg>
                                    </button>

                                    {isOpen && (
                                        <div
                                            id="dropdown"
                                            className="absolute right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700"
                                        >
                                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                                <li>
                                                    <Link
                                                        to="/profile"
                                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        Profilo
                                                    </Link>
                                                </li>
                                                <li>
                                                    <button
                                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                        onClick={handleLogout}
                                                    >
                                                        Logout
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="text-white hover:text-gray-300 flex items-center gap-2"
                            >
                                <div className="flex items-center gap-2">
                                    <LogIn className="w-5 h-5" />
                                    Login
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}