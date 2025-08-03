import { useState, useEffect } from "react";
import Navbar from "./components/layout/navbar";
import "./App.css";
import "./index.css";
import Home from "./routes/home";
import Footer from "./components/layout/footer";
import Intro from "./components/intro";
import { AnimatePresence, motion } from "framer-motion";
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
import Profile from "./routes/account";
import Content from "./routes/content";
import Unauthorized from "./routes/Unauthorised";
import { useAppContext } from "./context/AppContext";
import useGetCsrfToken from "./hooks/utils/useGetCsrfToken";
import Testing from "./routes/testing";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import NotFound from "./routes/notFound";
import ProfileDashboard from "./components/ProfilePage/ProfileDashboard";
import EditProfile from "./components/ProfilePage/EditProfile";
import Account from "./routes/account";
import ContentController from "./routes/ContentController";
import CertificateList from "./components/ProfilePage/CertificateList";
import AdminEditor from "./components/Admin/Content/adminEditor";
import Profilenew from "./components/ProfilePage/Profile";
import AddChallenges from "./routes/CTF/AddChallenges";
function App() {
  const { user } = useAppContext();
  const getCsrfToken = useGetCsrfToken();
  const [intro, setIntro] = useState(true);
  const location = useLocation(); // Get the current route
  // Define routes where the footer should NOT appear
  const noFooterRoutes = ["/login", "/signup", "/forget-password", "/profile"];

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
      <div className="">
        <Navbar />
        <div className="mb-30"></div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route
            path="/lesson/:ClassificationId/:LessonId"
            element={<ContentController />}
          />
          <Route path="/lesson/create" element={<AdminEditor />} />
          <Route
            path="/lesson/update/:lessonId"
            element={<AdminEditor update />}
          />
          <Route path="/challenge" element={<ContestPage />} />
          <Route path="/challenge/add" element={<AddChallenges />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/profile" element={user ? <Account /> : <LoginPage />}>
            <Route index element={user ? <ProfileDashboard /> : null} />
            <Route path="profile2" element={<Profilenew />} />
            <Route path="editprofile" element={<EditProfile />} />
            <Route path="certificatelist" element={<CertificateList />} />
          </Route>
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/test" element={<Testing />} />
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
