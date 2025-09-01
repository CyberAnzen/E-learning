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

  // Refs for retry logic
  const retryTimeoutRef = useRef(null);
  const nextIsThreeRef = useRef(true);

  // Build headers, conditionally include Content-Type
  const getHeaders = (payload) => {
    const baseHeaders = {
      Accept: "application/json",
      "x-client-fp": fp,
      "csrf-token": csrf,
      timestamp: Date.now(),
      ...customHeaders,
    };
    // Only set JSON content-type for non-FormData payloads
    if (!(payload instanceof FormData)) {
      baseHeaders["Content-Type"] = "application/json";
    }
    return baseHeaders;
  };

  const fetchData = useCallback(
    async (
      retryState = { csrf: false, timestamp: false, attempts: 0 },
      options = {} // options may contain override data
    ) => {
      // If no URL, exit early
      if (!url) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      // Determine payload: override or original
      const payload = options.data !== undefined ? options.data : data;

      let isRetryScheduled = false;
      try {
        const res = await axios({
          method,
          url,
          data: payload,
          headers: getHeaders(payload),
          withCredentials: true,
          timeout: 10000,
        });

        // Success: clear pending retry
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
          if (refreshed)
            return fetchData({ ...retryState, csrf: true }, options);
        }

        if (status === 411 && !retryState.timestamp) {
          return fetchData({ ...retryState, timestamp: true }, options);
        }

        const isNetworkError =
          !status &&
          (code === "ECONNABORTED" || err.message === "Network Error");

        // Retry GET requests on network errors with alternating delays
        if (method.toLowerCase() === "get" && isNetworkError) {
          const delay = nextIsThreeRef.current ? 3000 : 7000;
          nextIsThreeRef.current = !nextIsThreeRef.current;

          setRetryCount((c) => c + 1);
          isRetryScheduled = true;

          retryTimeoutRef.current = setTimeout(() => {
            fetchData(retryState, options);
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
    if (auto && endpoint) {
      fetchData();
    } else {
      setLoading(false);
      if (!endpoint) {
        setData(null);
        setError("");
      }
    }

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [fetchData, endpoint, auto]);

  return { Data, error, loading, retry: fetchData, retryCount };
};

export default Usefetch;
