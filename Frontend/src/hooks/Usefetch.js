import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const Usefetch = (url, method = "get", data = null, headers = {}) => {
  const [Data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchCount, setFetchCount] = useState(0);

  let reFetch = null; // Declare the function outside first

  if (method.toLowerCase() === "get") {
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await axios({
            method: "get",
            url,
            headers,
          });
          setData(res.data);
          setLoading(false);
          setError("");
          console.log(res.data);
        } catch (error) {
          setError(error.message);
        } finally {
          setFetchCount((prev) => prev + 1);
        }
      };

      const interval = setInterval(() => {
        if (loading) {
          fetchData();
          setFetchCount((prev) => prev + 1);
        } else {
          clearInterval(interval);
        }
      }, fetchCount === 0 ? 0 : 3000);

      return () => clearInterval(interval);
    }, [url, loading, fetchCount]);
  } else {
    // 👇 Define the function to be called manually
    reFetch = async () => {
      try {
        const res = await axios({
          method: method.toLowerCase(),
          url,
          data,
          headers,
        });
        setData(res.data);
        setError("");
        console.log(res.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
        setFetchCount((prev) => prev + 1);
      }
    };
  }

  return {
    Data,
    error,
    loading,
    reFetch, // Only works for POST/PUT/DELETE
  };
};

export default Usefetch;