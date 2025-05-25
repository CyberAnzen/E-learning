import React, { useState, useEffect } from "react";
import axios from "axios";
import { AlertCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function useFetchWithPopup(
  url,
  method = "get",
  data = null,
  headers = {}
) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchCount, setFetchCount] = useState(0);
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(100);

  // 1. Fetch logic with auto-retry every 3 seconds if still loading
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios({
          method: method.toLowerCase(),
          url,
          data,
          headers,
        });
        setResponse(res.data);
        setError("");
        setLoading(false);
      } catch (err) {
        setError(err.message);
      } finally {
        setFetchCount((prev) => prev + 1);
      }
    };

    const interval = setInterval(() => {
      if (loading) {
        fetchData();
      } else {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [url, method, data, headers, loading, fetchCount]);

  // 2. When we get a final response (message or error), start a 3s countdown
  //    for the progress bar and auto-hide after completion.
  useEffect(() => {
    if (response && (response.message || response.error)) {
      // Reset progress to 100% whenever a new alert appears
      setProgress(100);
      setShow(true);

      // 3 seconds total (50 steps * 60ms = 3000ms)
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev > 0) return prev - 2; // Faster countdown
          return 0;
        });
      }, 60);

      return () => clearInterval(timer);
    }
  }, [response]);

  // 3. Hide alert when progress hits 0
  useEffect(() => {
    if (progress <= 0) {
      setShow(false);
    }
  }, [progress]);

  // 4. The Popup component to display alerts
  const Popup = () => {
    // Common container classes for styling
    const containerClasses =
      "alert-container my-2 mx-auto max-w-xl p-4 rounded-lg shadow-lg " +
      "relative flex items-center gap-3 transition-all duration-300 ease-in-out";

    // Simple wrapper for icons
    const IconWrapper = ({ children }) => (
      <div className="flex-shrink-0">{children}</div>
    );

    // Progress bar at the bottom of each alert
    const ProgressBar = ({ colorClass }) => (
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 rounded-b-lg overflow-hidden">
        <div
          className={`h-full ${colorClass} transition-all duration-75 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    );

    // --- Network error (axios request failed) ---
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

    // --- Loading state ---
    if (loading) {
      return (
        <div
          className={`${containerClasses} bg-blue-500/10 border border-blue-500/20 text-blue-700`}
        >
          <IconWrapper>
            <Loader2 className="w-5 h-5 animate-spin" />
          </IconWrapper>
          <p className="flex-1 font-medium">Fetching data...</p>
          <ProgressBar colorClass="bg-blue-500" />
        </div>
      );
    }

    // --- API returned an error property ---
    if (response?.error && show) {
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

    // --- API returned a success message ---
    if (response?.message && show) {
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

    // No alert to show
    return null;
  };

  return { response, error, loading, Popup };
}
