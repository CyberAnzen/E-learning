import React, { useState } from "react";
import { Link } from "react-router-dom";

// New skeleton component
const CyberpunkIDskeleton = ({ scaleFactor = 1 }) => {
  return (
    <div 
      className="cyberpunk-card-wrapper" 
      style={{ 
        display: "inline-block", 
        position: "relative",
        cursor: "wait"
      }}
    >
      <div style={{
        width: 1080 * scaleFactor,
        height: 700 * scaleFactor,
        backgroundColor: "#111",
        borderRadius: "28px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Skeleton Loading Animation */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(
            90deg,
            rgba(30, 30, 30, 0) 0%,
            rgba(30, 30, 30, 0.05) 20%,
            rgba(30, 30, 30, 0.3) 60%,
            rgba(30, 30, 30, 0)
          )`,
          animation: "skeletonShimmer 1.5s infinite",
        }} />
        
        {/* Skeleton Content */}
        <div style={{
          position: "absolute",
          top: 100 * scaleFactor,
          left: 140 * scaleFactor,
          width: 400 * scaleFactor,
          height: 64 * scaleFactor,
          backgroundColor: "#222",
          borderRadius: 10 * scaleFactor
        }} />
        
        <div style={{
          position: "absolute",
          top: 184 * scaleFactor,
          left: 140 * scaleFactor,
          width: 200 * scaleFactor,
          height: 52 * scaleFactor,
          backgroundColor: "#222",
          borderRadius: 8 * scaleFactor
        }} />
        
        <div style={{
          position: "absolute",
          top: 250 * scaleFactor,
          left: 160 * scaleFactor,
          width: 500 * scaleFactor,
          height: 20 * scaleFactor,
          backgroundColor: "#222",
          borderRadius: 4 * scaleFactor
        }} />
        
        <div style={{
          position: "absolute",
          top: 290 * scaleFactor,
          left: 160 * scaleFactor,
          width: 450 * scaleFactor,
          height: 20 * scaleFactor,
          backgroundColor: "#222",
          borderRadius: 4 * scaleFactor
        }} />
        
        <div style={{
          position: "absolute",
          top: 40 * scaleFactor,
          right: 140 * scaleFactor,
          width: 80 * scaleFactor,
          height: 40 * scaleFactor,
          backgroundColor: "#222",
          borderRadius: 8 * scaleFactor
        }} />
        
        <div style={{
          position: "absolute",
          top: 40 * scaleFactor,
          right: 40 * scaleFactor,
          width: 80 * scaleFactor,
          height: 40 * scaleFactor,
          backgroundColor: "#222",
          borderRadius: 8 * scaleFactor
        }} />
        
        <div style={{
          position: "absolute",
          bottom: 100 * scaleFactor,
          right: 160 * scaleFactor,
          width: 120 * scaleFactor,
          height: 40 * scaleFactor,
          backgroundColor: "#222",
          borderRadius: 8 * scaleFactor
        }} />
        
        <div style={{
          position: "absolute",
          bottom: 100 * scaleFactor,
          right: 40 * scaleFactor,
          width: 40 * scaleFactor,
          height: 32 * scaleFactor,
          backgroundColor: "#222",
          borderRadius: 6 * scaleFactor
        }} />
        
        <div style={{
          position: "absolute",
          bottom: 48 * scaleFactor,
          left: 140 * scaleFactor,
          width: 280 * scaleFactor,
          height: 8 * scaleFactor,
          backgroundColor: "#222",
          borderRadius: 4 * scaleFactor
        }} />
        
        <div style={{
          position: "absolute",
          top: "50%",
          left: 92 * scaleFactor,
          transform: "translateY(-50%) rotate(-90deg)",
          width: 200 * scaleFactor,
          height: 25 * scaleFactor,
          backgroundColor: "#222",
          borderRadius: 4 * scaleFactor
        }} />
        
        <div style={{
          position: "absolute",
          bottom: 69 * scaleFactor,
          right: 45 * scaleFactor,
          width: 40 * scaleFactor,
          height: 40 * scaleFactor,
          backgroundColor: "#222",
          borderRadius: "50%"
        }} />
      </div>
    </div>
  );
};

const ChallengeCardSkeleton = ({
  Challenge,
  scaleFactor = 1,
  redColor = "#E53935",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Return skeleton if Challenge data is not available
  if (!Challenge) {
    return <CyberpunkIDskeleton scaleFactor={scaleFactor} />;
  }

  // Original component logic below
  // Calculate hover scale factor (5% larger when hovered)
  const hoverScale = 1;
  const effectiveScaleFactor = scaleFactor * hoverScale;

  // Base dimensions (original size)
  const ORIGINAL_WIDTH = 1080;
  const ORIGINAL_HEIGHT = 700;

  // Apply scaling factor
  const width = ORIGINAL_WIDTH * effectiveScaleFactor;
  const height = ORIGINAL_HEIGHT * effectiveScaleFactor;

  // Base red rounded rectangle with top-center tab protruding 30px.
  const baseInset = 100 * effectiveScaleFactor;
  const baseTabWidth = 180 * effectiveScaleFactor;
  const baseTabHeight = 30 * effectiveScaleFactor;
  const baseRadius = 28 * effectiveScaleFactor;
  const baseX = baseInset;
  const baseY = baseInset;
  const baseWidth = width - baseInset * 2;
  const baseHeight = height - baseInset * 2;

  // Overlay black rounded rectangle inset 12px with radius 24px + drop shadow
  const overlayInset = baseInset + 12 * effectiveScaleFactor;
  const overlayRadius = 24 * effectiveScaleFactor;
  const overlayX = overlayInset;
  const overlayY = overlayInset;
  const overlayWidth = width - overlayInset * 2;
  const overlayHeight = height - overlayInset * 2;

  // Colors
  const brightRed = isHovered ? "rgba(128,128,128,0.5)" : redColor;
  const black = "#111111";
  const darkGrayTechMap = "#424242";
  const mediumGray = "#9E9E9E";

  // Legal text content (example placeholder)
  const legalText =
    "Don't Zoom in here, you won't find anything. Your clock is ticking so solve the challenges before time runs out.";

  // Barcode bars generation (vertical red barcode)
  const barcodeX =
    width - 60 * effectiveScaleFactor - 120 * effectiveScaleFactor;
  const barcodeY =
    height - baseInset - 80 * effectiveScaleFactor - 20 * effectiveScaleFactor;
  const barcodeBarWidth = 5 * effectiveScaleFactor;
  const barcodeBarHeight = 20 * effectiveScaleFactor;
  const barcodeBarsCount = 20;

  // Ghost lines at given coordinates
  const glitchLine1 = {
    width: 100 * effectiveScaleFactor,
    height: 4 * effectiveScaleFactor,
    rotate: 45,
    opacity: 0.2,
    x:
      width -
      baseInset -
      100 * effectiveScaleFactor -
      20 * effectiveScaleFactor,
    y: baseInset + 20 * effectiveScaleFactor,
  };
  const glitchLine2 = {
    width: 160 * effectiveScaleFactor,
    height: 3 * effectiveScaleFactor,
    rotate: -12,
    opacity: 0.1,
    x: width / 2 - (160 * effectiveScaleFactor) / 2,
    y:
      height - baseInset - 48 * effectiveScaleFactor - 3 * effectiveScaleFactor,
  };

  // Vertical "AUTHORIZATION" rotated text properties
  const authorizationText = "CyberAnzen";

  // Simple Tech-map silhouette shape
  const techMapWidth = overlayWidth * 0.6;
  const techMapHeight = overlayHeight * 0.4;
  const techMapX = width / 2 - techMapWidth / 2;
  const techMapY = height / 2 - techMapHeight / 2;

  // Font sizes
  const secretFontSize = 64 * effectiveScaleFactor;
  const darkZoneFontSize = 52 * effectiveScaleFactor;
  const legalFontSize = 8 * effectiveScaleFactor;
  const authFontSize = 25 * effectiveScaleFactor;

  return (
        <Link to={`/challenge/${Challenge?._id}`}>

    <div
      className="cyberpunk-card-wrapper"
      style={{
        display: "inline-block",
        transition: "transform 0.5s ease-out",
        transform: `scale(${hoverScale})`,
        transformOrigin: "center",
        cursor: "pointer",
        zIndex: isHovered ? 10 : 1,
        position: "relative",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        width={width}
        height={height}
        style={{ display: "block", margin: "auto" }}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Cyberpunk style ID card"
      >
        <defs>
          {/* Drop shadow filter for overlay */}
          <filter
            id="dropShadow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            colorInterpolationFilters="sRGB"
          >
            <feDropShadow
              dx="0"
              dy={8 * effectiveScaleFactor}
              stdDeviation={12 * effectiveScaleFactor}
              floodColor="rgba(0,0,0,0.4)"
              floodOpacity="1"
            />
          </filter>
          {/* Fonts: Techno & Glitch stencil-like using system fallback */}
          <style>
            {`
            .techno-font {
              font-family: 'Orbitron', 'Segoe UI Mono', 'Courier New', monospace;
              font-weight: 900;
              letter-spacing: ${2.5 * effectiveScaleFactor}px;
            }
            .glitch-font {
              font-family: 'VT323', monospace;
              font-weight: 900;
              letter-spacing: ${0.1 * effectiveScaleFactor}em;
            }
            .legal-text {
              font-family: 'Courier New', monospace;
            }
            `}
          </style>
        </defs>
        {/* Base bright red shape with tab */}
        <path
          d={`
    M${baseX + baseRadius},${baseY}
    h${(baseWidth - baseTabWidth) / 2 - baseRadius}
    a${baseRadius},${baseRadius} 0 0 1 ${baseRadius},${baseRadius}
    v${baseTabHeight}
    h${baseTabWidth}
    v${-baseTabHeight}
    a${baseRadius},${baseRadius} 0 0 1 ${baseRadius},-${baseRadius}
    h${(baseWidth - baseTabWidth) / 2 - baseRadius}
    a${baseRadius},${baseRadius} 0 0 1 ${baseRadius},${baseRadius}
    v${baseHeight - 2 * baseRadius}
    a${baseRadius},${baseRadius} 0 0 1 -${baseRadius},${baseRadius}
    h${-baseWidth + 2 * baseRadius}
    a${baseRadius},${baseRadius} 0 0 1 -${baseRadius},-${baseRadius}
    v${-baseHeight + 2 * baseRadius}
    a${baseRadius},${baseRadius} 0 0 1 ${baseRadius},-${baseRadius}
    Z
  `}
          fill={brightRed}
          style={{
            backdropFilter: "blur(8px) saturate(180%)",
            WebkitBackdropFilter: "blur(8px) saturate(180%)",
          }}
        ></path>

        {/* Overlay black rounded rectangle with shadow */}
        <rect
          x={overlayX}
          y={overlayY}
          width={overlayWidth}
          height={overlayHeight}
          rx={overlayRadius}
          ry={overlayRadius}
          fill={black}
          filter="url(#dropShadow)"
        />

        {/* Tech map silhouette (center-back, subtle) */}
        <g opacity={0.2}>
          <rect
            x={techMapX}
            y={techMapY + techMapHeight * 0.6}
            width={techMapWidth * 0.25}
            height={techMapHeight * 0.05}
            fill={darkGrayTechMap}
            rx={4 * effectiveScaleFactor}
            ry={4 * effectiveScaleFactor}
          />
          <rect
            x={techMapX + techMapWidth * 0.35}
            y={techMapY + techMapHeight * 0.4}
            width={techMapWidth * 0.6}
            height={techMapHeight * 0.1}
            fill={darkGrayTechMap}
            rx={6 * effectiveScaleFactor}
            ry={6 * effectiveScaleFactor}
          />
          <circle
            cx={techMapX + techMapWidth * 0.75}
            cy={techMapY + techMapHeight * 0.55}
            r={techMapHeight * 0.05}
            fill={darkGrayTechMap}
          />
          <line
            x1={techMapX + techMapWidth * 0.45}
            y1={techMapY + techMapHeight * 0.48}
            x2={techMapX + techMapWidth * 0.75}
            y2={techMapY + techMapHeight * 0.55}
            stroke={darkGrayTechMap}
            strokeWidth={techMapHeight * 0.01}
            strokeLinecap="round"
          />
          <line
            x1={techMapX + techMapWidth * 0.3}
            y1={techMapY + techMapHeight * 0.6}
            x2={techMapX + techMapWidth * 0.45}
            y2={techMapY + techMapHeight * 0.48}
            stroke={darkGrayTechMap}
            strokeWidth={techMapHeight * 0.01}
            strokeLinecap="round"
          />
        </g>

        {/* Top-left text group */}
        <g
          transform={`translate(${overlayX + 40 * effectiveScaleFactor}, ${
            overlayY + 80 * effectiveScaleFactor
          })`}
        >
          {/* "SECRET" white techno font */}
          <text
            className="techno-font "
            fill="#FFFFFF"
            fontSize={Math.min(
              secretFontSize,
              ((width - 210) / (Challenge?.title?.length || 1)) * 1.6
            )}
            fontWeight="900"
            textTransform="uppercase"
            letterSpacing={`${2.5 * effectiveScaleFactor}px`}
            y={5}
            x={0}
          >
            {(Challenge?.title || "").replace(/\n/g, " ").trim()}
          </text>
          text
          {/* Glitch-stencil font "DARK ZONE." uppercase */}
          <text
            className="glitch-font"
            fontWeight="900"
            letterSpacing={`${0.2 * effectiveScaleFactor}em`}
            x={0}
            y={105 * effectiveScaleFactor}
          >
            <tspan
              x={0}
              dy={0}
              fontSize={darkZoneFontSize}
              fill="#808080"
              textTransform="uppercase"
            >
              {(Challenge?.category || "").toUpperCase()}
            </tspan>
            {Challenge?.description
              ?.split(" ")
              .reduce(
                (lines, word) => {
                  const currentLine = lines[lines.length - 1];
                  const testLine = currentLine
                    ? `${currentLine} ${word}`
                    : word;
                  if (testLine.length > 20) {
                    lines.push(word);
                  } else {
                    lines[lines.length - 1] = testLine;
                  }
                  return lines;
                },
                [""]
              )
              .slice(0, 3)
              .map((line, i) => (
                <tspan
                  key={i}
                  x={20 * effectiveScaleFactor}
                  dy={darkZoneFontSize * 1.2}
                  fontSize={darkZoneFontSize * 0.75}
                  fill="#666666"
                >
                  {line}
                </tspan>
              ))}
          </text>
        </g>

        {/* Top-right: two red icons (polygon and rifle silhouette) */}
        <g
          transform={`translate(${
            overlayX +
            overlayWidth -
            40 * effectiveScaleFactor -
            80 * effectiveScaleFactor -
            12 * effectiveScaleFactor
          }, ${overlayY + 40 * effectiveScaleFactor})`}
        >
          {/* Abstract polygon icon */}
          <polygon
            points={`
              ${20 * effectiveScaleFactor},0 
              ${35 * effectiveScaleFactor},${10 * effectiveScaleFactor} 
              ${40 * effectiveScaleFactor},${30 * effectiveScaleFactor} 
              ${25 * effectiveScaleFactor},${40 * effectiveScaleFactor} 
              ${10 * effectiveScaleFactor},${30 * effectiveScaleFactor} 
              ${5 * effectiveScaleFactor},${10 * effectiveScaleFactor}
            `}
            fill={brightRed}
            stroke="#710000"
            strokeWidth={effectiveScaleFactor}
          />

          {/* Rifle silhouette (simple approximation) */}
          <g transform={`translate(${52 * effectiveScaleFactor},0)`}>
            <rect
              x="0"
              y={10 * effectiveScaleFactor}
              width={35 * effectiveScaleFactor}
              height={10 * effectiveScaleFactor}
              rx={2 * effectiveScaleFactor}
              ry={2 * effectiveScaleFactor}
              fill={brightRed}
            />
            <rect
              x={25 * effectiveScaleFactor}
              y={5 * effectiveScaleFactor}
              width={10 * effectiveScaleFactor}
              height={20 * effectiveScaleFactor}
              fill={brightRed}
            />
            <rect
              x={10 * effectiveScaleFactor}
              y={18 * effectiveScaleFactor}
              width={15 * effectiveScaleFactor}
              height={4 * effectiveScaleFactor}
              fill="#8B0000"
            />
            <polygon
              points={`
                ${35 * effectiveScaleFactor},${10 * effectiveScaleFactor} 
                ${45 * effectiveScaleFactor},0 
                ${40 * effectiveScaleFactor},0 
                ${42 * effectiveScaleFactor},${10 * effectiveScaleFactor}
              `}
              fill={brightRed}
            />
          </g>
        </g>

        {/* Right-center: vertical red barcode and microchip icon */}
        <g transform={`translate(${barcodeX}, ${barcodeY})`}>
          {/* Barcode vertical bars */}
          {Array.from({ length: barcodeBarsCount }).map((_, i) => {
            const barHeight = (6 + (i % 4) * 4) * effectiveScaleFactor;
            return (
              <rect
                key={i}
                x={i * (barcodeBarWidth + effectiveScaleFactor)}
                y={barcodeBarHeight - barHeight}
                width={barcodeBarWidth}
                height={barHeight}
                fill={brightRed}
              />
            );
          })}
        </g>

        <g
          transform={`translate(${
            width - 60 * effectiveScaleFactor - 40 * effectiveScaleFactor
          }, ${
            height -
            baseInset -
            80 * effectiveScaleFactor -
            32 * effectiveScaleFactor
          })`}
        >
          {/* Microchip icon: simplified with chip pins */}
          <rect
            width={40 * effectiveScaleFactor}
            height={32 * effectiveScaleFactor}
            rx={6 * effectiveScaleFactor}
            ry={6 * effectiveScaleFactor}
            fill={brightRed}
          />
          {/* Pins */}
          {[4, 12, 20, 28].map((y) => (
            <rect
              key={"pinL" + y}
              x={-6 * effectiveScaleFactor}
              y={y * effectiveScaleFactor}
              width={6 * effectiveScaleFactor}
              height={2 * effectiveScaleFactor}
              fill="#8B0000"
            />
          ))}
          {[4, 12, 20, 28].map((y) => (
            <rect
              key={"pinR" + y}
              x={40 * effectiveScaleFactor}
              y={y * effectiveScaleFactor}
              width={6 * effectiveScaleFactor}
              height={2 * effectiveScaleFactor}
              fill="#8B0000"
            />
          ))}
          {/* Inner circuits */}
          <rect
            x={8 * effectiveScaleFactor}
            y={8 * effectiveScaleFactor}
            width={24 * effectiveScaleFactor}
            height={16 * effectiveScaleFactor}
            rx={3 * effectiveScaleFactor}
            ry={3 * effectiveScaleFactor}
            fill="#AE1C1C"
          />
          {/* Cross in center */}
          <line
            x1={20 * effectiveScaleFactor}
            y1={12 * effectiveScaleFactor}
            x2={20 * effectiveScaleFactor}
            y2={24 * effectiveScaleFactor}
            stroke="#FFF"
            strokeWidth={effectiveScaleFactor}
          />
          <line
            x1={12 * effectiveScaleFactor}
            y1={18 * effectiveScaleFactor}
            x2={28 * effectiveScaleFactor}
            y2={18 * effectiveScaleFactor}
            stroke="#FFF"
            strokeWidth={effectiveScaleFactor}
          />
        </g>

        {/* Bottom-left fine print white monospace legal text */}
        <text
          className="legal-text"
          x={overlayX + 40 * effectiveScaleFactor}
          y={height - baseInset - 48 * effectiveScaleFactor}
          fill="white"
          fontSize={legalFontSize}
          opacity={0.6}
          letterSpacing={0.4 * effectiveScaleFactor}
          style={{ whiteSpace: "pre-wrap", width: 280 * effectiveScaleFactor }}
        >
          {legalText}
        </text>

        {/* Left edge: vertical gray AUTHORIZATION rotated -90°, offset 8px outside card */}
        <text
          x={overlayX - 8 * effectiveScaleFactor}
          y={overlayY + overlayHeight / 2}
          fill={mediumGray}
          fontSize={authFontSize}
          fontWeight="700"
          textTransform="uppercase"
          style={{ userSelect: "none" }}
          transform={`rotate(-90 ${overlayX - 8 * effectiveScaleFactor} ${
            overlayY + overlayHeight / 2
          })`}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {authorizationText}
        </text>

        {/* Ghosted glitch lines */}
        <rect
          x={glitchLine1.x}
          y={glitchLine1.y}
          width={glitchLine1.width}
          height={glitchLine1.height}
          fill="#FFF"
          opacity={glitchLine1.opacity}
          transform={`rotate(${glitchLine1.rotate} ${glitchLine1.x} ${glitchLine1.y})`}
          rx={2 * effectiveScaleFactor}
          ry={2 * effectiveScaleFactor}
        />
        <rect
          x={glitchLine2.x}
          y={glitchLine2.y}
          width={glitchLine2.width}
          height={glitchLine2.height}
          fill="#FFF"
          opacity={glitchLine2.opacity}
          transform={`rotate(${glitchLine2.rotate} ${glitchLine2.x} ${glitchLine2.y})`}
          rx={1.5 * effectiveScaleFactor}
          ry={1.5 * effectiveScaleFactor}
        />
      </svg>
      <span
        style={{
          position: "absolute",
          bottom: "69px",
          right: "45px",
          color: "white",
          fontSize: `${40 * effectiveScaleFactor}px`,
          fontWeight: "bold",
          pointerEvents: "none",
          transform: isHovered ? `scale(${1.05})` : "scale(1)",
          transition: "transform 0.3s ease, font-size 0.3s ease",
        }}
      >
        {Challenge?.score || "-"}
      </span>
    </div></Link>
  );
};

export default ChallengeCardSkeleton;