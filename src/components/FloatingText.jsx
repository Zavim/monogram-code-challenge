import * as THREE from "three";
import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Image } from "@react-three/drei";

function Texts() {
  const { viewport, camera } = useThree();
  const count = 8;

  let data = [];
  for (let i = 0; i < count; i++) {
    const { width, height } = viewport.getCurrentViewport(camera, [0, 0, 0]);
    // get the size of the viewport to spawn text at appropriate width and height
    data.push({
      position: [0, 0, 0],
      width: width,
      height: height,
      index: i,
    });
  }
  return (
    <group position={[0, 0, 0]}>
      {data.map((props, i) => (
        // create 8 Text objects to float up the canvas
        <Text key={i} {...props} />
      ))}
    </group>
  );
}

function Text({ ...props }) {
  const [glowing, setGlowing] = useState(false);
  const c = new THREE.Color();
  //click a logo to set the glow effect -- the hitboxes are very finnicky, would fix with more time
  const height = props.height;
  const width = props.width;
  const index = props.index;

  const textRef = useRef();

  const logos = [
    "/images/react.png",
    "/images/svelte.png",
    "/images/vue.png",
    "/images/nextjs.png",
    "/images/react.png",
    "/images/svelte.png",
    "/images/vue.png",
    "/images/nextjs.png",
  ];

  const [data] = useState({
    x: THREE.MathUtils.randFloatSpread(0.75), //this creates a range between -+x/2
    y: THREE.MathUtils.randFloatSpread(height + index), //offset height by the index to inroduce more variation
  });

  useFrame((_state, delta) => {
    textRef.current.material.color.lerp(
      c.set(glowing ? "purple" : "#white"),
      glowing ? 0.3 : 0.1
    );
    textRef.current.position.set(data.x, data.y, 1);
    textRef.current.position.set(data.x * width, (data.y += delta / 10), 1);
    if (data.y > height) {
      data.x = THREE.MathUtils.randFloatSpread(0.75);
      data.y = -height / 2;
      setGlowing(false);
    }
  });
  return (
    <group {...props}>
      <Image
        ref={textRef}
        url={logos[index]}
        transparent
        opacity={0.5}
        onClick={() => setGlowing(!glowing)}
      />
    </group>
  );
}

export default function FloatingText() {
  return (
    <>
      <Canvas
        style={{ width: "100vw", height: "100%" }} //158rem
        gl={{ alpha: false }}
        camera={{ near: 0.01, far: 110, fov: 40 }}
      >
        <color attach="background" args={["#151515"]} />

        <spotLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <Texts />
        </Suspense>
      </Canvas>
    </>
  );
}
