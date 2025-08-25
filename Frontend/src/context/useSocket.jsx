import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL_W;
const WS_URL = BACKEND_URL.replace(/^http(s?)/, "ws$1") + "/ws/leaderboard";

const SocketContext = createContext(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [clientCount, setClientCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState(null);
  const [reconnectTimer, setReconnectTimer] = useState(null);

  const connect = useCallback(() => {
    if (ws) {
      ws.close();
    }

    console.log("[WS] Connecting to:", WS_URL);
    const newWs = new WebSocket(WS_URL);

    newWs.onopen = () => {
      console.log("[WS] Connected to leaderboard");
      setIsConnected(true);
    };

    newWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("[WS] Received message:", data);

        if (data.type === "CLIENT_COUNT") {
          setClientCount(data.totalClients);
        } else if (data.type === "LEADERBOARD_UPDATE" && data.allRanks) {
          setLeaderboardData(data.allRanks);
        }
      } catch (err) {
        console.warn("[WS] Invalid message:", err);
      }
    };

    newWs.onclose = () => {
      console.log("[WS] Disconnected. Reconnecting in 2s...");
      setIsConnected(false);
      const timer = setTimeout(connect, 2000);
      setReconnectTimer(timer);
    };

    newWs.onerror = (err) => {
      console.error("[WS] Error:", err);
      setIsConnected(false);
      newWs.close();
    };

    setWs(newWs);
  }, [ws]);

  const reconnect = useCallback(() => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      setReconnectTimer(null);
    }
    connect();
  }, [connect, reconnectTimer]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const value = {
    leaderboardData,
    clientCount,
    isConnected,
    reconnect,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
