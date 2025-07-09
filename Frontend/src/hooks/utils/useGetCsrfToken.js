import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const useGetCsrfToken = () => {
  const navigate = useNavigate();
  const { fp, setCSRF, loggedIn } = useContext(AppContext);

  const getCsrfToken = async () => {
    if (!loggedIn) return false;
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
        if (res.status === 401) {
          navigate("/unauthorised");
        }
        throw new Error("Failed to fetch CSRF token");
      }

      const data = await res.json();
      setCSRF(data.csrfToken);
      return true;
    } catch (err) {
      console.error("CSRF token fetch error:", err);
      return false;
    }
  };

  return getCsrfToken;
};

export default useGetCsrfToken;
