import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function RainbowPrismWave() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
        float d = length(p) * (distortion * 2.5);

        float rx = p.x * (1.0 + d * 1.5);
        float gx = p.x;
        float bx = p.x * (1.0 - d * 1.5);

        float ry = p.y + sin((rx + time) * xScale) * yScale;
        float gy = p.y + sin((gx + time) * xScale) * yScale;
        float by = p.y + sin((bx + time) * xScale) * yScale;

        float r = 0.10 / max(abs(ry), 0.001);
        float g = 0.10 / max(abs(gy), 0.001);
        float b = 0.10 / max(abs(by), 0.001);

        float cy = p.y + sin((p.x + time) * xScale) * yScale;
        float core = 0.035 / max(abs(cy), 0.001);
        core = pow(core, 1.35);

        vec3 color = vec3(r + core, g + core, b + core);
        color = clamp(color, 0.0, 3.5);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const scene = new THREE.Scene();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      time: { value: 0.0 },
      xScale: { value: 0.55 },
      yScale: { value: 0.35 },
      distortion: { value: 0.095 },
    };

    const position = [
      -1.0, -1.0, 0.0,
       1.0, -1.0, 0.0,
      -1.0,  1.0, 0.0,
       1.0, -1.0, 0.0,
      -1.0,  1.0, 0.0,
       1.0,  1.0, 0.0,
    ];

    const positions = new THREE.BufferAttribute(new Float32Array(position), 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', positions);

    const material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: THREE.DoubleSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      uniforms.resolution.value.set(width, height);
    };

    window.addEventListener('resize', onResize);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationFrameId = 0;

    const animate = () => {
      uniforms.time.value += 0.007;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    if (reducedMotion) {
      renderer.render(scene, camera);
    } else {
      animate();
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-35 mix-blend-screen"
      aria-hidden="true"
    />
  );
}
