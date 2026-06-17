import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center, useGLTF } from '@react-three/drei';
import { Vector3 } from 'three';

const MODEL_PATH = '/cube.glb';
const AUTO_ROTATE = true;
const INITIAL_ROTATION = [0.6, 0.16, 0.92];
const SPIN_AXIS = new Vector3(0.25, 1, 0.18).normalize();
const NORMAL_SPIN_SPEED = 0.55;
const MAX_EXTRA_SPIN_SPEED = 3.2;
const RETURN_TO_NORMAL_RATE = 1.9;
const FLICK_SPEED_THRESHOLD = 0.72;
const FLICK_COOLDOWN_MS = 120;

export default function Model(props) {
  const tiltGroup = useRef();
  const spinGroup = useRef();
  const angularVelocity = useRef(NORMAL_SPIN_SPEED);
  const pointerState = useRef({ x: 0, y: 0, time: 0 });
  const lastFlickTime = useRef(0);
  const { scene } = useGLTF(MODEL_PATH);

  const model = useMemo(() => scene.clone(true), [scene]);

  const handlePointerMove = (event) => {
    const now = performance.now();
    const last = pointerState.current;

    if (last.time !== 0) {
      const dx = event.clientX - last.x;
      const dy = event.clientY - last.y;
      const dt = Math.max(now - last.time, 1);
      const speed = Math.hypot(dx, dy) / dt;

      if (speed > FLICK_SPEED_THRESHOLD && now - lastFlickTime.current > FLICK_COOLDOWN_MS) {
        const extraSpin = Math.min((speed - FLICK_SPEED_THRESHOLD) * 4.2, MAX_EXTRA_SPIN_SPEED);
        angularVelocity.current = Math.min(NORMAL_SPIN_SPEED + MAX_EXTRA_SPIN_SPEED, angularVelocity.current + extraSpin);
        lastFlickTime.current = now;
      }
    }

    pointerState.current = {
      x: event.clientX,
      y: event.clientY,
      time: now,
    };
  };

  useFrame((_, delta) => {
    if (!spinGroup.current || !AUTO_ROTATE) {
      return;
    }

    angularVelocity.current += (NORMAL_SPIN_SPEED - angularVelocity.current) *
      (1 - Math.exp(-delta * RETURN_TO_NORMAL_RATE));
    spinGroup.current.rotateOnAxis(SPIN_AXIS, delta * angularVelocity.current);
  });

  return (
    <group ref={tiltGroup} rotation={INITIAL_ROTATION} onPointerMove={handlePointerMove} {...props} dispose={null}>
      <group ref={spinGroup}>
        <Center>
          <primitive object={model} scale={0.45} />
        </Center>
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
