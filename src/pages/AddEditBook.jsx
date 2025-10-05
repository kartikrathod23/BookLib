import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AddEditBook({ edit }) {
    const [form, setForm] = useState({ title: '', author: '', description: '', genre: '', year: '', coverUrl: '' });
    const nav = useNavigate();
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (edit && id) {
            API.get(`/books/${id}`).then(res => {
                const b = res.data.book;
                setForm({
                    title: b.title || '',
                    author: b.author || '',
                    description: b.description || '',
                    genre: b.genre || '',
                    year: b.year || '',
                    coverUrl: b.coverUrl || ''
                });
            }).catch(err => console.error(err));
        }
    }, [edit, id]);

    const submit = async (e) => {
        e.preventDefault();
        try {
            if (edit) {
                await API.put(`/books/${id}`, form);
            } else {
                await API.post('/books', { ...form, year: Number(form.year) });
            }
            nav('/');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Error');
        }
    };

    if (!user) return (
        <div className="flex justify-center items-center min-h-[60vh] bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="text-center text-gray-600 font-medium p-6 bg-white shadow-lg rounded-2xl">
                Please login to add a book.
            </div>
        </div>
    );

    return (
        <div className="app-container max-w-3xl mx-auto px-4 py-10 min-h-screen">
            <div className="bg-white shadow-2xl rounded-3xl p-8 border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{edit ? 'Edit Book' : 'Add Book'}</h2>
                <form onSubmit={submit} className="space-y-6">
                    {/* Title & Author */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <input
                            required
                            placeholder="Title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-md transition bg-blue-50"
                        />
                        <input
                            required
                            placeholder="Author"
                            value={form.author}
                            onChange={(e) => setForm({ ...form, author: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-md transition bg-blue-50"
                        />
                    </div>

                    {/* Genre, Year, Cover URL */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <input
                            placeholder="Genre"
                            value={form.genre}
                            onChange={(e) => setForm({ ...form, genre: e.target.value })}
                            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-md transition bg-blue-50"
                        />
                        <input
                            placeholder="Year"
                            value={form.year}
                            onChange={(e) => setForm({ ...form, year: e.target.value })}
                            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-md transition bg-blue-50"
                        />
                        <input
                            placeholder="Cover image URL"
                            value={form.coverUrl}
                            onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
                            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-md transition bg-blue-50"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Description</label>
                        <textarea
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-md transition bg-blue-50 h-36 resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">Cover URL optional; placeholder used if empty.</div>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg transition transform hover:-translate-y-1"
                        >
                            {edit ? 'Update Book' : 'Add Book'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
