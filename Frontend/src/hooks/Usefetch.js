import { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import useGetCsrfToken from "./utils/useGetCsrfToken";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const MAX_RETRIES = 5;

const Usefetch = (
  endpoint,
  method = "get",
  data = null,
  customHeaders = {}
) => {
  const getCsrfToken = useGetCsrfToken();
  const { fp, csrf } = useContext(AppContext);
  const navigate = useNavigate();
  const [Data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const url = `${BACKEND_URL}/${endpoint}`;

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-client-fp": fp,
    "csrf-token": csrf,
    timestamp: Date.now(),
    ...customHeaders,
  });

  const fetchData = useCallback(
    async (retryState = { csrf: false, timestamp: false, attempts: 0 }) => {
      setLoading(true);
      setError("");

      try {
        const res = await axios({
          method,
          url,
          data,
          headers: getHeaders(),
          withCredentials: true,
          timeout: 5000,
        });
        setData(res.data || res);
        setRetryCount(0); // reset on success
      } catch (err) {
        const status = err.response?.status;
        const code = err.code;

        if (status === 401) {
          navigate("/unauthorized");
          return;
        }

        if (status === 402 && !retryState.csrf) {
          const refreshed = await getCsrfToken();
          if (refreshed) return fetchData({ ...retryState, csrf: true });
        }

        if (status === 411 && !retryState.timestamp) {
          return fetchData({ ...retryState, timestamp: true });
        }

        const isNetworkError =
          !status &&
          (code === "ECONNABORTED" || err.message === "Network Error");

        if (
          method.toLowerCase() === "get" &&
          isNetworkError &&
          retryState.attempts < MAX_RETRIES
        ) {
          const nextAttempt = retryState.attempts + 1;
          const delay = Math.min(32000, 2000 * 2 ** (nextAttempt - 1)); // cap at 32s
          setRetryCount(nextAttempt);
          setTimeout(() => {
            fetchData({ ...retryState, attempts: nextAttempt });
          }, delay);
          return;
        }

        setError(err.message || "Error");
      } finally {
        setLoading(false);
      }
    },
    [url, method, data, fp, csrf, navigate]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { Data, error, loading, retry: fetchData, retryCount };
};

export default Usefetch;
