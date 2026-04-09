import { useEffect, useRef } from 'react';

const VERTEX_SHADER = `
attribute vec2 aVertexPosition;
void main() {
  gl_Position = vec4(aVertexPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;

const float waveWidthFactor = 1.5;

vec3 calcSine(
  vec2 uv,
  float speed,
  float frequency,
  float amplitude,
  float phaseShift,
  float verticalOffset,
  vec3 baseColor,
  float lineWidth,
  float sharpness,
  bool invertFalloff
) {
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
  float scaleVal = pow(smoothVal, sharpness);

  return min(baseColor * scaleVal, baseColor);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  vec3 acc = vec3(0.0);
  acc += calcSine(uv, 0.2, 0.20, 0.2,  0.0, 0.5, vec3(0.3), 0.1,  15.0, false);
  acc += calcSine(uv, 0.4, 0.40, 0.15, 0.0, 0.5, vec3(0.3), 0.1,  17.0, false);
  acc += calcSine(uv, 0.3, 0.60, 0.15, 0.0, 0.5, vec3(0.3), 0.05, 23.0, false);
  acc += calcSine(uv, 0.1, 0.26, 0.07, 0.0, 0.3, vec3(0.3), 0.1,  17.0, true);
  acc += calcSine(uv, 0.3, 0.36, 0.07, 0.0, 0.3, vec3(0.3), 0.1,  17.0, true);
  acc += calcSine(uv, 0.5, 0.46, 0.07, 0.0, 0.3, vec3(0.3), 0.05, 23.0, true);
  acc += calcSine(uv, 0.2, 0.58, 0.05, 0.0, 0.3, vec3(0.3), 0.2,  15.0, true);

  float maxCh = max(acc.r, max(acc.g, acc.b));
  if (maxCh <= 0.0) discard;

  gl_FragColor = vec4(acc, 1.0);
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

export function XMBBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
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

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }

    resize();
    window.addEventListener('resize', resize);

    function render(timeMs: number) {
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.uniform1f(timeLoc, timeMs * 0.001);
      gl!.uniform2f(resLoc, canvas!.width, canvas!.height);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 w-full h-full"
    />
  );
}
