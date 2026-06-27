import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import Model from './Model';

function Loader() {
  return (
    <Html center>
      <div className="loader">Loading cube...</div>
    </Html>
  );
}

export default function InteractiveCube() {
  return (
    <Canvas
      className="scene-canvas"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [4.0, 2.6, 6.8], fov: 38, near: 0.1, far: 100 }}
    >
      <ambientLight intensity={1.7} />
      <directionalLight position={[5, 8, 6]} intensity={2.4} />
      <directionalLight position={[-4, 3, -5]} intensity={0.7} />

      <Suspense fallback={<Loader />}>
        <Model position={[0, 0.35, 0]} />
      </Suspense>

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        minDistance={2.5}
        maxDistance={12}
        target={[0, 0.35, 0]}
      />
    </Canvas>
  );
}
