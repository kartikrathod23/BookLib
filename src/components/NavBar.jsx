import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function NavBar() {
    const { user, logout } = useContext(AuthContext);
    const nav = useNavigate();

    const handleLogout = () => {
        logout();
        nav('/');
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="app-container max-w-6xl mx-auto px-4 flex items-center justify-between py-4">
                
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <img src="/logo.svg" alt="logo" className="h-10 w-auto" />
                    {/* <span className="font-bold text-xl text-gray-800 hidden md:inline-block">Book Reviews</span> */}
                </Link>

                {/* Navigation */}
                <nav className="flex items-center space-x-4">
                    <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium transition">Books</Link>

                    {user ? (
                        <div className="flex items-center space-x-3">
                            <Link
                                to="/add"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition font-medium"
                            >
                                Add Book
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium"
                            >
                                Logout
                            </button>

                            <div className="ml-2 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold shadow-md">
                                {(user?.name || 'U').charAt(0).toUpperCase()}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium"
                            >
                                Login
                            </Link>

                            <Link
                                to="/signup"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition font-medium"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
