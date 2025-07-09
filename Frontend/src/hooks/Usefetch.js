import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import getCsrfToken from "./utils/useGetCsrfToken";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Usefetch = (
  endpoint,
  method = "get",
  data = null,
  customHeaders = {}
) => {
  const [Data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchCount, setFetchCount] = useState(0);
  const { fp, csrf } = useContext(AppContext);
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
      const controller = new AbortController();
      let timeout;

      const fetchData = async () => {
        try {
          const res = await axios({
            method: "get",
            url,
            headers: getHeaders(),
            credentials: "include", // Send and receive cookies
            signal: controller.signal,
          });
          setData(res.data);
          setError("");
        } catch (error) {
          if (axios.isCancel(error)) {
            console.log("Request canceled");
          } else {
            setError(error.message);
          }
        } finally {
          setLoading(false);
          setFetchCount((prev) => prev + 1);

          if (loading) {
            timeout = setTimeout(fetchData, 3000);
          }
        }
      };

      fetchData();

      return () => {
        controller.abort(); // cancel pending Axios request
        clearTimeout(timeout); // clear polling timeout
      };
    }, [url, loading, fetchCount, fp, csrf]);
  } else {
    reFetch = async () => {
      const controller = new AbortController();
      try {
        const res = await axios({
          method: method.toLowerCase(),
          url,
          data,
          headers: getHeaders(),
          credentials: "include", // Send and receive cookies
          signal: controller.signal,
        });
        setData(res.data);
        setError("");
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled");
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
        setFetchCount((prev) => prev + 1);
      }

      // Return abort function to optionally cancel it externally
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
