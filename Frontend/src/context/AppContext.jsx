import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FingerPrintJS from "../../utils/Fingerprint";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(null);
  const [user, setUser] = useState(true);
  const [userData, setUserData] = useState(null);

  const [savedSkills, setSavedSkills] = useState([]);
  const [savedLinks, setSavedLinks] = useState(null);
  const [LearnAdd, setLearnAdd] = useState(false);
  const [Admin, setAdmin] = useState(false);
  const [classificationId, setClassificationId] = useState();
  const [fp, setFp] = useState(null);
  const [csrf, setCSRF] = useState(null);

  // Get Fingerprint
  const getFingerprint = async () => {
    try {
      const fingerprint = await FingerPrintJS();
      setFp(fingerprint);
      return fingerprint;
    } catch (error) {
      console.error("Failed to generate fingerprint:", error);
      return null;
    }
  };

  // Get CSRF using Fingerprint
  const getCsrf = async (fingerprint) => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/csrf-token`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-client-fp": fingerprint,
          timestamp: Date.now(),
        },
      });

      if (!res.ok) throw new Error("Failed to fetch CSRF token");

      const data = await res.json();
      setCSRF(data.csrfToken);
      return data.csrfToken;
    } catch (error) {
      console.error("CSRF fetch failed:", error);
      return null;
    }
  };

  // Get User Profile (only if CSRF is available)
  const getProfile = async (csrfToken, fingerprint) => {
    try {
      const res = await fetch(`${BACKEND_URL}/profile/data`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-client-fp": fingerprint,
          "x-csrf-token": csrfToken,
          timestamp: Date.now(),
        },
      });

      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      setUserData(data.user);
      setAdmin(data.user?.role === "admin");
      setLoggedIn(true);
    } catch (error) {
      console.error("Profile fetch failed:", error);
      setLoggedIn(false);
    }
  };

  // Initialize Fingerprint → CSRF → Profile flow
  useEffect(() => {
    const init = async () => {
      const fingerprint = await getFingerprint();
      if (!fingerprint) return;

      const csrfToken = await getCsrf(fingerprint);
      if (!csrfToken) return;

      await getProfile(csrfToken, fingerprint);
    };

    init();
  }, []);

  const value = {
    navigate,
    user,
    userData,
    setUser,
    savedSkills,
    setSavedSkills,
    savedLinks,
    setSavedLinks,
    LearnAdd,
    setLearnAdd,
    Admin,
    classificationId,
    setClassificationId,
    fp,
    csrf,
    loggedIn,
    setLoggedIn,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
