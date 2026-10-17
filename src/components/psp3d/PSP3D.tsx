import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { XMB_THEMES, useTheme } from '../../theme';
import { setSoundEnabled, sfx } from '../../sound';
import { XMBScreen, useXMBController, type XMBController, type Dir } from '../xmb';
import {
  FRONT, DPAD_KEY_OFFSET, bodyGeometry, shoulderGeometry, strapHookGeometry, dpadKeyGeometry, pillGeometry, faceButtonGeometry,
  nubGeometry, diamondShape,
  facePrintTexture, glyphTexture, capLabelTexture, knurlTexture,
} from './geometry';

/* The five PSP-1000 launch-era finishes. */
export const FINISHES = [
  { name: 'Piano Black', body: '#040405', metal: 0, rough: 0.1, keys: '#0b0b0d', ink: '#c9ced6', dark: '#16171b', well: '#000000', shoulder: '#c9ced5' },
  { name: 'Ceramic White', body: '#eceef1', metal: 0, rough: 0.2, keys: '#e2e5e9', ink: '#59606b', dark: '#b9bec6', well: '#d4d8dd', shoulder: '#cfd3d9' },
  { name: 'Metallic Blue', body: '#2149b8', metal: 0.35, rough: 0.28, keys: '#163486', ink: '#d9e2f5', dark: '#0e2463', well: '#0c1d4f', shoulder: '#c2c8d1' },
  { name: 'Pink', body: '#f0a2c0', metal: 0.05, rough: 0.24, keys: '#ec9bba', ink: '#7a4659', dark: '#c27d97', well: '#d98aa8', shoulder: '#dde0e4' },
  { name: 'Champagne Gold', body: '#d6c393', metal: 0.4, rough: 0.28, keys: '#c4af83', ink: '#4c4434', dark: '#9c8b65', well: '#a8976f', shoulder: '#d9d4c6' },
] as const;
type Finish = (typeof FINISHES)[number];

// Feature positions (mm), measured from the reference photo
const P = {
  screen: { x: 0.6, y: 1.1, w: 99, h: 56, aw: 95, ah: 53.9 },
  dpad: { x: -66.1, y: 2.5, r: 12.9, off: DPAD_KEY_OFFSET },
  face: { x: 67.2, y: 2.5, off: 10.3, plate: 15.8 },
  nub: { x: -65.5, y: -20.5, well: 6.8 },
  row: -32.4,
};

// `?pose=front` renders the device straight-on with a near-orthographic camera (for comparing with photos)
const FRONT_POSE = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('pose') === 'front';

const HTML_W = 960; // CSS px of the XMB element; 95 mm wide in the scene
const HTML_H = Math.round((HTML_W * P.screen.ah) / P.screen.aw);

/** Dark product-shot studio: black room, a few softboxes. Gives piano black its long, crisp highlights. */
function studioScene() {
  const s = new THREE.Scene();
  s.background = new THREE.Color('#030304');
  const box = (w: number, h: number, pos: [number, number, number], intensity: number, color = '#ffffff', roll = 0) => {
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    m.rotateZ(roll);
    s.add(m);
  };
  box(12, 3, [0, 6, 3], 3.2); // overhead softbox → top-edge highlight
  box(3, 9, [-8, 1, 2.5], 2.0); // key strip, left
  box(2, 8, [8, 0, 2], 1.1, '#dfe8ff'); // fill strip, right
  box(16, 2, [0, -6, 4], 0.35); // floor bounce
  box(18, 12, [0, 0, 10], 0.22); // very dim front fill — a hint of sheen without greying the black
  box(0.7, 16, [-2.2, -1.2, 9], 2.6, '#ffffff', 0.5); // narrow diagonal strip → the classic streak across the face
  box(0.35, 16, [1.4, -1.6, 9], 1.2, '#ffffff', 0.5); // thinner second streak
  return s;
}

function useEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(studioScene(), 0.02).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
}

/** Keep the whole device (plus tilt room) in frame for any canvas aspect. */
function FitCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    if (FRONT_POSE) cam.fov = 3;
    const v = THREE.MathUtils.degToRad(cam.fov) / 2;
    const aspect = size.width / size.height;
    const needW = 196;
    const needH = 92;
    const d = Math.max(needH / 2 / Math.tan(v), needW / 2 / (Math.tan(v) * aspect));
    cam.position.set(0, 0, d);
    cam.near = Math.max(1, d - 200);
    cam.far = d + 400;
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

function setCursor(on: boolean) {
  document.body.style.cursor = on ? 'pointer' : '';
}

/** A key that sinks when pressed (from the controller, the keyboard, or a click on the mesh). */
function Key({
  id,
  ctl,
  position,
  rotation = 0,
  onPress,
  children,
  travel = 0.55,
}: {
  id: string;
  ctl: XMBController;
  position: [number, number, number];
  rotation?: number;
  onPress: () => void;
  children: ReactNode;
  travel?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const [down, setDown] = useState(false);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const target = position[2] - (down || ctl.pressed === id ? travel : 0);
    g.position.z = THREE.MathUtils.damp(g.position.z, target, 30, dt);
  });
  return (
    <group
      ref={ref}
      position={position}
      rotation={[0, 0, rotation]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setCursor(true);
      }}
      onPointerOut={() => {
        setCursor(false);
        setDown(false);
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        setDown(true);
        ctl.focus();
        onPress();
      }}
      onPointerUp={() => setDown(false)}
    >
      {children}
    </group>
  );
}

function useMaterials(f: Finish) {
  return useMemo(() => {
    const body = new THREE.MeshPhysicalMaterial({
      color: f.body,
      metalness: f.metal,
      roughness: f.rough,
      clearcoat: 1,
      clearcoatRoughness: 0.035,
      envMapIntensity: 0.9,
    });
    const keys = new THREE.MeshPhysicalMaterial({
      color: f.keys,
      metalness: f.metal * 0.6,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
    });
    // recesses: matte and barely reflective so the glossy keys stand out against them
    const well = new THREE.MeshStandardMaterial({ color: f.well, roughness: 0.9, metalness: 0, envMapIntensity: 0.06 });
    const nub = new THREE.MeshStandardMaterial({
      color: f.name === 'Piano Black' ? '#2a2c30' : f.keys,
      roughness: 0.7,
      metalness: 0,
      envMapIntensity: 0.6,
    });
    const rim = new THREE.MeshStandardMaterial({ color: f.dark, roughness: 0.35, metalness: 0.2 });
    const silver = new THREE.MeshPhysicalMaterial({ color: f.shoulder, metalness: 0.9, roughness: 0.32, clearcoat: 0.4, clearcoatRoughness: 0.2 });
    const glass = new THREE.MeshPhysicalMaterial({ color: '#010102', roughness: 0.05, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.02 });
    return { body, keys, well, nub, rim, silver, glass };
  }, [f]);
}

function useTextures(f: Finish, fontsReady: boolean) {
  return useMemo(() => {
    void fontsReady; // regenerate once webfonts are available to the canvas
    const k = (label: string, w: number, h: number) => capLabelTexture(label, w, h, f.ink);
    return {
      print: facePrintTexture(f.ink, f.dark),
      tri: glyphTexture('tri', f.ink),
      cir: glyphTexture('cir', f.ink),
      crs: glyphTexture('crs', f.ink),
      sqr: glyphTexture('sqr', f.ink),
      arrow: glyphTexture('up', f.ink),
      knurl: knurlTexture(),
      home: k('HOME', 10.1, 4.6),
      minus: k('−', 5.4, 5.0),
      plus: k('+', 5.4, 5.0),
      display: k('display', 6.4, 4.4),
      note: k('note', 6.1, 4.4),
      select: k('SELECT', 10.7, 4.6),
      start: k('START', 10.1, 4.6),
    };
  }, [f, fontsReady]);
}

type Actions = {
  nextFinish: () => void;
  nextTheme: () => void;
  sound: (on?: boolean) => void;
};

function Model({
  ctl,
  finish,
  actions,
  glareRef,
  screenAnchor,
}: {
  ctl: XMBController;
  finish: Finish;
  actions: Actions;
  glareRef: RefObject<HTMLDivElement | null>;
  screenAnchor: RefObject<THREE.Group | null>;
}) {
  const group = useRef<THREE.Group>(null);
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    Promise.all([document.fonts.load('800 40px NewRodin'), document.fonts.load('700 20px "Space Grotesk"')]).finally(() => setFontsReady(true));
  }, []);

  const geo = useMemo(
    () => ({
      body: bodyGeometry(),
      shL: shoulderGeometry('l'),
      shR: shoulderGeometry('r'),
      dkey: dpadKeyGeometry(),
      face: faceButtonGeometry(),
      nub: nubGeometry(),
      diamond: new THREE.ShapeGeometry(diamondShape(P.face.plate, 5), 12),
      diamondRim: new THREE.ShapeGeometry(diamondShape(P.face.plate + 0.4, 5.2), 12),
      strap: strapHookGeometry(),
      home: pillGeometry(10.1, 4.6),
      small: pillGeometry(5.4, 5.0),
      disp: pillGeometry(6.4, 4.4),
      wide: pillGeometry(10.7, 4.6),
      start: pillGeometry(10.1, 4.6),
    }),
    [],
  );
  const m = useMaterials(finish);
  const t = useTextures(finish, fontsReady);
  useEffect(() => () => Object.values(t).forEach((x) => x.dispose()), [t]);
  useEffect(() => () => Object.values(m).forEach((x) => x.dispose()), [m]);

  // Pointer tilt + idle float + entrance spin
  const pointer = useRef({ x: 0, y: 0 });
  const lastMouse = useRef(-1e9);
  const start = useRef<number | null>(null);
  const { gl } = useThree();
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return; // on touch screens the device sways on its own instead
      lastMouse.current = performance.now();
      const r = gl.domElement.getBoundingClientRect();
      pointer.current.x = THREE.MathUtils.clamp(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * 1, -1.4, 1.4);
      pointer.current.y = THREE.MathUtils.clamp(((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * 1, -1.6, 1.6);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [gl]);

  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    if (FRONT_POSE) {
      g.rotation.set(0, 0, 0);
      g.position.set(0, 0, 0);
      g.scale.setScalar(1);
      return;
    }
    if (start.current === null) start.current = state.clock.elapsedTime;
    const age = state.clock.elapsedTime - start.current;
    const intro = reduced ? 0 : Math.max(0, 1 - age / 1.6);
    const ease = intro * intro * (3 - 2 * intro);
    // hero pose: slightly turned and seen from a touch above, then follow the pointer
    const time = state.clock.elapsedTime;
    const idle = reduced || performance.now() - lastMouse.current < 4000 ? 0 : 1;
    const ty = -0.14 + pointer.current.x * 0.28 + idle * Math.sin(time * 0.45) * 0.07 - ease * 0.9;
    const tx = 0.11 + pointer.current.y * 0.14 + idle * Math.sin(time * 0.31) * 0.04 + ease * 0.25;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, ty, 4, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, tx, 4, dt);
    g.position.y = reduced ? 0 : Math.sin(state.clock.elapsedTime * 1.1) * 1.1;
    g.rotation.z = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.7) * 0.008;
    const s = 1 - ease * 0.12;
    g.scale.setScalar(s);
    // glare on the screen follows the tilt
    const el = glareRef.current;
    if (el) {
      el.style.setProperty('--gx', `${50 + g.rotation.y * 160}%`);
      el.style.setProperty('--gy', `${20 - g.rotation.x * 160}%`);
    }
  });

  // Draggable analog nub
  const nubRef = useRef<THREE.Group>(null);
  const nubDrag = useRef<{ x: number; y: number; fired: boolean } | null>(null);
  const nubTarget = useRef({ x: 0, y: 0 });
  useFrame((_, dt) => {
    const n = nubRef.current;
    if (!n) return;
    n.position.x = THREE.MathUtils.damp(n.position.x, P.nub.x + nubTarget.current.x, 18, dt);
    n.position.y = THREE.MathUtils.damp(n.position.y, P.nub.y + nubTarget.current.y, 18, dt);
  });
  const onNubDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    nubDrag.current = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY, fired: false };
    ctl.focus();
  };
  const onNubMove = (e: ThreeEvent<PointerEvent>) => {
    const s = nubDrag.current;
    if (!s) return;
    const max = 22; // px of pointer travel for full deflection
    let dx = e.nativeEvent.clientX - s.x;
    let dy = e.nativeEvent.clientY - s.y;
    const len = Math.hypot(dx, dy);
    if (len > max) {
      dx = (dx / len) * max;
      dy = (dy / len) * max;
    }
    nubTarget.current = { x: (dx / max) * 1.6, y: (-dy / max) * 1.6 };
    const strong = Math.hypot(dx, dy) > max * 0.75;
    if (strong && !s.fired) {
      s.fired = true;
      const d: Dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : dy < 0 ? 'up' : 'down';
      ctl.move(d);
    } else if (!strong && len < max * 0.3) s.fired = false;
  };
  const onNubUp = (e: ThreeEvent<PointerEvent>) => {
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    nubDrag.current = null;
    nubTarget.current = { x: 0, y: 0 };
  };

  const glyph = (map: THREE.Texture, size: number, z: number, y = 0) => (
    <mesh position={[0, y, z]} renderOrder={2}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={map} transparent depthWrite={false} color="#e6e8ec" />
    </mesh>
  );

  const capLabel = (map: THREE.Texture, w: number, h: number) => (
    <mesh position={[0, 0, 0.96]} renderOrder={2}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={map} transparent depthWrite={false} color="#e6e8ec" />
    </mesh>
  );

  const dpad: [Dir, number, number, number][] = [
    ['up', 0, P.dpad.off, 0],
    ['down', 0, -P.dpad.off, Math.PI],
    ['left', -P.dpad.off, 0, Math.PI / 2],
    ['right', P.dpad.off, 0, -Math.PI / 2],
  ];

  const faces = [
    { id: 'tri', x: 0, y: P.face.off, map: t.tri, act: ctl.triangle, label: 'Random colourway' },
    { id: 'cir', x: P.face.off, y: 0, map: t.cir, act: ctl.back, label: 'Back' },
    { id: 'crs', x: 0, y: -P.face.off, map: t.crs, act: () => ctl.open(), label: 'Open' },
    { id: 'sqr', x: -P.face.off, y: 0, map: t.sqr, act: ctl.square, label: 'Compare models' },
  ];

  const row = P.row;
  const Z = FRONT;

  return (
    <group ref={group}>
      {/* shell */}
      <mesh geometry={geo.body} material={m.body} />

      {/* silver L / R */}
      <Key id="l" ctl={ctl} position={[0, 0, 0]} travel={0} onPress={() => { ctl.press('l'); ctl.move('left'); }}>
        <mesh geometry={geo.shL} material={m.silver} />
      </Key>
      <Key id="r" ctl={ctl} position={[0, 0, 0]} travel={0} onPress={() => { ctl.press('r'); ctl.move('right'); }}>
        <mesh geometry={geo.shR} material={m.silver} />
      </Key>

      {/* silver wrist-strap holder, bottom-left corner */}
      <mesh geometry={geo.strap} material={m.silver} />

      {/* printed details */}
      <mesh position={[0, 0, Z + 0.03]} renderOrder={1}>
        <planeGeometry args={[170, 74]} />
        <meshBasicMaterial map={t.print} transparent depthWrite={false} color="#e6e8ec" />
      </mesh>

      {/* screen: black glass with a thin rim, live XMB on top */}
      <mesh position={[P.screen.x, P.screen.y, Z + 0.012]}>
        <planeGeometry args={[P.screen.w + 0.9, P.screen.h + 0.9]} />
        <primitive object={m.rim} attach="material" />
      </mesh>
      <mesh position={[P.screen.x, P.screen.y, Z + 0.02]} material={m.glass}>
        <planeGeometry args={[P.screen.w, P.screen.h]} />
      </mesh>
      {/* the XMB DOM element is projected onto this anchor (see ScreenProjector) */}
      <group ref={screenAnchor} position={[P.screen.x, P.screen.y, Z + 0.08]} />

      {/* d-pad */}
      <group position={[P.dpad.x, P.dpad.y, 0]}>
        <mesh position={[0, 0, Z + 0.01]} material={m.well}>
          <circleGeometry args={[P.dpad.r, 72]} />
        </mesh>
        {/* glossy lip around the d-pad well */}
        <mesh position={[0, 0, Z + 0.05]} material={m.keys}>
          <torusGeometry args={[P.dpad.r, 0.42, 12, 120]} />
        </mesh>
        {dpad.map(([d, x, y, rot]) => (
          <Key key={d} id={d} ctl={ctl} position={[x, y, Z + 0.55]} rotation={rot} onPress={() => ctl.move(d)}>
            <mesh geometry={geo.dkey} material={m.keys} />
            {glyph(t.arrow, 6.2, 1.72, 1.0)}
          </Key>
        ))}
      </group>

      {/* face buttons on their diamond plate */}
      <group position={[P.face.x, P.face.y, 0]}>
        <mesh geometry={geo.diamondRim} position={[0, 0, Z + 0.006]} material={m.rim} />
        <mesh geometry={geo.diamond} position={[0, 0, Z + 0.012]} material={m.body} />
        {faces.map((f) => (
          <group key={`well-${f.id}`} position={[f.x, f.y, 0]}>
            <mesh position={[0, 0, Z + 0.02]} material={m.well}>
              <circleGeometry args={[4.95, 48]} />
            </mesh>
            <mesh position={[0, 0, Z + 0.06]} material={m.keys}>
              <torusGeometry args={[4.95, 0.26, 10, 72]} />
            </mesh>
          </group>
        ))}
        {faces.map((f) => (
          <Key key={f.id} id={f.id} ctl={ctl} position={[f.x, f.y, Z]} onPress={f.act}>
            <mesh geometry={geo.face} material={m.keys} />
            {glyph(f.map, 7, 2.45)}
          </Key>
        ))}
      </group>

      {/* analog nub */}
      <mesh position={[P.nub.x, P.nub.y, Z + 0.01]} material={m.well}>
        <circleGeometry args={[P.nub.well, 64]} />
      </mesh>
      <mesh position={[P.nub.x, P.nub.y, Z + 0.04]} material={m.keys}>
        <torusGeometry args={[P.nub.well, 0.32, 10, 90]} />
      </mesh>
      <group ref={nubRef} position={[P.nub.x, P.nub.y, Z - 0.25]}>
        <mesh
          geometry={geo.nub}
          material={m.nub}
          onPointerDown={onNubDown}
          onPointerMove={onNubMove}
          onPointerUp={onNubUp}
          onPointerOver={() => setCursor(true)}
          onPointerOut={() => setCursor(false)}
        />
        <mesh position={[0, 0, 1.44]}>
          <circleGeometry args={[4.7, 56]} />
          <meshStandardMaterial map={t.knurl} roughness={0.72} envMapIntensity={0.5} />
        </mesh>
      </group>

      {/* LEDs */}
      <mesh position={[-79.4, -15.2, Z + 0.05]}>
        <sphereGeometry args={[0.55, 16, 12]} />
        <meshStandardMaterial color="#3dff7a" emissive="#2cff6a" emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
      <mesh position={[-78.2, -22.6, Z + 0.05]}>
        <sphereGeometry args={[0.5, 16, 12]} />
        <meshStandardMaterial color="#ff9b2a" emissive="#ff8a1a" emissiveIntensity={1.4} toneMapped={false} />
      </mesh>

      {/* bottom row */}
      <Key id="home" ctl={ctl} position={[-47.3, row, Z + 0.45]} onPress={() => { ctl.press('home'); sfx.back(); ctl.setItem(ctl.nav.cat, 0); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
        <mesh geometry={geo.home} material={m.keys} />
        {capLabel(t.home, 10.1, 4.6)}
      </Key>
      <Key id="vol-" ctl={ctl} position={[-34.6, row, Z + 0.45]} onPress={() => { ctl.press('vol-'); actions.sound(false); }}>
        <mesh geometry={geo.small} material={m.keys} />
        {capLabel(t.minus, 5.4, 5.0)}
      </Key>
      <Key id="vol+" ctl={ctl} position={[-23.2, row, Z + 0.45]} onPress={() => { ctl.press('vol+'); actions.sound(true); }}>
        <mesh geometry={geo.small} material={m.keys} />
        {capLabel(t.plus, 5.4, 5.0)}
      </Key>
      <Key id="disp" ctl={ctl} position={[19.0, row, Z + 0.45]} onPress={() => { ctl.press('disp'); actions.nextTheme(); }}>
        <mesh geometry={geo.disp} material={m.keys} />
        {capLabel(t.display, 6.4, 4.4)}
      </Key>
      <Key id="note" ctl={ctl} position={[26.5, row, Z + 0.45]} onPress={() => { ctl.press('note'); actions.sound(); }}>
        <mesh geometry={geo.disp} material={m.keys} />
        {capLabel(t.note, 6.1, 4.4)}
      </Key>
      <Key id="select" ctl={ctl} position={[37.2, row, Z + 0.45]} onPress={() => { ctl.press('select'); actions.nextFinish(); }}>
        <mesh geometry={geo.wide} material={m.keys} />
        {capLabel(t.select, 10.7, 4.6)}
      </Key>
      <Key id="start" ctl={ctl} position={[48.0, row, Z + 0.45]} onPress={() => ctl.open()}>
        <mesh geometry={geo.start} material={m.keys} />
        {capLabel(t.start, 10.1, 4.6)}
      </Key>
    </group>
  );
}

const eps = (v: number) => (Math.abs(v) < 1e-10 ? 0 : v);

/**
 * Projects a DOM element onto a 3D anchor, the way three's CSS3DRenderer does: a perspective
 * container matched to the camera fov, a camera layer, and the object's world matrix as matrix3d.
 * Runs after the model's own frame updates (it is mounted after it).
 */
function ScreenProjector({
  anchor,
  view,
  cam,
  obj,
}: {
  anchor: RefObject<THREE.Group | null>;
  view: RefObject<HTMLDivElement | null>;
  cam: RefObject<HTMLDivElement | null>;
  obj: RefObject<HTMLDivElement | null>;
}) {
  const { camera, size } = useThree();
  const scale = useMemo(() => new THREE.Matrix4().makeScale(P.screen.aw / HTML_W, P.screen.aw / HTML_W, 1), []);
  const m = useMemo(() => new THREE.Matrix4(), []);
  useFrame(() => {
    const a = anchor.current;
    if (!a || !view.current || !cam.current || !obj.current) return;
    camera.updateMatrixWorld();
    a.updateWorldMatrix(true, false);
    const fov = camera.projectionMatrix.elements[5] * (size.height / 2);
    const c = camera.matrixWorldInverse.elements;
    view.current.style.perspective = `${fov}px`;
    cam.current.style.transform =
      `translateZ(${fov}px) matrix3d(${eps(c[0])},${eps(-c[1])},${eps(c[2])},${eps(c[3])},${eps(c[4])},${eps(-c[5])},${eps(c[6])},${eps(c[7])},` +
      `${eps(c[8])},${eps(-c[9])},${eps(c[10])},${eps(c[11])},${eps(c[12])},${eps(-c[13])},${eps(c[14])},${eps(c[15])}) ` +
      `translate(${size.width / 2}px,${size.height / 2}px)`;
    const e = m.copy(a.matrixWorld).multiply(scale).elements;
    obj.current.style.transform =
      `translate(-50%,-50%) matrix3d(${eps(e[0])},${eps(e[1])},${eps(e[2])},${eps(e[3])},${eps(-e[4])},${eps(-e[5])},${eps(-e[6])},${eps(-e[7])},` +
      `${eps(e[8])},${eps(e[9])},${eps(e[10])},${eps(e[11])},${eps(e[12])},${eps(e[13])},${eps(e[14])},${eps(e[15])})`;
  });
  return null;
}

function Lights({ accent }: { accent: string }) {
  useEnvironment();
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[-140, 180, 260]} intensity={1.6} />
      <directionalLight position={[220, -60, 120]} intensity={0.5} color="#cfe0ff" />
      {/* XMB-coloured rim light from behind */}
      <pointLight position={[0, -40, -120]} intensity={60000} distance={600} color={accent} />
      <pointLight position={[0, 120, -80]} intensity={30000} distance={500} color="#ffffff" />
    </>
  );
}

export default function PSP3D() {
  const rootRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const screenAnchor = useRef<THREE.Group>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const camRef = useRef<HTMLDivElement>(null);
  const objRef = useRef<HTMLDivElement>(null);
  const ctl = useXMBController(rootRef);
  const theme = useTheme();
  const [finishIndex, setFinishIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const finish = FINISHES[finishIndex];

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => () => setCursor(false), []);

  const actions: Actions = {
    nextFinish: () => {
      sfx.toggle();
      setFinishIndex((i) => (i + 1) % FINISHES.length);
    },
    nextTheme: () => {
      sfx.toggle();
      theme.setIndex((theme.index + 1) % XMB_THEMES.length);
    },
    sound: (on) => {
      const v = on ?? !theme.sound;
      setSoundEnabled(v);
      theme.setSound(v);
      if (v) setTimeout(() => sfx.select(), 30);
    },
  };

  return (
    <div className="flex flex-col items-center">
      <div
        ref={rootRef}
        tabIndex={0}
        role="application"
        aria-label="Interactive 3D PSP-1000. Use the arrow keys to browse the menu and Enter to open. SELECT changes the shell colour."
        className="psp3d relative w-full aspect-[2.1/1] isolate outline-none"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 bottom-[4%] h-[16%] w-[72%] -translate-x-1/2 rounded-[50%] blur-2xl"
          style={{ background: 'radial-gradient(ellipse, rgb(var(--accent-rgb) / 0.4), transparent 70%)' }}
        />
        <Canvas
          frameloop={visible ? 'always' : 'never'}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          camera={{ fov: 20, position: [0, 0, 600] }}
          onPointerMissed={() => setCursor(false)}
        >
          <FitCamera />
          <Lights accent={theme.accent} />
          <Model ctl={ctl} finish={finish} actions={actions} glareRef={glareRef} screenAnchor={screenAnchor} />
          <ScreenProjector anchor={screenAnchor} view={viewRef} cam={camRef} obj={objRef} />
        </Canvas>
        {/* CSS3D layer: the live XMB, mapped onto the PSP's screen every frame */}
        <div ref={viewRef} className="absolute inset-0 overflow-hidden pointer-events-none">
          <div ref={camRef} className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
            <div ref={objRef} className="psp3d-screen absolute left-0 top-0 pointer-events-auto" style={{ width: HTML_W, height: HTML_H }}>
              <XMBScreen ctl={ctl} />
              <div ref={glareRef} className="psp3d-glare" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <span className="label hidden sm:inline">Shell</span>
        <div className="flex gap-2 well p-1.5 !rounded-full">
          {FINISHES.map((f, i) => (
            <button
              key={f.name}
              type="button"
              title={f.name}
              aria-label={`${f.name} shell`}
              aria-pressed={i === finishIndex}
              onClick={() => {
                sfx.toggle();
                setFinishIndex(i);
              }}
              className="w-6 h-6 rounded-full transition-transform hover:scale-110"
              style={{
                background: `radial-gradient(circle at 35% 28%, rgb(255 255 255 / 0.9), ${f.body} 48%, ${f.body})`,
                boxShadow: i === finishIndex ? `0 0 0 2px #06080d, 0 0 0 4px var(--accent-hi)` : 'inset 0 -2px 3px rgb(0 0 0 / 0.35), 0 0 0 1px rgb(0 0 0 / 0.6)',
              }}
            />
          ))}
        </div>
        <span className="lcd lcd-text px-2.5 py-1 text-lg leading-none !rounded-md min-w-[150px] text-center">{finish.name.toUpperCase()}</span>
      </div>
    </div>
  );
}
