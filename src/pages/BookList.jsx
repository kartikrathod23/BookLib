import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

export default function BookList() {
    const [booksData, setBooksData] = useState({ books: [], page: 1, totalPages: 1 });
    const [loading, setLoading] = useState(false);

    const fetchBooks = async (page = 1) => {
        setLoading(true);
        try {
            const { data } = await API.get(`/books?page=${page}&limit=8`);
            setBooksData(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBooks(1); }, []);

    // Use a public book-related image from Unsplash
    const heroImage = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80';

    return (
        <div className="app-container max-w-6xl mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="site-hero rounded-2xl overflow-hidden mb-12 bg-gradient-to-r from-blue-100 to-blue-50 p-6 shadow-lg flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Discover and review your next favorite book
                    </h1>
                    <p className="text-gray-600 mb-4">Curated community reviews and personal recommendations.</p>
                    <Link
                        to="/add"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 rounded-lg shadow-md transition"
                    >
                        Add a Book
                    </Link>
                </div>
                <div className="flex-1 flex justify-center md:justify-end">
                    <img
                        src={heroImage}
                        alt="Books illustration"
                        className="w-full max-w-sm rounded-lg shadow-xl"
                    />
                </div>
            </div>

            {/* Books Grid */}
            {loading ? (
                <div className="text-center py-16 text-gray-600 font-medium text-lg">Loading...</div>
            ) : (
                <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {booksData.books.map(book => (
                            <div
                                key={book._id}
                                className="card flex flex-col bg-white shadow-md rounded-xl overflow-hidden hover:shadow-2xl transition duration-300"
                            >
                                <img
                                    src={book.coverUrl || 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=80'}
                                    alt={book.title}
                                    className="h-64 w-full object-cover"
                                />
                                <div className="flex-1 p-5 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900">{book.title}</h3>
                                        <p className="text-sm text-gray-500 mb-2">by {book.author}</p>
                                        <p className="text-gray-700 text-sm">{book.description?.slice(0, 140)}...</p>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="badge bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs">{book.genre || 'General'}</span>
                                        <Link to={`/books/${book._id}`} className="text-blue-600 font-medium hover:underline">
                                            View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-10 flex justify-center items-center space-x-4">
                        <button
                            disabled={booksData.page <= 1}
                            onClick={() => fetchBooks(booksData.page - 1)}
                            className="px-5 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 transition font-medium"
                        >
                            Previous
                        </button>
                        <div className="text-gray-700 font-medium">Page {booksData.page} / {booksData.totalPages}</div>
                        <button
                            disabled={booksData.page >= booksData.totalPages}
                            onClick={() => fetchBooks(booksData.page + 1)}
                            className="px-5 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 transition font-medium"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
