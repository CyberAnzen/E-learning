import React, { useEffect, useRef, useCallback } from "react";

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Optimized particle system - reduced count
    const particles = [];
    const codeStreams = [];
    const glitchBoxes = [];

    // Create fewer particles for better performance
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.01 + 0.005,
      });
    }

    // Terminal code streams
    const codeLines = [
      "$ npm install cybersec-auth",
      "$ node server.js --secure",
      "Initializing quantum encryption...",
      "Loading neural network modules...",
      "Establishing secure connection...",
      "Authenticating biometric data...",
      "Scanning for vulnerabilities...",
      "Firewall status: ACTIVE",
      "Encryption level: AES-256",
      "Access granted to user: ADMIN",
      "Running security protocols...",
      "Monitoring network traffic...",
      "Database connection: SECURE",
      "Backup systems: ONLINE",
      "System integrity: 100%",
    ];

    // Create code streams
    for (let i = 0; i < 8; i++) {
      codeStreams.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        text: codeLines[Math.floor(Math.random() * codeLines.length)],
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.6 + 0.2,
        charIndex: 0,
        displayText: "",
        typeSpeed: Math.random() * 3 + 1,
        typeTimer: 0,
        completed: false,
        lifetime: 0,
        maxLifetime: Math.random() * 300 + 200,
      });
    }

    // Create fewer glitch boxes
    for (let i = 0; i < 2; i++) {
      glitchBoxes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: Math.random() * 100 + 30,
        height: Math.random() * 60 + 20,
        opacity: 0,
        glitchTimer: 0,
        glitchDuration: Math.random() * 120 + 60,
      });
    }

    let time = 0;
    let frameCount = 0;

    // Optimized animation loop with frame skipping
    const animate = () => {
      frameCount++;
      time += 0.016;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw simplified grid (every 3rd frame for performance)
      if (frameCount % 3 === 0) {
        ctx.strokeStyle = "rgba(1, 255, 219, 0.05)";
        ctx.lineWidth = 1;

        const gridSize = 100;

        // Simplified grid - fewer lines
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }

        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }

      // Update and draw code streams
      codeStreams.forEach((stream, index) => {
        stream.lifetime++;

        if (stream.lifetime > stream.maxLifetime) {
          // Reset stream
          stream.x = Math.random() * canvas.width;
          stream.y = Math.random() * canvas.height;
          stream.text = codeLines[Math.floor(Math.random() * codeLines.length)];
          stream.charIndex = 0;
          stream.displayText = "";
          stream.completed = false;
          stream.lifetime = 0;
          stream.maxLifetime = Math.random() * 300 + 200;
          stream.opacity = Math.random() * 0.6 + 0.2;
        }

        // Typing effect
        if (!stream.completed) {
          stream.typeTimer += stream.typeSpeed;
          if (stream.typeTimer >= 1 && stream.charIndex < stream.text.length) {
            stream.displayText += stream.text[stream.charIndex];
            stream.charIndex++;
            stream.typeTimer = 0;
          }
          if (stream.charIndex >= stream.text.length) {
            stream.completed = true;
          }
        }

        // Draw terminal text
        ctx.fillStyle = `rgba(1, 255, 219, ${stream.opacity})`;
        ctx.font = "14px 'Courier New', monospace";
        ctx.fillText(stream.displayText, stream.x, stream.y);

        // Add cursor for active typing
        if (!stream.completed && Math.sin(time * 8) > 0) {
          const textWidth = ctx.measureText(stream.displayText).width;
          ctx.fillRect(stream.x + textWidth, stream.y - 12, 8, 14);
        }

        // Fade out completed text
        if (stream.completed && stream.lifetime > stream.maxLifetime * 0.7) {
          stream.opacity *= 0.98;
        }
      });

      // Optimized particle system - skip some calculations
      if (frameCount % 2 === 0) {
        particles.forEach((particle) => {
          // Update particle
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.pulse += particle.pulseSpeed;

          // Wrap around screen
          if (particle.x < -5) particle.x = canvas.width + 5;
          if (particle.x > canvas.width + 5) particle.x = -5;
          if (particle.y < -5) particle.y = canvas.height + 5;
          if (particle.y > canvas.height + 5) particle.y = -5;

          // Draw particle with reduced glow for performance
          const pulseOpacity =
            particle.opacity + Math.sin(particle.pulse) * 0.1;

          ctx.fillStyle = `rgba(1, 255, 219, ${pulseOpacity})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Simplified glitch boxes
      glitchBoxes.forEach((box) => {
        box.glitchTimer++;

        if (box.glitchTimer > box.glitchDuration) {
          if (Math.random() < 0.01) {
            box.opacity = Math.random() * 0.3 + 0.1;
            box.x = Math.random() * canvas.width;
            box.y = Math.random() * canvas.height;
            box.glitchTimer = 0;
            box.glitchDuration = Math.random() * 120 + 60;
          }
        }

        if (box.opacity > 0) {
          ctx.fillStyle = `rgba(1, 255, 219, ${box.opacity})`;
          ctx.fillRect(box.x, box.y, box.width, box.height);
          box.opacity *= 0.96;
        }
      });

      // Draw corner brackets (static, no animation needed)
      if (frameCount % 60 === 0) {
        // Update every 60 frames
        const bracketSize = 25;
        ctx.strokeStyle = "rgba(1, 255, 219, 0.3)";
        ctx.lineWidth = 2;

        // Top-left
        ctx.beginPath();
        ctx.moveTo(15, 15 + bracketSize);
        ctx.lineTo(15, 15);
        ctx.lineTo(15 + bracketSize, 15);
        ctx.stroke();

        // Top-right
        ctx.beginPath();
        ctx.moveTo(canvas.width - 15 - bracketSize, 15);
        ctx.lineTo(canvas.width - 15, 15);
        ctx.lineTo(canvas.width - 15, 15 + bracketSize);
        ctx.stroke();

        // Bottom-left
        ctx.beginPath();
        ctx.moveTo(15, canvas.height - 15 - bracketSize);
        ctx.lineTo(15, canvas.height - 15);
        ctx.lineTo(15 + bracketSize, canvas.height - 15);
        ctx.stroke();

        // Bottom-right
        ctx.beginPath();
        ctx.moveTo(canvas.width - 15 - bracketSize, canvas.height - 15);
        ctx.lineTo(canvas.width - 15, canvas.height - 15);
        ctx.lineTo(canvas.width - 15, canvas.height - 15 - bracketSize);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{
        background: "transparent",
      }}
    />
  );
};

export default React.memo(ParticleBackground);
