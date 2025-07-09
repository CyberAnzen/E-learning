import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import useGetCsrfToken from "./utils/useGetCsrfToken";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Usefetch = (
  endpoint,
  method = "get",
  data = null,
  customHeaders = {}
) => {
  const getCsrfToken = useGetCsrfToken();
  const [Data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchCount, setFetchCount] = useState(0);
  const { fp, csrf } = useContext(AppContext);
  const navigate = useNavigate();
  const url = `${BACKEND_URL}/${endpoint}`;

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-client-fp": fp,
    "csrf-token": csrf,
    timestamp: Date.now(),
    ...customHeaders,
  });

  let reFetch = null;

  if (method.toLowerCase() === "get") {
    useEffect(() => {
      let isMounted = true;
      const controller = new AbortController();
      let timeout;

      const fetchData = async (retry = { csrf: false, timestamp: false }) => {
        try {
          const res = await axios({
            method: "get",
            url,
            headers: getHeaders(),
            withCredentials: true,
            signal: controller.signal,
          });
          if (isMounted) {
            setData(res);
            setError("");
          }
        } catch (err) {
          if (axios.isCancel(err)) {
            console.log("Request canceled");
          } else {
            const status = err.response?.status;

            if (status === 402 && !retry.csrf) {
              const csrfOk = await getCsrfToken();
              if (csrfOk) return fetchData({ ...retry, csrf: true });
            }

            if (status === 411 && !retry.timestamp) {
              return fetchData({ ...retry, timestamp: true });
            }

            if (status === 401) {
              navigate("/unauthorized");
              return;
            }

            if (isMounted) setError(err.message);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
            setFetchCount((prev) => prev + 1);
          }
          timeout = setTimeout(() => {
            if (isMounted) fetchData();
          }, 3000);
        }
      };

      fetchData();

      return () => {
        isMounted = false;
        controller.abort();
        clearTimeout(timeout);
      };
    }, [url, fp, csrf, getCsrfToken]);
  } else {
    reFetch = async (retry = { csrf: false, timestamp: false }) => {
      const controller = new AbortController();
      try {
        const res = await axios({
          method: method.toLowerCase(),
          url,
          data,
          headers: getHeaders(),
          withCredentials: true,
          signal: controller.signal,
        });
        setData(res);
        setError("");
      } catch (err) {
        const status = err.response?.status;

        if (status === 402 && !retry.csrf) {
          const csrfOk = await getCsrfToken();
          if (csrfOk) return reFetch({ ...retry, csrf: true });
        }

        if (status === 411 && !retry.timestamp) {
          return reFetch({ ...retry, timestamp: true });
        }

        if (status === 401) {
          navigate("/unauthorized");
          return;
        }

        setError(err.message);
      } finally {
        setLoading(false);
        setFetchCount((prev) => prev + 1);
      }

      return () => controller.abort();
    };
  }

  return {
    Data,
    error,
    loading,
    reFetch,
  };
};

export default Usefetch;
