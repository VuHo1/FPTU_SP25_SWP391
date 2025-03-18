import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./page/AuthContext";
import HomePage from "./page/HomePage";
// import BookingPage from "./page/BookingPage";
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
import AdminHomePage from "./page/AdminHomePage";
import TherapistHomePage from "./page/TherapistHomePage";
import Profile from "./page/Profile";
import StaffHomePage from "./page/StaffHomePage";
import Error from "./page/Error";
import EditProfile from "./page/EditProfile";
import AddProfile from "./page/AddProfile"; // Add this import
import ProfileRole from "./page/ProfileRole";
import EditProfileRole from "./page/EditProfileRole";
import AddProfileRole from "./page/AddProfileRole";
import ChooseScheduleTherapist from "./page/ChooseScheduleTherapist";
import TimeSlotSchedule from "./page/TimeSlotSchedule";

const ProtectedRoute = ({ children, allowedRole }) => {
  const role = localStorage.getItem("role");

  if (!role) {
    return <Navigate to="/sign_in" replace />;
  }

  if (role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Wrapper component to conditionally render Header and Footer
const Layout = ({ children, darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const isAdminHomePage = location.pathname === "/admin/home";

  return (
    <>
      {!isAdminHomePage && <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
      <main className="content">{children}</main>
      {!isAdminHomePage && <Footer darkMode={darkMode} />}
    </>
  );
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
          <Routes>
            <Route
              path="/admin/home"
              element={
                <ProtectedRoute allowedRole="Admin">
                  <AdminHomePage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                </ProtectedRoute>
              }
            />
                <Route
                      path="/staff/home"
                      element={
                        <ProtectedRoute allowedRole="Staff">
                          <StaffHomePage darkMode={darkMode}
                          toggleDarkMode={toggleDarkMode} />
                        </ProtectedRoute>
                      }
                    />
                       <Route
                      path="/skintherapist/home"
                      element={
                        <ProtectedRoute allowedRole="Therapist">
                          <TherapistHomePage darkMode={darkMode}
                          toggleDarkMode={toggleDarkMode} />
                        </ProtectedRoute>
                      }
                    />
                       <Route path="/profile-role" element={<ProfileRole darkMode={darkMode} />} />
                    <Route path="/edit-profilerole" element={<EditProfileRole darkMode={darkMode} />} />
                    <Route path="/add-profilerole" element={<AddProfileRole darkMode={darkMode} />} />
                    <Route path="/therapist/choose-schedule" element={<ChooseScheduleTherapist darkMode={true} />} />
                    <Route path="/timeslot-schedule" element={<TimeSlotSchedule darkMode={darkMode} />} />


            <Route
              path="*"
              element={
                <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                  <Routes>
                    <Route path="/" element={<HomePage darkMode={darkMode} />} />
                    {/* <Route path="/booking_page" element={<BookingPage />} /> */}
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
                 
                
                    <Route path="/edit-profile" element={<EditProfile darkMode={darkMode} />} />
                    <Route path="/add-profile" element={<AddProfile darkMode={darkMode} />} />
                    <Route path="*" element={<Error darkMode={darkMode} />} />
                 
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;