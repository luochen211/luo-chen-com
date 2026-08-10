import { useEffect, useRef } from 'react'

const vertexShader = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const fragmentShader = `
  precision highp float;

  uniform vec2 resolution;
  uniform vec2 pointer;
  uniform float time;
  uniform float pressure;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 turn = mat2(0.80, -0.60, 0.60, 0.80);
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = turn * p * 2.04 + 11.7;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 centered = uv - 0.5;
    centered.x *= resolution.x / resolution.y;

    vec2 mouse = pointer - 0.5;
    mouse.x *= resolution.x / resolution.y;
    vec2 delta = centered - mouse;
    float distanceToPointer = length(delta);
    float influence = exp(-distanceToPointer * 5.5) * pressure;

    float angle = influence * 1.8 + sin(time * 0.35) * 0.025;
    mat2 swirl = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    vec2 warped = mouse + swirl * delta;
    warped += 0.11 * vec2(
      fbm(warped * 1.65 + vec2(time * 0.045, -time * 0.025)),
      fbm(warped * 1.65 + vec2(8.2, -time * 0.04))
    );

    float broad = fbm(warped * 1.9 + time * 0.022);
    float detail = fbm(warped * 4.1 - time * 0.035);
    float ribbon = smoothstep(0.42, 0.76, broad + detail * 0.32);
    float edge = 1.0 - smoothstep(0.0, 0.13, abs(broad + detail * 0.18 - 0.57));

    vec3 nearBlack = vec3(0.018, 0.025, 0.035);
    vec3 mineral = vec3(0.055, 0.16, 0.22);
    vec3 copper = vec3(0.80, 0.24, 0.085);
    vec3 electric = vec3(0.06, 0.58, 0.72);
    vec3 color = mix(nearBlack, mineral, broad * 0.85);
    color = mix(color, copper, ribbon * 0.44);
    color += electric * edge * (0.09 + influence * 0.24);
    color += vec3(0.75, 0.29, 0.10) * influence * 0.22;

    float vignette = smoothstep(1.02, 0.16, length(centered * vec2(0.84, 1.0)));
    color *= 0.52 + vignette * 0.68;
    color += (hash(gl_FragCoord.xy + time) - 0.5) * 0.022;

    gl_FragColor = vec4(color, 1.0);
  }
`

function compileShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export default function FluidField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof window.WebGLRenderingContext === 'undefined') return undefined
    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    })
    if (!gl) return undefined

    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShader)
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader)
    if (!vertex || !fragment) return undefined

    const program = gl.createProgram()
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )
    const position = gl.getAttribLocation(program, 'position')
    const resolution = gl.getUniformLocation(program, 'resolution')
    const pointer = gl.getUniformLocation(program, 'pointer')
    const time = gl.getUniformLocation(program, 'time')
    const pressure = gl.getUniformLocation(program, 'pressure')
    const target = { x: 0.72, y: 0.42, pressure: 0.24 }
    const current = { ...target }
    let frame = 0
    let start = performance.now()

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75)
      const width = Math.max(1, Math.round(canvas.clientWidth * ratio))
      const height = Math.max(1, Math.round(canvas.clientHeight * ratio))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }
    }

    function move(event) {
      const bounds = canvas.getBoundingClientRect()
      target.x = (event.clientX - bounds.left) / bounds.width
      target.y = 1 - ((event.clientY - bounds.top) / bounds.height)
      target.pressure = event.pointerType === 'touch' ? 1.05 : 0.88
    }

    function soften() {
      target.pressure = 0.24
    }

    function render(now) {
      resize()
      current.x += (target.x - current.x) * 0.075
      current.y += (target.y - current.y) * 0.075
      current.pressure += (target.pressure - current.pressure) * 0.055
      gl.useProgram(program)
      gl.enableVertexAttribArray(position)
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
      gl.uniform2f(resolution, canvas.width, canvas.height)
      gl.uniform2f(pointer, current.x, current.y)
      gl.uniform1f(time, (now - start) / 1000)
      gl.uniform1f(pressure, current.pressure)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      frame = window.requestAnimationFrame(render)
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    canvas.addEventListener('pointermove', move, { passive: true })
    canvas.addEventListener('pointerleave', soften, { passive: true })
    resize()
    if (reduced) {
      start = 0
      render(0)
      window.cancelAnimationFrame(frame)
    } else {
      frame = window.requestAnimationFrame(render)
    }

    return () => {
      window.cancelAnimationFrame(frame)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerleave', soften)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
    }
  }, [])

  return <canvas className="fluid-field" ref={canvasRef} aria-hidden="true" />
}
