import { useCallback, useEffect, useState } from "react";
import { loadSlim } from "tsparticles-slim";

export default function ParticleBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    console.log(container);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 -z-10">
      {/* @ts-ignore */}
      <tsparticles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#0f172a",
            },
          },
          fpsLimit: 120,
          particles: {
            color: {
              value: "#01ffdb",
            },
            links: {
              color: "#01ffdb",
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: true,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.3,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
}
