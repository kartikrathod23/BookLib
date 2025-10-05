import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function BookDetails() {
    const { id } = useParams();
    const [data, setData] = useState({ book: null, reviews: [], averageRating: null });
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const { user } = useContext(AuthContext);
    const nav = useNavigate();

    const fetch = async () => {
        try {
            const { data } = await API.get(`/books/${id}`);
            setData(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetch(); }, [id]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) return nav('/login');
        try {
            await API.post(`/reviews/${id}`, { rating, reviewText });
            setRating(5);
            setReviewText('');
            fetch();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Error');
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!confirm('Delete review?')) return;
        try {
            await API.delete(`/reviews/${reviewId}`);
            fetch();
        } catch (err) {
            console.error(err);
            alert('Error deleting');
        }
    };

    const handleDeleteBook = async () => {
        if (!confirm('Delete this book?')) return;
        try {
            await API.delete(`/books/${id}`);
            nav('/');
        } catch (err) {
            console.error(err);
            alert('Error deleting book');
        }
    };

    if (!data.book) return <div className="text-center py-12 font-medium text-gray-600">Loading...</div>;

    const isOwner = user && data.book.addedBy && data.book.addedBy._id === user.id;

    return (
        <div className="app-container max-w-5xl mx-auto px-4 py-6">
            <div className="card flex flex-col md:flex-row bg-white shadow-lg rounded-xl overflow-hidden gap-6 p-6">
                <img src={data.book.coverUrl || '/book-placeholder.svg'} alt={data.book.title} className="w-full md:w-48 h-64 object-cover rounded-lg flex-shrink-0" />

                <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">{data.book.title}</h2>
                            <p className="text-sm text-gray-500 mt-1">by {data.book.author} • {data.book.genre || 'General'} • {data.book.year}</p>
                            <p className="mt-3 text-gray-700">{data.book.description}</p>
                            <p className="mt-2 text-sm font-medium text-gray-800">Average rating: {data.averageRating ?? 'N/A'}</p>
                        </div>

                        {isOwner && (
                            <div className="flex flex-col space-y-2">
                                <Link to={`/edit/${id}`} className="text-blue-600 font-medium hover:underline">Edit</Link>
                                <button onClick={handleDeleteBook} className="text-red-600 font-medium hover:underline">Delete</button>
                            </div>
                        )}
                    </div>

                    <hr className="my-6 border-gray-300" />

                    <div>
                        <h3 className="font-semibold mb-3 text-gray-800">Reviews</h3>
                        <div className="space-y-4">
                            {data.reviews.length === 0 && <div className="text-gray-500">No reviews yet.</div>}
                            {data.reviews.map(r => (
                                <div key={r._id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-gray-900">{r.userId?.name || 'User'}</p>
                                            <p className="text-sm text-gray-500">Rating: {r.rating}</p>
                                        </div>
                                        {user && r.userId._id === user.id && (
                                            <button onClick={() => handleDeleteReview(r._id)} className="text-sm text-red-600 hover:underline">Delete</button>
                                        )}
                                    </div>
                                    <p className="mt-2 text-gray-700">{r.reviewText}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {user && (
                        <form onSubmit={handleSubmitReview} className="mt-6 space-y-3">
                            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Rating</label>
                                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="p-2 border rounded w-full md:w-20">
                                        {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">Review</label>
                                    <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} className="w-full p-3 border rounded h-28" />
                                </div>
                                <button type="submit" className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow-md transition">Submit</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
