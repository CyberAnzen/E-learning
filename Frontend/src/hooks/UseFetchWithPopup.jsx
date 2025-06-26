import React, { useState, useEffect } from "react";
import axios from "axios";
import { AlertCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function useFetchWithPopup(
  url,
  method = "get",
  data = null,
  headers = {},
  manualTrigger = false // New parameter to disable auto-fetch
) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Start with false if manual
  const [fetchCount, setFetchCount] = useState(0);
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(100);

  // Fetch logic
  const fetchData = async () => {
    setLoading(true);
    setShow(true);
    try {
      const res = await axios({
        method: method.toLowerCase(),
        url,
        data,
        headers,
      });
      setResponse(res.data);
      setError("");
    } catch (err) {
      setError(err.message);
      setResponse(null);
    } finally {
      setLoading(false);
      setFetchCount((prev) => prev + 1);
    }
  };

  // Auto-fetch only if manualTrigger is false
  useEffect(() => {
    if (!manualTrigger) {
      fetchData();
      const interval = setInterval(() => {
        if (loading) fetchData();
        else clearInterval(interval);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [url, method, data, headers, fetchCount, manualTrigger, loading]);

  // Manual trigger function
  const triggerFetch = () => {
    fetchData();
  };

  // Progress bar logic
  useEffect(() => {
    if (!loading && (response || error)) {
      setProgress(100);
      setShow(true);
      const timer = setInterval(() => {
        setProgress((prev) => (prev > 0 ? prev - 2 : 0));
      }, 60);
      setTimeout(() => {
        clearInterval(timer);
        setShow(false);
      }, 3000);
    }
  }, [response, error, loading]);

  // Popup component
  const Popup = () => {
    const containerClasses =
      "alert-container my-2 mx-auto max-w-xl p-4 rounded-lg shadow-lg " +
      "relative flex items-center gap-3 transition-all duration-300 ease-in-out";
    const IconWrapper = ({ children }) => (
      <div className="flex-shrink-0">{children}</div>
    );
    const ProgressBar = ({ colorClass }) => (
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 rounded-b-lg overflow-hidden">
        <div
          className={`h-full ${colorClass} transition-all duration-75 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    );

    if (!show) return null;

    if (error) {
      return (
        <div
          className={`${containerClasses} bg-red-500/10 border border-red-500/20 text-red-700`}
        >
          <IconWrapper>
            <XCircle className="w-5 h-5" />
          </IconWrapper>
          <p className="flex-1 font-medium">{error}</p>
          <ProgressBar colorClass="bg-red-500" />
        </div>
      );
    }

    if (loading) {
      return (
        <div
          className={`${containerClasses} bg-blue-500/10 border border-blue-500/20 text-blue-700`}
        >
          <IconWrapper>
            <Loader2 className="w-5 h-5 animate-spin" />
          </IconWrapper>
          <p className="flex-1 font-medium">Saving...</p>
          <ProgressBar colorClass="bg-blue-500" />
        </div>
      );
    }

    if (response?.message) {
      return (
        <div
          className={`${containerClasses} bg-green-500/10 border border-green-500/20 text-green-700`}
        >
          <IconWrapper>
            <CheckCircle2 className="w-5 h-5" />
          </IconWrapper>
          <p className="flex-1 font-medium">{response.message}</p>
          <ProgressBar colorClass="bg-green-500" />
        </div>
      );
    }

    if (response?.error) {
      return (
        <div
          className={`${containerClasses} bg-amber-500/10 border border-amber-500/20 text-amber-700`}
        >
          <IconWrapper>
            <AlertCircle className="w-5 h-5" />
          </IconWrapper>
          <p className="flex-1 font-medium">{response.error}</p>
          <ProgressBar colorClass="bg-amber-500" />
        </div>
      );
    }

    return null;
  };

  return { response, error, loading, Popup, triggerFetch };
}
