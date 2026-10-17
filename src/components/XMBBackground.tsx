import { useEffect, useRef } from 'react';
import { hexToRgb } from '../theme';

const VERTEX_SHADER = `
attribute vec2 aVertexPosition;
void main() {
  gl_Position = vec4(aVertexPosition, 0.0, 1.0);
}
`;

// XMB ribbon waves, based on fchavonet/creative_coding-xmb_wave_background.
// Tinted with the current XMB month colour over a deep gradient.
const FRAGMENT_SHADER = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uAccent;

const float waveWidthFactor = 1.5;

float calcSine(vec2 uv, float speed, float frequency, float amplitude, float phaseShift, float verticalOffset, float lineWidth, float sharpness, bool invertFalloff) {
  float angle = uTime * speed * frequency * -1.0 + (phaseShift + uv.x) * 2.0;
  float waveY = sin(angle) * amplitude + verticalOffset;
  float deltaY = waveY - uv.y;
  float distanceVal = distance(waveY, uv.y);
  if (invertFalloff) {
    if (deltaY > 0.0) distanceVal *= 4.0;
  } else {
    if (deltaY < 0.0) distanceVal *= 4.0;
  }
  float smoothVal = smoothstep(lineWidth * waveWidthFactor, 0.0, distanceVal);
  return pow(smoothVal, sharpness);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  float w = 0.0;
  w += calcSine(uv, 0.2, 0.20, 0.2,  0.0, 0.55, 0.1,  15.0, false) * 0.3;
  w += calcSine(uv, 0.4, 0.40, 0.15, 0.0, 0.55, 0.1,  17.0, false) * 0.3;
  w += calcSine(uv, 0.3, 0.60, 0.15, 0.0, 0.55, 0.05, 23.0, false) * 0.3;
  w += calcSine(uv, 0.1, 0.26, 0.07, 0.0, 0.35, 0.1,  17.0, true) * 0.3;
  w += calcSine(uv, 0.3, 0.36, 0.07, 0.0, 0.35, 0.1,  17.0, true) * 0.3;
  w += calcSine(uv, 0.5, 0.46, 0.07, 0.0, 0.35, 0.05, 23.0, true) * 0.3;
  w += calcSine(uv, 0.2, 0.58, 0.05, 0.0, 0.35, 0.2,  15.0, true) * 0.3;

  // Deep base: accent glow from the top-left, near-black elsewhere
  vec3 base = vec3(0.012, 0.018, 0.035);
  float glow = smoothstep(1.25, 0.0, distance(uv, vec2(0.15, 1.05)));
  float glow2 = smoothstep(1.1, 0.0, distance(uv, vec2(0.95, 0.0)));
  vec3 col = base + uAccent * glow * 0.22 + uAccent * glow2 * 0.08;

  vec3 ribbon = mix(uAccent, vec3(1.0), 0.55);
  col += ribbon * w * 0.75;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compileShader(gl: WebGLRenderingContext, source: string, type: number): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function XMBBackground({ accent }: { accent: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const accentRef = useRef(accent);
  accentRef.current = accent;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return;

    const vs = compileShader(gl, VERTEX_SHADER, gl.VERTEX_SHADER);
    const fs = compileShader(gl, FRAGMENT_SHADER, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Link error:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const posLoc = gl.getAttribLocation(program, 'aVertexPosition');
    const timeLoc = gl.getUniformLocation(program, 'uTime');
    const resLoc = gl.getUniformLocation(program, 'uResolution');
    const accLoc = gl.getUniformLocation(program, 'uAccent');

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Render at reduced resolution — the waves are soft, nobody can tell.
    const scale = 0.6;
    function resize() {
      canvas!.width = Math.max(1, Math.floor(window.innerWidth * scale));
      canvas!.height = Math.max(1, Math.floor(window.innerHeight * scale));
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }
    resize();
    window.addEventListener('resize', resize);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const start = performance.now() - 20000;

    function draw(t: number) {
      const [r, g, b] = hexToRgb(accentRef.current);
      gl!.uniform3f(accLoc, r / 255, g / 255, b / 255);
      gl!.uniform1f(timeLoc, (t - start) * 0.001);
      gl!.uniform2f(resLoc, canvas!.width, canvas!.height);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    }

    function loop(t: number) {
      draw(t);
      raf = requestAnimationFrame(loop);
    }

    function onVis() {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) raf = requestAnimationFrame(loop);
    }

    if (reduced) draw(performance.now());
    else raf = requestAnimationFrame(loop);
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* vignette */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 50% 30%, transparent 40%, rgb(2 3 6 / 0.75) 100%)' }} />
    </div>
  );
}
