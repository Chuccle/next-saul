
import * as THREE from 'three'
import styles from '/styles/Home.module.css'
import React, { useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree,  } from '@react-three/fiber'
import { Suspense } from "react";
import { Color, TextureLoader } from 'three'
import { Text, Loader, PerspectiveCamera, OrbitControls, CameraShake } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing'


React.useLayoutEffect = React.useEffect

function ResponsiveCamera() {

  const context = useThree()

  const fov = useRef<number>(75)


  //for some reason the commented implementation below is bugged and doesn't recognise the fov property

  switch (true) {

    case context.viewport.aspect < 0.7:

      //     --> broken   context.camera.fov = 110

      fov.current = 120

      break;


    case context.viewport.aspect < 0.8:

      //    --> broken    context.camera.fov = 100

      fov.current = 100


      break;

    case context.viewport.aspect < 0.9:

      //    --> broken  context.camera.fov = 90

      fov.current = 90

      break;

    default:

      //     --> broken  context.camera.fov = 75

      fov.current = 80
  }


  // Less verbose and is too tricky to follow a linear formula 

  //if (context.viewport.aspect < 0.7) {
  // fov.current = 10 * (context.viewport.aspect + 10)
  // }





  return (<mesh>

    <PerspectiveCamera rotation={[-5, 0, 0]} makeDefault={true} name="camera" position={[0, 0.1, 0.9]} fov={fov.current} />

  </mesh>)


}


function Saul() {

  const saul = useLoader(GLTFLoader, '/saul_goodman/scene.gltf');

  const mesh = useRef<THREE.Mesh>(null)


  return (

    <primitive ref={mesh} object={saul.scene} position={[0, 0, 0]} />

  )



}
function ExeterCollegeLogo() {

  const mesh = useRef<THREE.Mesh>(null)

  const logo = useLoader(GLTFLoader, '/thelogo/scene.gltf');

  // var orbitRadius = 1.8; //distance from the origin 

  // var incrementer; //incrementer for the orbit


  useFrame(state => {

    // this will always have a set value of 0 meaning initial start position will be math.cos(0) * 2  and math.sin(0) * 2 == x:2, y:0, z:0 initial orbit position
    // incrementer = state.clock.getElapsedTime() / 5

    if (mesh.current?.rotation && mesh.current?.position) {

      mesh.current.rotation.y += 0.005

     
        // mesh.current.position.set(
        //  Math.cos(incrementer) * orbitRadius,
        // 0,
        //   Math.sin(incrementer) * orbitRadius
        //  )


    }


  })

  return (<primitive ref={mesh} object={logo.scene} position={[0, 0, -1]} scale={0.05} />


  )
}


function Background({ url }: { url: string }): JSX.Element {

  const mesh = useRef<THREE.Mesh>(null)
  const mesh2 = useRef<THREE.Mesh>(null)
  const mesh3 = useRef<THREE.Mesh>(null)
  const texture = useLoader(TextureLoader, url);
 
  var orbitRadius = 0.6; //distance from the origin 

  var incrementer; //incrementer for the orbit




  useFrame(state => {

    // this will always have a set value of 0 meaning initial start position will be math.cos(0) * 2  and math.sin(0) * 2 == x:2, y:0, z:0 initial orbit position
    incrementer = state.clock.getElapsedTime() / 5

    if (mesh.current?.rotation && mesh.current?.position) {


        mesh.current.position.set(
         Math.cos(incrementer) * orbitRadius,
         Math.tan(incrementer) * orbitRadius,
          Math.sin(incrementer) * orbitRadius
         )


    }


  })


  useFrame(state => {

    

    // this will always have a set value of 0 meaning initial start position will be math.cos(0) * 2  and math.sin(0) * 2 == x:2, y:0, z:0 initial orbit position
    incrementer = 5 + state.clock.getElapsedTime() / 5

    if (mesh2.current?.rotation && mesh2.current?.position) {


        mesh2.current.position.set(
         Math.cos(incrementer) * orbitRadius,
         Math.tan(incrementer) * orbitRadius,
          Math.sin(incrementer) * orbitRadius
         )
				}

       

  })





  return (

    <mesh ref={mesh3} position={[0.0, 0.0, 0.0]}  >
      <Text depthOffset={12} ref={mesh} outlineColor="white" outlineWidth={0.005} color="black" position={[0, 0, 0.5]} rotation={[0, 0, 0]} scale={[1, 1, 3]} anchorX="center" anchorY="middle" font="/fonts/Roboto-Black-webfont.woff">Exeter college</Text>
      <Text ref={mesh2} outlineColor="white" outlineWidth={0.005} color="black" position={[0, -0.1, 0.5]} rotation={[0, 0, 0]} scale={[1, 1, 3]} anchorX="center" anchorY="middle" font="/fonts/Roboto-Black-webfont.woff">e-sports</Text>
      <boxBufferGeometry  args={[100, 100, 100]} attach="geometry" />
      <meshBasicMaterial side={2} map={texture} attach="material" />
    </mesh>
  )

}



export default function App(): JSX.Element {

  return (
    <div className={styles.bruh}>

      <audio src="/music.mp3" autoPlay={true} loop={true} />


      <Canvas shadows={true}>



        <Suspense fallback={null}>

          <ResponsiveCamera />
          <OrbitControls />
          <directionalLight position={[0, 0, 1]} intensity={1} />
          <Background url={'Model_Textures/galaxy_starfield.png'} />
          <EffectComposer multisampling={8}>
          <Bloom kernelSize={3} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={0.6} />
          <Bloom kernelSize={KernelSize.HUGE} luminanceThreshold={0} luminanceSmoothing={0} intensity={0.5} />
        </EffectComposer>
          <Saul />
          <ExeterCollegeLogo />

        </Suspense>
        <CameraShake yawFrequency={0.2} pitchFrequency={0.2} rollFrequency={0.2} />
      </Canvas>
      <Loader />

    </div>



  )


}
