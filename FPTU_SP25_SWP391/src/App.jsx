import { useState } from 'react';
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

  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="App">
      <Router>

        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking_page" element={<BookingPage />} />
          <Route path='/blog/:id' element={<BlogDetail />} />
          <Route path="/cart_page" element={<CartPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sign_in" element={<SignIn darkMode={darkMode} />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
        </Routes>
        </main>
      <Footer darkMode={darkMode} />

    </Router>
    </div >
  );
}

export default App
