'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Compass, RotateCw } from 'lucide-react';

interface InteractiveVectorSphereProps {
  similarityScore?: number;
  className?: string;
}

export function InteractiveVectorSphere({
  similarityScore = 94,
  className = '',
}: InteractiveVectorSphereProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    const width = mount.clientWidth || 380;
    const height = mount.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 75);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // 1. Wireframe Sphere (Hypersphere shell)
    const sphereGeo = new THREE.SphereGeometry(26, 18, 14);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    group.add(sphereMesh);

    // 2. Coordinate Axes Rings (Equator & Meridian)
    const ringGeo = new THREE.RingGeometry(25.8, 26.2, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2;
    group.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 2;
    group.add(ring2);

    // 3. Vector A (Query Vector - Cyan)
    const dirA = new THREE.Vector3(18, 14, 12).normalize();
    const lenA = 26;
    const arrowA = new THREE.ArrowHelper(dirA, new THREE.Vector3(0, 0, 0), lenA, 0x00f0ff, 4, 2.5);
    group.add(arrowA);

    // Glowing tip A
    const tipGeo = new THREE.SphereGeometry(1.4, 12, 12);
    const tipMatA = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const tipMeshA = new THREE.Mesh(tipGeo, tipMatA);
    tipMeshA.position.copy(dirA.clone().multiplyScalar(lenA));
    group.add(tipMeshA);

    // 4. Vector B (Chunk Vector - Neon Lime, close angle for ~94% similarity)
    const dirB = new THREE.Vector3(16, 17, 10).normalize();
    const lenB = 26;
    const arrowB = new THREE.ArrowHelper(dirB, new THREE.Vector3(0, 0, 0), lenB, 0x39ff14, 4, 2.5);
    group.add(arrowB);

    // Glowing tip B
    const tipMatB = new THREE.MeshBasicMaterial({ color: 0x39ff14 });
    const tipMeshB = new THREE.Mesh(tipGeo, tipMatB);
    tipMeshB.position.copy(dirB.clone().multiplyScalar(lenB));
    group.add(tipMeshB);

    // Drag to rotate interaction
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      group.rotation.y += deltaX * 0.01;
      group.rotation.x += deltaY * 0.01;

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    mount.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Resize
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDragging) {
        group.rotation.y += 0.006;
        group.rotation.x += 0.002;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      mount.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      sphereGeo.dispose();
      ringGeo.dispose();
      tipGeo.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className={`relative w-full rounded-2xl bg-slate-950/70 border border-cyan-500/30 overflow-hidden shadow-[inset_0_0_20px_rgba(0,240,255,0.08)] ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cyber HUD Corner Brackets */}
      <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400 select-none pointer-events-none">
        ┌ [VECTOR_SPACE_3D // 768-D PROJECTION]
      </div>
      <div className="absolute top-2 right-2 text-[10px] font-mono text-lime-400 select-none pointer-events-none">
        SIM: {similarityScore}% ┐
      </div>
      <div className="absolute bottom-2 left-2 text-[9px] font-mono text-slate-500 select-none pointer-events-none">
        └ [DRAG TO ROTATE 3D HYPERSPHERE]
      </div>
      <div className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-500 select-none pointer-events-none">
        θ = 14.2° ┘
      </div>

      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-56 sm:h-64 cursor-grab active:cursor-grabbing" />

      {/* Legend Badge */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 px-3 py-1 rounded-full text-[10px] font-mono pointer-events-none backdrop-blur-md">
        <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Vector A (Query)
        </span>
        <span className="text-slate-600">|</span>
        <span className="flex items-center gap-1.5 text-lime-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-lime-400" />
          Vector B (Chunk)
        </span>
      </div>
    </div>
  );
}
