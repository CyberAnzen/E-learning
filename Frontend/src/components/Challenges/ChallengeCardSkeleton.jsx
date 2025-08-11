import React, { useState } from "react";

const ChallengeCardSkeleton = ({
  scaleFactor = 1,
  redColor = "#E5E5E5", // Gray color for skeleton
}) => {
  const [isHovered, setIsHovered] = useState(false);

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

  // Colors - All grays for skeleton
  const brightGray = isHovered ? "rgba(200,200,200,0.8)" : "#E5E5E5";
  const darkGray = "#2A2A2A";
  const mediumGray = "#9E9E9E";
  const lightGray = "#F5F5F5";

  // Barcode bars generation (vertical gray barcode)
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
    opacity: 0.1,
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
    opacity: 0.05,
    x: width / 2 - (160 * effectiveScaleFactor) / 2,
    y:
      height - baseInset - 48 * effectiveScaleFactor - 3 * effectiveScaleFactor,
  };

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
    <div
      className="cyberpunk-card-skeleton-wrapper animate-pulse"
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
        aria-label="Loading cyberpunk style ID card"
      >
        <defs>
          {/* Drop shadow filter for overlay */}
          <filter
            id="dropShadowSkeleton"
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
              floodColor="rgba(0,0,0,0.2)"
              floodOpacity="1"
            />
          </filter>

          {/* Skeleton shimmer animation */}
          <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F3F4F6" stopOpacity="1" />
            <stop offset="50%" stopColor="#E5E7EB" stopOpacity="1" />
            <stop offset="100%" stopColor="#F3F4F6" stopOpacity="1" />
            <animateTransform
              attributeName="gradientTransform"
              attributeType="XML"
              values="translateX(-100%);translateX(100%);translateX(-100%)"
              dur="2s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>

        {/* Base gray shape with tab */}
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
          fill={brightGray}
        />

        {/* Overlay dark gray rounded rectangle with shadow */}
        <rect
          x={overlayX}
          y={overlayY}
          width={overlayWidth}
          height={overlayHeight}
          rx={overlayRadius}
          ry={overlayRadius}
          fill={darkGray}
          filter="url(#dropShadowSkeleton)"
        />

        {/* Tech map silhouette (center-back, subtle) */}
        <g opacity={0.1}>
          <rect
            x={techMapX}
            y={techMapY + techMapHeight * 0.6}
            width={techMapWidth * 0.25}
            height={techMapHeight * 0.05}
            fill={mediumGray}
            rx={4 * effectiveScaleFactor}
            ry={4 * effectiveScaleFactor}
          />
          <rect
            x={techMapX + techMapWidth * 0.35}
            y={techMapY + techMapHeight * 0.4}
            width={techMapWidth * 0.6}
            height={techMapHeight * 0.1}
            fill={mediumGray}
            rx={6 * effectiveScaleFactor}
            ry={6 * effectiveScaleFactor}
          />
          <circle
            cx={techMapX + techMapWidth * 0.75}
            cy={techMapY + techMapHeight * 0.55}
            r={techMapHeight * 0.05}
            fill={mediumGray}
          />
        </g>

        {/* Top-left text placeholders */}
        <g
          transform={`translate(${overlayX + 40 * effectiveScaleFactor}, ${
            overlayY + 80 * effectiveScaleFactor
          })`}
        >
          {/* Title placeholder - animated shimmer rectangle */}
          <rect
            x={0}
            y={-20 * effectiveScaleFactor}
            width={400 * effectiveScaleFactor}
            height={secretFontSize * 0.8}
            rx={8 * effectiveScaleFactor}
            fill="url(#shimmer)"
          />

          {/* Category placeholder */}
          <rect
            x={0}
            y={60 * effectiveScaleFactor}
            width={200 * effectiveScaleFactor}
            height={darkZoneFontSize * 0.6}
            rx={6 * effectiveScaleFactor}
            fill="#666666"
          />

          {/* Description placeholders - multiple lines */}
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={20 * effectiveScaleFactor}
              y={(120 + i * 50) * effectiveScaleFactor}
              width={Math.max(150, 300 - i * 50) * effectiveScaleFactor}
              height={darkZoneFontSize * 0.5}
              rx={4 * effectiveScaleFactor}
              fill="#555555"
            />
          ))}
        </g>

        {/* Top-right: skeleton icons */}
        <g
          transform={`translate(${
            overlayX +
            overlayWidth -
            40 * effectiveScaleFactor -
            80 * effectiveScaleFactor -
            12 * effectiveScaleFactor
          }, ${overlayY + 40 * effectiveScaleFactor})`}
        >
          {/* Abstract shape placeholder */}
          <rect
            x={5 * effectiveScaleFactor}
            y={0}
            width={40 * effectiveScaleFactor}
            height={40 * effectiveScaleFactor}
            rx={8 * effectiveScaleFactor}
            fill={mediumGray}
          />

          {/* Second icon placeholder */}
          <rect
            x={52 * effectiveScaleFactor}
            y={5 * effectiveScaleFactor}
            width={45 * effectiveScaleFactor}
            height={25 * effectiveScaleFactor}
            rx={4 * effectiveScaleFactor}
            fill={mediumGray}
          />
        </g>

        {/* Right-center: skeleton barcode */}
        <g transform={`translate(${barcodeX}, ${barcodeY})`}>
          {Array.from({ length: barcodeBarsCount }).map((_, i) => {
            const barHeight = (6 + (i % 4) * 4) * effectiveScaleFactor;
            return (
              <rect
                key={i}
                x={i * (barcodeBarWidth + effectiveScaleFactor)}
                y={barcodeBarHeight - barHeight}
                width={barcodeBarWidth}
                height={barHeight}
                fill={mediumGray}
              />
            );
          })}
        </g>

        {/* Skeleton microchip */}
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
          <rect
            width={40 * effectiveScaleFactor}
            height={32 * effectiveScaleFactor}
            rx={6 * effectiveScaleFactor}
            ry={6 * effectiveScaleFactor}
            fill={mediumGray}
          />
        </g>

        {/* Bottom-left legal text placeholder */}
        <rect
          x={overlayX + 40 * effectiveScaleFactor}
          y={height - baseInset - 60 * effectiveScaleFactor}
          width={280 * effectiveScaleFactor}
          height={12 * effectiveScaleFactor}
          rx={2 * effectiveScaleFactor}
          fill="#444444"
          opacity={0.6}
        />

        {/* Left edge: vertical authorization text placeholder */}
        <rect
          x={overlayX - 15 * effectiveScaleFactor}
          y={overlayY + overlayHeight / 2 - 60 * effectiveScaleFactor}
          width={authFontSize * 0.8}
          height={120 * effectiveScaleFactor}
          rx={4 * effectiveScaleFactor}
          fill={mediumGray}
          opacity={0.7}
        />

        {/* Ghosted glitch lines - much more subtle */}
        <rect
          x={glitchLine1.x}
          y={glitchLine1.y}
          width={glitchLine1.width}
          height={glitchLine1.height}
          fill="#AAA"
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
          fill="#AAA"
          opacity={glitchLine2.opacity}
          transform={`rotate(${glitchLine2.rotate} ${glitchLine2.x} ${glitchLine2.y})`}
          rx={1.5 * effectiveScaleFactor}
          ry={1.5 * effectiveScaleFactor}
        />
      </svg>

      {/* Score placeholder */}
      <div
        style={{
          position: "absolute",
          bottom: "69px",
          right: "45px",
          width: `${60 * effectiveScaleFactor}px`,
          height: `${40 * effectiveScaleFactor}px`,
          backgroundColor: "#666666",
          borderRadius: `${8 * effectiveScaleFactor}px`,
          pointerEvents: "none",
          transform: isHovered ? `scale(${1.05})` : "scale(1)",
          transition: "transform 0.3s ease",
        }}
      />
    </div>
  );
};

export default ChallengeCardSkeleton;
