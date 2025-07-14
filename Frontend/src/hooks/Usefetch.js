import { useEffect, useState, useContext, useCallback, useRef } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import useGetCsrfToken from "./utils/useGetCsrfToken";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Usefetch = (
  endpoint,
  method = "get",
  data = null,
  customHeaders = {},
  auto = true // <<< NEW PARAMETER
) => {
  const getCsrfToken = useGetCsrfToken();
  const { fp, csrf } = useContext(AppContext);
  const navigate = useNavigate();

  const [Data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Construct URL only if endpoint is provided
  const url = endpoint ? `${BACKEND_URL}/${endpoint}` : null;

  // Ref to store the pending timeout ID
  const retryTimeoutRef = useRef(null);
  // Ref to toggle between 3s and 7s delays
  const nextIsThreeRef = useRef(true);

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
      // If no URL (i.e., endpoint is null), do nothing and set loading to false
      if (!url) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      let isRetryScheduled = false;

      try {
        const res = await axios({
          method,
          url,
          data,
          headers: getHeaders(),
          withCredentials: true,
          timeout: 5000,
        });

        // Success! Clear any pending retry
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = null;
        }

        setData(res.data || res);
        setRetryCount(0);
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

        // Infinite retry on network error, alternating 3s / 7s
        if (method.toLowerCase() === "get" && isNetworkError) {
          const delay = nextIsThreeRef.current ? 3000 : 7000;
          nextIsThreeRef.current = !nextIsThreeRef.current;

          setRetryCount((c) => c + 1);
          isRetryScheduled = true;

          retryTimeoutRef.current = setTimeout(() => {
            fetchData(retryState);
          }, delay);

          return;
        }

        setError(err.message || "Error");
      } finally {
        if (!isRetryScheduled) {
          setLoading(false);
        }
      }
    },
    [url, method, data, fp, csrf, navigate]
  );

  useEffect(() => {
    // Only fetch on mount/update if auto is true and endpoint provided
    if (auto && endpoint) {
      fetchData();
    } else {
      // if manual mode or no endpoint, initialize states
      setLoading(false);
      if (!endpoint) {
        setData(null);
        setError("");
      }
    }

    // Cleanup on unmount
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [fetchData, endpoint, auto]);

  return { Data, error, loading, retry: fetchData, retryCount };
};

export default Usefetch;
