import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppContextProvider } from "./context/AppContext.jsx";
import { SocketProvider } from "./context/useSocket";
import FaultyTerminal from "./components/Background.jsx";
import { useState, useEffect } from "react";

function Root() {
  const [animationsEnabled, setAnimationsEnabled] = useState(
    localStorage.getItem("animationOff") !== "true"
  );

  useEffect(() => {
    const syncStorage = () => {
      setAnimationsEnabled(localStorage.getItem("animationOff") !== "true");
    };

    // Listen for both localStorage (cross-tab) and custom app events (same tab)
    window.addEventListener("storage", syncStorage);
    window.addEventListener("animationToggle", syncStorage);

    return () => {
      window.removeEventListener("storage", syncStorage);
      window.removeEventListener("animationToggle", syncStorage);
    };
  }, []);

  return (
    <BrowserRouter>
      <AppContextProvider>
        <SocketProvider>
          {animationsEnabled && (
            <div className="fixed inset-0 -z-10">
              <FaultyTerminal
                scale={5}
                gridMul={[3, 19]}
                digitSize={1.2}
                timeScale={0.3}
                scanlineIntensity={0.8}
                tint="#17565c"
                brightness={0.4}
                maxFps={15}
                adaptiveQuality={true}
              />
            </div>
          )}
          <App />
        </SocketProvider>
      </AppContextProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<Root />);
