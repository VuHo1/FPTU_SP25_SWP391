// App.jsx
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./page/AuthContext"; // Import AuthProvider
import HomePage from "./page/HomePage";
import BookingPage from "./page/BookingPage";
import CartPage from "./page/CartPage";
import ProductListPage from "./page/ProductListPage";
import Contact from "./page/Contact";
import Blog from "./page/Blog";
import Header from "./component/Header";
import SignIn from "./page/SignIn";
import ForgotPassword from "./page/ForgotPassword";
import BlogDetail from "./page/BlogDetails";
import "./App.css";
import Footer from "./component/Footer";
import SignUp from "./page/signUpUser";
import PolicyPage from "./page/PolicyPage";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="App">
      <AuthProvider> {/* Wrap the app with AuthProvider */}
        <Router>
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main className="content">
            <Routes>
              <Route path="/" element={<HomePage darkMode={darkMode} />} />
              <Route path="/booking_page" element={<BookingPage />} />
              <Route path="/service/:id" element={<BlogDetail />} />
              <Route path="/cart_page" element={<CartPage />} />
              <Route path="/about" element={<ProductListPage darkMode={darkMode} />} />
              <Route path="/service" element={<Blog />} />
              <Route path="/contact" element={<Contact darkMode={darkMode} />} />
              <Route path="/sign_in" element={<SignIn darkMode={darkMode} />} />
              <Route path="/forgotPassword" element={<ForgotPassword darkMode={darkMode} />} />
              <Route path="/signUpUser" element={<SignUp darkMode={darkMode} />} />
              <Route path="/policy" element={<PolicyPage darkMode={darkMode} />} />
            </Routes>
          </main>
          <Footer darkMode={darkMode} />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;