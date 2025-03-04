import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
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
import AdminHomePage from "./page/AdminHomePage"; // Import new AdminHomePage
import TherapistHomePage from "./page/TherapistHomePage"; // Import new TherapistHomePage
import Profile from "./page/Profile";
import StaffHomePage from "./page/StaffHomePage";
import Error from "./page/Error"; // Import the new Error component
import EditProfile from "./page/EditProfile";

// ProtectedRoute Component to restrict access based on role
const ProtectedRoute = ({ children, allowedRole }) => {
  const role = localStorage.getItem("role");

  if (!role) {
    // If no role is found (user not logged in), redirect to sign-in
    return <Navigate to="/sign_in" replace />;
  }

  if (role !== allowedRole) {
    // If role doesn't match, redirect to homepage
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main className="content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage darkMode={darkMode} />} />
              <Route path="/booking_page" element={<BookingPage />} />
              <Route
                path="/service/:id"
                element={<BlogDetail darkMode={darkMode} />}
              />
              <Route path="/cart_page" element={<CartPage />} />
              <Route
                path="/about"
                element={<ProductListPage darkMode={darkMode} />}
              />
              <Route path="/service" element={<Blog />} />
              <Route
                path="/contact"
                element={<Contact darkMode={darkMode} />}
              />
              <Route path="/sign_in" element={<SignIn darkMode={darkMode} />} />
              <Route
                path="/forgotPassword"
                element={<ForgotPassword darkMode={darkMode} />}
              />
              <Route
                path="/signUpUser"
                element={<SignUp darkMode={darkMode} />}
              />
              <Route
                path="/policy"
                element={<PolicyPage darkMode={darkMode} />}
              />
              <Route
                path="/profile"
                element={<Profile darkMode={darkMode} />}
              />

              {/* Role-Based Protected Routes */}
              <Route
                path="/admin/home"
                element={
                  <ProtectedRoute allowedRole="Admin">
                    <AdminHomePage darkMode={darkMode} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/skintherapist/home"
                element={
                  <ProtectedRoute allowedRole="Therapist">
                    <TherapistHomePage darkMode={darkMode} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/home"
                element={
                  <ProtectedRoute allowedRole="Staff">
                    <StaffHomePage darkMode={darkMode} />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Error darkMode={darkMode} />} />
              <Route path="/edit-profile" element={<EditProfile darkMode={darkMode} />} />
            </Routes>
          </main>
          <Footer darkMode={darkMode} />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
