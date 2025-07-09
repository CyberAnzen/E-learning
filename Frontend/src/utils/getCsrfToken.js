import { AppContext } from "../context/AppContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const getCsrfToken = async () => {
  const { fp } = useContext(AppContext);
  const res = await fetch(`${BACKEND_URL}/auth/csrf-token`, {
    method: "GET",
    credentials: "include", // Send and receive cookies
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-client-fp": fp,
      timestamp: Date.now(),
    },
  });

  if (!res.ok) {
    if(res.status == 401){
      //navigate to login
    }
    throw new Error("Failed to fetch CSRF token");
  }

  return await res.json(); // returns full JSON response
};

export default getCsrfToken;
