import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './page/HomePage';
import BookingPage from './page/BookingPage';
import CartPage from './page/CartPage';
import ProductListPage from './page/ProductListPage';
import Contact from './page/Contact';
import Blog from './page/Blog';
import Header from './component/Header';

import './App.css'

function App() {


  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking_page" element={<BookingPage />} />

        <Route path="/cart_page" element={<CartPage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/about" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />

      </Routes>
    </Router>
  )
}

export default App
