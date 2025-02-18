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
import './App.css'
import Footer from './component/Footer';
function App() {
  return (
    <div className="App">
      <Router>
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
          <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore fuga officiis odio corporis quibusdam, sapiente mollitia 
            repudiandae similique nobis possimus iste quas officia adipisci corrupti consequatur architecto ipsa nesciunt. Deleniti!</p>
            <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore fuga officiis odio corporis quibusdam, sapiente mollitia 
            repudiandae similique nobis possimus iste quas officia adipisci corrupti consequatur architecto ipsa nesciunt. Deleniti!</p>
            <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore fuga officiis odio corporis quibusdam, sapiente mollitia 
            repudiandae similique nobis possimus iste quas officia adipisci corrupti consequatur architecto ipsa nesciunt. Deleniti!</p>
            <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore fuga officiis odio corporis quibusdam, sapiente mollitia 
            repudiandae similique nobis possimus iste quas officia adipisci corrupti consequatur architecto ipsa nesciunt. Deleniti!</p>
            <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore fuga officiis odio corporis quibusdam, sapiente mollitia 
            repudiandae similique nobis possimus iste quas officia adipisci corrupti consequatur architecto ipsa nesciunt. Deleniti!</p>
            <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore fuga officiis odio corporis quibusdam, sapiente mollitia 
            repudiandae similique nobis possimus iste quas officia adipisci corrupti consequatur architecto ipsa nesciunt. Deleniti!</p>
        <Footer />
      </Router>
    </div>

  );
}

export default App
