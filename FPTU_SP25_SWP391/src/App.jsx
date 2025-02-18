import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './page/HomePage';
import BookingPage from './page/BookingPage';
import CartPage from './page/CartPage';
import ProductListPage from './page/ProductListPage';
import Contact from './page/Contact';
import Blog from './page/Blog';
import Header from './component/Header';
import SignIn from './page/SignIn';
import ForgotPassword from './page/ForgotPassword';
import BlogDetail from './page/BlogDetails';
import './App.css'
import Footer from './component/Footer';

function App() {


  return (
    <Router>

      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking_page" element={<BookingPage />} />
        <Route path='/blog/:id' element={<BlogDetail />} />
        <Route path="/cart_page" element={<CartPage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/sign_in" element={<SignIn />} />
        <Route path="/forgot_password" element={<ForgotPassword />} />
      </Routes>

      <div className="App">
        <Header />
        <main className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/booking_page" element={<BookingPage />} />
            <Route path="/cart_page" element={<CartPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/about" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/sign_in" element={<SignIn />} />
            <Route path="/forgot_password" element={<ForgotPassword />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App
