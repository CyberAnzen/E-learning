import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppContextProvider } from "./context/AppContext.jsx";
import FaultyTerminal from "./components/Background.jsx";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <div className="fixed inset-0 -z-10">
        <FaultyTerminal
          scale={4}
          gridMul={[3, 19]}
          digitSize={1.2}
          timeScale={0.7}
          pause={false}
          scanlineIntensity={0.8}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0}
          tint="#17565c"
          mouseReact={false}
          mouseStrength={0.5}
          pageLoadAnimation={true}
          brightness={0.4}
        />
      </div>

      <App />
    </AppContextProvider>
  </BrowserRouter>
);
