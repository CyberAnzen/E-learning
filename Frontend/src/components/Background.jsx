import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef, useMemo, useCallback, useState } from "react";

// Simplified vertex shader
const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// Optimized fragment shader with reduced complexity
const fragmentShader = `
precision mediump float;

varying vec2 vUv;

uniform float iTime;
uniform vec3 iResolution;
uniform float uScale;
uniform vec2 uGridMul;
uniform float uDigitSize;
uniform float uScanlineIntensity;
uniform vec3 uTint;
uniform float uBrightness;

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 p) {
  return sin(p.x * 10.0) * sin(p.y * (3.0 + sin(iTime * 0.09)));
}

mat2 rotate(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

float fbm(vec2 p) {
  p *= 1.1;
  float f = 0.0;
  float amp = 0.5;
  
  f += amp * noise(p);
  p = rotate(iTime * 0.02) * p * 2.0;
  amp *= 0.5;
  
  f += amp * noise(p);
  p = rotate(iTime * 0.02) * p * 2.0;
  amp *= 0.5;
  
  f += amp * noise(p);
  return f;
}

float pattern(vec2 p) {
  vec2 q = vec2(fbm(p + vec2(1.0)), fbm(rotate(0.1 * iTime) * p + vec2(1.0)));
  vec2 r = vec2(fbm(rotate(0.1) * q), fbm(q));
  return fbm(p + r);
}

float digit(vec2 p) {
  vec2 grid = uGridMul * 15.0;
  vec2 s = floor(p * grid) / grid;
  p = p * grid;
  
  float intensity = pattern(s * 0.1) * 1.3 - 0.03;
  
  p = fract(p);
  p *= uDigitSize;
  
  float px5 = p.x * 5.0;
  float py5 = (1.0 - p.y) * 5.0;
  float x = fract(px5);
  float y = fract(py5);
  
  float i = floor(py5) - 2.0;
  float j = floor(px5) - 2.0;
  float n = i * i + j * j;
  float f = n * 0.0625;
  
  float isOn = step(0.1, intensity - f);
  float brightness = isOn * (0.2 + y * 0.8) * (0.75 + x * 0.25);
  
  return step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0) * brightness;
}

vec3 getColor(vec2 p) {
  float bar = step(mod(p.y + iTime * 20.0, 1.0), 0.2) * 0.4 + 1.0;
  bar *= uScanlineIntensity;
  
  float middle = digit(p);
  
  const float off = 0.002;
  float sum = digit(p + vec2(-off, -off)) + digit(p + vec2(0.0, -off)) + 
              digit(p + vec2(-off, 0.0)) + digit(p + vec2(0.0, 0.0));
  
  vec3 baseColor = vec3(0.9) * middle + sum * 0.1 * vec3(1.0) * bar;
  return baseColor;
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv * uScale;
  vec3 col = getColor(p);
  
  col *= uTint;
  col *= uBrightness;
  
  // Simple dithering
  float rnd = hash21(gl_FragCoord.xy);
  col += (rnd - 0.5) * 0.01;
  
  gl_FragColor = vec4(col, 1.0);
}
`;

function hexToRgb(hex) {
  let h = hex.replace("#", "").trim();
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const num = parseInt(h, 16);
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  ];
}

export default function FaultyTerminal({
  scale = 1,
  gridMul = [2, 1],
  digitSize = 1.5,
  timeScale = 0.3,
  pause = false,
  scanlineIntensity = 0.3,
  tint = "#ffffff",
  brightness = 1,
  maxFps = 20, // Lower default FPS for low-end devices
  adaptiveQuality = true, // Enable adaptive quality for low-end devices
  className,
  style,
  ...rest
}) {
  const containerRef = useRef(null);
  const programRef = useRef(null);
  const rendererRef = useRef(null);
  const meshRef = useRef(null);
  const glRef = useRef(null);

  const frozenTimeRef = useRef(0);
  const rafRef = useRef(0);
  const timeOffsetRef = useRef(Math.random() * 100);
  const visibleRef = useRef(true);
  const lastFrameTimeRef = useRef(0);

  const tintVec = useMemo(() => hexToRgb(tint), [tint]);

  const gridMulArrayRef = useRef(new Float32Array(2));
  gridMulArrayRef.current[0] = gridMul[0];
  gridMulArrayRef.current[1] = gridMul[1];

  const resolutionColorRef = useRef(null);
  const tintColorRef = useRef(null);

  const [internalDpr, setInternalDpr] = useState(() => {
    const defaultDpr = Math.min(
      window.devicePixelRatio || 1,
      adaptiveQuality ? 1 : 2
    );
    return defaultDpr;
  });

  const computeEffectiveDpr = useCallback(() => {
    let base = Math.min(window.devicePixelRatio || 1, 2);

    // Adaptive quality adjustments for low-end devices
    if (adaptiveQuality) {
      const saveData = navigator.connection?.saveData;
      const hw = navigator.hardwareConcurrency || 4;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (saveData || reduced || hw <= 2) {
        base = Math.min(base, 1);
      }
    }

    return base;
  }, [adaptiveQuality]);

  useEffect(() => {
    const update = () => setInternalDpr(computeEffectiveDpr());
    update();

    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [computeEffectiveDpr]);

  useEffect(() => {
    const ctn = containerRef.current;
    if (!ctn) return;

    const renderer = new Renderer({
      dpr: internalDpr,
      powerPreference: adaptiveQuality ? "low-power" : "high-performance",
    });

    rendererRef.current = renderer;
    const gl = renderer.gl;
    glRef.current = gl;
    gl.clearColor(0, 0, 0, 1);

    resolutionColorRef.current = new Color(1, 1, 1);
    tintColorRef.current = new Color(tintVec[0], tintVec[1], tintVec[2]);

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: resolutionColorRef.current },
        uScale: { value: scale },
        uGridMul: { value: gridMulArrayRef.current },
        uDigitSize: { value: digitSize },
        uScanlineIntensity: { value: scanlineIntensity },
        uTint: { value: tintColorRef.current },
        uBrightness: { value: brightness },
      },
    });

    programRef.current = program;

    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    let rafResize = 0;
    function doResize() {
      if (!ctn || !renderer) return;
      const w = ctn.offsetWidth;
      const h = ctn.offsetHeight;

      renderer.setSize(w, h);
      resolutionColorRef.current.set(
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height
      );
    }

    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(rafResize);
      rafResize = requestAnimationFrame(doResize);
    });

    resizeObserver.observe(ctn);
    doResize();

    let io;
    try {
      io = new IntersectionObserver(
        (entries) => {
          visibleRef.current = entries[0].isIntersecting;
        },
        { threshold: 0.01 }
      );
      io.observe(ctn);
    } catch (err) {}

    const uniforms = program.uniforms;

    const update = (t) => {
      rafRef.current = requestAnimationFrame(update);

      // Frame limiting for performance
      const now = performance.now();
      const elapsedSinceLastFrame = now - lastFrameTimeRef.current;
      const minFrameTime = 1000 / maxFps;

      if (elapsedSinceLastFrame < minFrameTime && !pause) {
        return;
      }

      lastFrameTimeRef.current = now;

      if (!pause) {
        const elapsed = (t * 0.001 + timeOffsetRef.current) * timeScale;
        uniforms.iTime.value = elapsed;
        frozenTimeRef.current = elapsed;
      } else {
        uniforms.iTime.value = frozenTimeRef.current;
      }

      if (visibleRef.current !== false) {
        renderer.render({ scene: mesh });
      }
    };

    rafRef.current = requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
      } else {
        rafRef.current = requestAnimationFrame(update);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      if (io) io.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);

      if (gl.canvas.parentElement === ctn) {
        ctn.removeChild(gl.canvas);
      }

      gl.getExtension("WEBGL_lose_context")?.loseContext();
      timeOffsetRef.current = Math.random() * 100;
    };
  }, [internalDpr, maxFps, timeScale, pause, adaptiveQuality]);

  useEffect(() => {
    const p = programRef.current;
    if (!p) return;
    p.uniforms.uScale.value = scale;
  }, [scale]);

  useEffect(() => {
    const arr = gridMulArrayRef.current;
    arr[0] = gridMul[0];
    arr[1] = gridMul[1];
  }, [gridMul]);

  useEffect(() => {
    const p = programRef.current;
    if (!p) return;
    p.uniforms.uDigitSize.value = digitSize;
    p.uniforms.uScanlineIntensity.value = scanlineIntensity;
    p.uniforms.uBrightness.value = brightness;
  }, [digitSize, scanlineIntensity, brightness]);

  useEffect(() => {
    const p = programRef.current;
    if (!p || !tintColorRef.current) return;
    tintColorRef.current.set(tintVec[0], tintVec[1], tintVec[2]);
  }, [tintVec]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden ${className}`}
      style={{
        touchAction: "none",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
      {...rest}
    />
  );
}
