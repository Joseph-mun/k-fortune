"use client"

import { useEffect, useRef, useState } from "react"
import type * as THREE_TYPE from "three"

// Static gradient fallback for mobile/low-end devices
function StaticGradientFallback() {
  return (
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        background: "radial-gradient(ellipse at 50% 60%, rgba(197, 55, 46, 0.3) 0%, rgba(139, 92, 246, 0.15) 30%, #0a0a0a 70%)",
        backgroundColor: "#0a0a0a",
      }}
    />
  )
}

// Detect if device is mobile or has low performance
function isMobileOrLowEnd(): boolean {
  if (typeof window === "undefined") return false

  // Check screen size
  const isMobile = window.innerWidth < 768 ||
                   (window.matchMedia && window.matchMedia("(max-width: 768px)").matches)

  // Check hardware concurrency (CPU cores)
  const lowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4

  // Check if WebGL is supported
  const canvas = document.createElement("canvas")
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
  const hasWebGL = !!gl

  return isMobile || lowCPU || !hasWebGL
}

export function WebGLShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [useFallback, setUseFallback] = useState(false)
  const sceneRef = useRef<{
    scene: THREE_TYPE.Scene | null
    camera: THREE_TYPE.OrthographicCamera | null
    renderer: THREE_TYPE.WebGLRenderer | null
    mesh: THREE_TYPE.Mesh | null
    uniforms: any
    animationId: number | null
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
  })

  useEffect(() => {
    // Check if we should use fallback
    if (isMobileOrLowEnd()) {
      setUseFallback(true)
      return
    }

    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const { current: refs } = sceneRef

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

        float d = length(p) * distortion;

        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
        float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
        float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);

        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `

    const initScene = async () => {
      // Dynamic import for code splitting
      const THREE = await import("three")

      refs.scene = new THREE.Scene()
      refs.renderer = new THREE.WebGLRenderer({ canvas, alpha: true })

      // Limit pixel ratio for better performance (max 1.5 instead of 2.0+ on retina)
      const pixelRatio = Math.min(window.devicePixelRatio, 1.5)
      refs.renderer.setPixelRatio(pixelRatio)
      refs.renderer.setClearColor(new THREE.Color(0x000000), 0)

      refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1)

      const parentWidth = canvas.parentElement?.clientWidth || window.innerWidth
      const parentHeight = canvas.parentElement?.clientHeight || window.innerHeight
      refs.uniforms = {
        resolution: { value: [parentWidth, parentHeight] },
        time: { value: 0.0 },
        xScale: { value: 1.0 },
        yScale: { value: 0.5 },
        distortion: { value: 0.05 },
      }

      const position = [
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0,  1.0, 0.0,
      ]

      const positions = new THREE.BufferAttribute(new Float32Array(position), 3)
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", positions)

      const material = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: refs.uniforms,
        side: THREE.DoubleSide,
      })

      refs.mesh = new THREE.Mesh(geometry, material)
      refs.scene!.add(refs.mesh)

      handleResize()
      animate()
    }

    const animate = () => {
      if (refs.uniforms) refs.uniforms.time.value += 0.01
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera)
      }
      refs.animationId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms || !canvas.parentElement) return
      const width = canvas.parentElement.clientWidth
      const height = canvas.parentElement.clientHeight
      refs.renderer.setSize(width, height, false)
      refs.uniforms.resolution.value = [width, height]
    }

    initScene()
    window.addEventListener("resize", handleResize)

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId)
      window.removeEventListener("resize", handleResize)
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh)
        refs.mesh.geometry.dispose()
        if ("dispose" in refs.mesh.material) {
          (refs.mesh.material as any).dispose()
        }
      }
      refs.renderer?.dispose()
    }
  }, [])

  // Use fallback for mobile/low-end devices
  if (useFallback) {
    return <StaticGradientFallback />
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block"
    />
  )
}
