import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FingerPrintJS from "../../utils/Fingerprint";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [loggedIn, setloggedIn] = useState(false);
  const [user, setUser] = useState(null); // default should be null, not true
  const [savedSkills, setSavedSkills] = useState([]);
  const [savedLinks, setSavedLinks] = useState(null);
  const [LearnAdd, setLearnAdd] = useState(false);
  const [Admin, setAdmin] = useState(true);
  const [classificationId, setClassificationId] = useState();
  const [fp, setFp] = useState(null);
  const [csrf, setCSRF] = useState(null);
  // Generate fingerprint only once
  const getFingerprint = async () => {
    try {
      const fp = await FingerPrintJS();
      setFp(fp);
    } catch (error) {
      console.error("Failed to generate fingerprint:", error);
    }
  };
  const getCsrf = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/csrf-token`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-client-fp": fp,
          timestamp: Date.now(),
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch CSRF token");
      }
      const data = await res.json();
      setCSRF(data.csrfToken);
      return true;
    } catch (err) {
      return false;
    }
  };
  useEffect(() => {
    const init = async () => {
      await getFingerprint();
      const success = await getCsrf();
      setloggedIn(success);
    };

    init();
  }, []);

  // // Fetch CSRF token only when loggedIn becomes true
  // useEffect(() => {
  //   const fetchCsrfIfLoggedIn = async () => {
  //     if (loggedIn) {
  //       await getCsrfToken();
  //     }
  //   };
  //   fetchCsrfIfLoggedIn();
  // }, [loggedIn]);

  const value = {
    navigate,
    user,
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
    setCSRF,
    loggedIn,
    setloggedIn,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
