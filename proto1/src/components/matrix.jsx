import React, { useRef, useEffect } from 'react';

const Matrix = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to fill the window
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    // Characters for the Matrix effect (feel free to customize)
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);

    // Create an array of drops, one per column, initialized at position 1
    const drops = Array(columns).fill(1);

    // Draw function to render the Matrix rain effect
    const draw = () => {
      // Draw a translucent black rectangle over the entire canvas to create a fading trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set the text style for the falling letters
      ctx.fillStyle = "#0F0"; // green color
      ctx.font = `${fontSize}px monospace`;

      // Loop over every drop (column)
      for (let i = 0; i < drops.length; i++) {
        // Choose a random character from the letters string
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(text, x, y);

        // Reset drop to the top randomly after it passes the bottom of the screen
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    // Animation loop using requestAnimationFrame for smooth performance
    let animationFrameId;
    const animate = () => {
      draw();
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Handle window resize events
    const handleResize = () => {
      setCanvasSize();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup function to cancel animation and remove event listener on component unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // The canvas is positioned fixed to fill the entire viewport
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        background: '#000',
        zIndex: -1,
      }}
    />
  );
};

export default Matrix;
