import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import BookList from './pages/BookList';
import BookDetails from './pages/BookDetails';
import AddEditBook from './pages/AddEditBook';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/add" element={<ProtectedRoute><AddEditBook /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><AddEditBook edit /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}
