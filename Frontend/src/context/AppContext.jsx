import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FingerPrintJS from "../../utils/Fingerprint";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(true);
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [savedSkills, setSavedSkills] = useState([]);
  const [savedLinks, setSavedLinks] = useState(null);
  const [LearnAdd, setLearnAdd] = useState(false);
  const [Admin, setAdmin] = useState(false);
  const [classificationId, setClassificationId] = useState();
  const [fp, setFp] = useState(null);
  const [csrf, setCSRF] = useState(null);

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
      setUser(data?.data || null);
      setAdmin(data?.user?.role === "admin");
      setLoggedIn(true);
      return data?.data || null;
    } catch (error) {
      console.error("Profile fetch failed:", error);
      setLoggedIn(false);
      setUser(null);
      setAdmin(false);
      return null;
    }
  };

  const getTeam = async (csrfToken, fingerprint) => {
    try {
      const res = await fetch(`${BACKEND_URL}/team`, {
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

      if (!res.ok) {
        if (res.status === 404) {
          setTeam(null);
          return null;
        }
        throw new Error("Failed to fetch team");
      }

      const data = await res.json();
      setTeam(data?.data || null);
      return data?.data || null;
    } catch (error) {
      console.error("Team fetch failed:", error);
      setTeam(null);
      return null;
    }
  };

  const fetchUser = async () => {
    const fingerprint = fp || (await getFingerprint());
    if (!fingerprint) return null;
    const csrfToken = csrf || (await getCsrf(fingerprint));
    if (!csrfToken) return null;
    return getProfile(csrfToken, fingerprint);
  };

  const fetchTeam = async () => {
    const fingerprint = fp || (await getFingerprint());
    if (!fingerprint) return null;
    const csrfToken = csrf || (await getCsrf(fingerprint));
    if (!csrfToken) return null;
    return getTeam(csrfToken, fingerprint);
  };

  useEffect(() => {
    const init = async () => {
      const fingerprint = await getFingerprint();
      if (!fingerprint) return;
      const csrfToken = await getCsrf(fingerprint);
      if (!csrfToken) return;
      await getProfile(csrfToken, fingerprint);
      await getTeam(csrfToken, fingerprint);
    };

    init();
  }, [loggedIn]);

  const logout = () => {
    setLoggedIn(false);
    setUser(null);
    setCSRF(null);
    setTeam(null);
    setAdmin(false);
  };

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
    loggedIn,
    setLoggedIn,
    logout,
    team,
    setTeam,
    fetchUser,
    fetchTeam,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
