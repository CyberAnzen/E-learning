import { useState, useEffect } from "react";
import Navbar from "./components/layout/navbar";
import "./App.css";
import "./index.css";
import Home from "./routes/home";
import Footer from "./components/layout/footer";
import Intro from "./components/intro";
import { AnimatePresence, motion } from "framer-motion";
import { i } from "framer-motion/client";
import { BrowserRouter } from "react-router-dom";
// Import page components
import HomePage from "./routes/home";
import LearnPage from "./routes/learn";
import ContestPage from "./routes/contest";
import LoginPage from "./routes/login";
import AboutPage from "./routes/about";
import ForgetPassword from "./routes/forgetPassword";
import Terms from "./routes/terms";
import Signup from "./routes/signup";
import PrivacyPolicy from "./routes/privacyPolicy";
import Profile from "./routes/ProfilePage/account";
import Content from "./routes/content";
import AdminEditor from "./routes/adminEditor";
import {useAppContext} from "./context/AppContext"

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import NotFound from "./routes/notFound";
import ProfileDashboard from "./routes/ProfilePage/ProfileDashboard";
import EditProfile from "./routes/ProfilePage/EditProfile";
import Account from "./routes/ProfilePage/account";
function App() {
  const { user }= useAppContext();
  const [intro, setIntro] = useState(true);
  const location = useLocation(); // Get the current route
  // Define routes where the footer should NOT appear
  const noFooterRoutes = ["/login", "/signup", "/forget-password"];

  // Check if the current route is NOT in the noFooterRoutes list
  const showFooter = !noFooterRoutes.includes(location.pathname);
  useEffect(() => {
    // Block scrolling while the intro is active
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setIntro(false);
      // Re-enable scrolling once the intro is done
      document.body.style.overflow = "";
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <div className="bg-gray-900">
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/contest" element={<ContestPage />} />
          <Route path="/learn/:id" element={<Content />} />
          <Route path="/admin/learn/:id" element={<AdminEditor />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/profile" element={user ? <Account /> : <LoginPage />}>
            <Route index element={user ? <ProfileDashboard /> : null} />
            <Route path="editprofile" element={<EditProfile />} />
          </Route>
          <Route path="/*" element={<NotFound />} />
        </Routes>

        {/* Animated line */}
        <motion.div
          className="w-full  h-0.5 bg-gradient-to-r from-transparent via-[#01ffdb]/30 to-transparent mt-0 "
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        {/* Conditionally render the Footer */}
        {showFooter && <Footer />}
      </div>
      <AnimatePresence>
        {intro && (
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 10000,
            }}
          >
            <Intro />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
