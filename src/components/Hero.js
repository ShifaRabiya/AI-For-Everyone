import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './Hero.css';
import Title from './Title';
import NavBar from './Nav';

const MAX_COLORS = 8;

const frag = `
#define MAX_COLORS ${MAX_COLORS}
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer; // in NDC [-1,1]
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  vec2 toward = (uPointer - rp);
  q += toward * uMouseInfluence * 0.2;

    vec3 col = vec3(0.0);
    float a = 1.0;

    if (uColorCount > 0) {
      vec2 s = q;
      vec3 sumCol = vec3(0.0);
      float cover = 0.0;
      for (int i = 0; i < MAX_COLORS; ++i) {
            if (i >= uColorCount) break;
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3); // strong response across 0..1
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0); // allow >1 to amplify displacement
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float m = mix(m0, m1, kMix);
            float w = 1.0 - exp(-6.0 / exp(6.0 * m));
            sumCol += uColors[i] * w;
            cover = max(cover, w);
      }
      col = clamp(sumCol, 0.0, 1.0);
      a = uTransparent > 0 ? cover : 1.0;
    } else {
        vec2 s = q;
        for (int k = 0; k < 3; ++k) {
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3);
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float m = mix(m0, m1, kMix);
            col[k] = 1.0 - exp(-6.0 / exp(6.0 * m));
        }
        a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;
    }

    if (uNoise > 0.0001) {
      float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
      col += (n - 0.5) * uNoise;
      col = clamp(col, 0.0, 1.0);
    }

    vec3 rgb = (uTransparent > 0) ? col * a : col;
    gl_FragColor = vec4(rgb, a);
}
`;

const vert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

export default function ColorBends({
  className,
  style,
  rotation = 45,
  speed = 0.2,
  colors = [],
  transparent = true,
  autoRotate = 0,
  scale = 1,
  frequency = 1,
  warpStrength = 1,
  mouseInfluence = 1,
  parallax = 0.5,
  noise = 0.1
}) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const rafRef = useRef(null);
  const materialRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const rotationRef = useRef(rotation);
  const autoRotateRef = useRef(autoRotate);
  const pointerTargetRef = useRef(new THREE.Vector2(0, 0));
  const pointerCurrentRef = useRef(new THREE.Vector2(0, 0));
  const pointerSmoothRef = useRef(8);

  useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const geometry = new THREE.PlaneGeometry(2, 2);
  const uColorsArray = Array.from({ length: MAX_COLORS }, () => new THREE.Vector3(0, 0, 0));
  const material = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: {
      uCanvas: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uRot: { value: new THREE.Vector2(1, 0) },
      uColorCount: { value: 0 },
      uColors: { value: uColorsArray },
      uTransparent: { value: transparent ? 1 : 0 },
      uScale: { value: scale },
      uFrequency: { value: frequency },
      uWarpStrength: { value: warpStrength },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uMouseInfluence: { value: mouseInfluence },
      uParallax: { value: parallax },
      uNoise: { value: noise }
    },
    premultipliedAlpha: true,
    transparent: true
  });
  materialRef.current = material;

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: 'high-performance',
    alpha: true
  });
  rendererRef.current = renderer;
  // modern color space handling (three r125+)
  if (renderer.outputColorSpace) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  } else if (renderer.gammaFactor !== undefined) {
    renderer.gammaFactor = 2.2;
    renderer.gammaOutput = true;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, transparent ? 0 : 1);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  container.appendChild(renderer.domElement);

  const clock = new THREE.Clock();

  // store last size to avoid spurious calls (prevents ResizeObserver loops)
  let lastW = 0;
  let lastH = 0;
  let resizeRaf = null;

  const handleResize = () => {
    try {
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);

      // if unchanged, skip to avoid ResizeObserver loop issues
      if (w === lastW && h === lastH) return;
      lastW = w;
      lastH = h;

      // ensure renderer size uses devicePixelRatio if desired
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      if (material && material.uniforms && material.uniforms.uCanvas) {
        material.uniforms.uCanvas.value.set(w, h);
      }
    } catch (err) {
      // swallow occasional errors during mount/unmount
      // eslint-disable-next-line no-console
      console.warn("handleResize skipped:", err);
    }
  };

  // call once immediately to size canvas (critical)
  handleResize();

  // ResizeObserver with rAF debounce to avoid the "loop limit exceeded" warning
  let ro = null;
  if ('ResizeObserver' in window) {
    ro = new ResizeObserver((entries) => {
      // only schedule a single rAF for multiple entries
      if (resizeRaf !== null) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        handleResize();
        resizeRaf = null;
      });
    });
    ro.observe(container);
    resizeObserverRef.current = ro;
  } else {
    // fallback
    const onWinResize = () => {
      if (resizeRaf !== null) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        handleResize();
        resizeRaf = null;
      });
    };
    window.addEventListener('resize', onWinResize);
    resizeObserverRef.current = {
      disconnect: () => window.removeEventListener('resize', onWinResize)
    };
  }

  // animation loop
  const loop = () => {
    const dt = clock.getDelta();
    const elapsed = clock.elapsedTime;
    if (material && material.uniforms) {
      material.uniforms.uTime.value = elapsed;

      const deg = (rotationRef.current % 360) + autoRotateRef.current * elapsed;
      const rad = (deg * Math.PI) / 180;
      const c = Math.cos(rad);
      const s = Math.sin(rad);
      material.uniforms.uRot.value.set(c, s);

      const cur = pointerCurrentRef.current;
      const tgt = pointerTargetRef.current;
      const amt = Math.min(1, dt * pointerSmoothRef.current);
      cur.lerp(tgt, amt);
      material.uniforms.uPointer.value.copy(cur);
    }

    renderer.render(scene, camera);
    rafRef.current = requestAnimationFrame(loop);
  };

  // start
  rafRef.current = requestAnimationFrame(loop);

  // cleanup
  return () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (resizeRaf !== null) {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = null;
    }
    if (resizeObserverRef.current && resizeObserverRef.current.disconnect) {
      try {
        resizeObserverRef.current.disconnect();
      } catch (e) { /* ignore */ }
      resizeObserverRef.current = null;
    }
    geometry.dispose();
    if (material) material.dispose();
    if (renderer) {
      try {
        renderer.dispose();
      } catch (e) { /* ignore */ }
      if (renderer.domElement && renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [frequency, mouseInfluence, noise, parallax, scale, speed, transparent, warpStrength]);

  useEffect(() => {
    const material = materialRef.current;
    const renderer = rendererRef.current;
    if (!material) return;

    rotationRef.current = rotation;
    autoRotateRef.current = autoRotate;
    material.uniforms.uSpeed.value = speed;
    material.uniforms.uScale.value = scale;
    material.uniforms.uFrequency.value = frequency;
    material.uniforms.uWarpStrength.value = warpStrength;
    material.uniforms.uMouseInfluence.value = mouseInfluence;
    material.uniforms.uParallax.value = parallax;
    material.uniforms.uNoise.value = noise;

    const toVec3 = hex => {
      const h = hex.replace('#', '').trim();
      const v =
        h.length === 3
          ? [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)]
          : [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
      return new THREE.Vector3(v[0] / 255, v[1] / 255, v[2] / 255);
    };

    const techColors = [
      '#3d0070', // deep purple
      '#008080', // teal
      '#4b0082', // indigo
      '#104e8b', // darker blue
      '#550055', // magenta variant
      '#4f0253ff'  // royal blue
    ];

    // convert hex to THREE.Vector3
    const arr = techColors.slice(0, MAX_COLORS).map(toVec3);

    for (let i = 0; i < MAX_COLORS; i++) {
      const vec = material.uniforms.uColors.value[i];
      if (i < arr.length) vec.copy(arr[i]);
      else vec.set(0, 0, 0);
    }
    material.uniforms.uColorCount.value = arr.length;
    if (renderer) renderer.setClearColor(0x000000, transparent ? 0 : 1);
  }, [
    rotation,
    autoRotate,
    speed,
    scale,
    frequency,
    warpStrength,
    mouseInfluence,
    parallax,
    noise,
    colors,
    transparent
  ]);

  useEffect(() => {
    const material = materialRef.current;
    const container = containerRef.current;
    if (!material || !container) return;

    const handlePointerMove = e => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
      const y = -(((e.clientY - rect.top) / (rect.height || 1)) * 2 - 1);
      pointerTargetRef.current.set(x, y);
    };

    container.addEventListener('pointermove', handlePointerMove);
    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return(
    <div id='home'>
      <NavBar />
      <div ref={containerRef} className={`color-bends-container ${className}`} style={style} >
        {/* Hero overlay */}
        <div className="hero-overlay">
          <Title
            text="AI for Everyone"
            className="hero-blur-text"
            delay={100}
            animateBy="words"
            direction="top"
          />
          <p className="hero-subtitle">An Initiative by <span className='tinker' onClick={() => window.open("https://share.google/1WIS6x1dDNvg8x8UQ", "_blank")}>TinkerHub</span></p>
        </div>
      </div>
     </div> 
  ) 
}
