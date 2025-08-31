import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppContextProvider } from "./context/AppContext.jsx";
import { SocketProvider } from "./context/useSocket";
import FaultyTerminal from "./components/Background.jsx";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <SocketProvider>
        <div className="fixed inset-0 -z-10">
          <FaultyTerminal
            scale={5}
            gridMul={[3, 19]}
            digitSize={1.2}
            timeScale={0.3}
            scanlineIntensity={0.8}
            tint="#17565c"
            brightness={0.4}
            maxFps={15} // Even lower FPS for very low-end devices
            adaptiveQuality={true}
          />
        </div>

        <App />
      </SocketProvider>
    </AppContextProvider>
  </BrowserRouter>
);
