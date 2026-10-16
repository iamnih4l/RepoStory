'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CyberDataPipeline3DProps {
  stagesCount: number;
  activeStageIndex: number;
  className?: string;
}

export function CyberDataPipeline3D({
  stagesCount,
  activeStageIndex,
  className = '',
}: CyberDataPipeline3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeStageRef = useRef(activeStageIndex);

  useEffect(() => {
    activeStageRef.current = activeStageIndex;
  }, [activeStageIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 180;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 7.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Pipeline Conduit Group
    const pipelineGroup = new THREE.Group();
    scene.add(pipelineGroup);

    // Central Wireframe Conduit (Cylinder)
    const totalLength = 8.0;
    const conduitGeo = new THREE.CylinderGeometry(0.35, 0.35, totalLength, 16, 24, true);
    // Rotate cylinder so length aligns with X axis
    conduitGeo.rotateZ(Math.PI / 2);

    const conduitMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const conduitMesh = new THREE.Mesh(conduitGeo, conduitMat);
    pipelineGroup.add(conduitMesh);

    // Inner Glowing Core Rod
    const coreGeo = new THREE.CylinderGeometry(0.06, 0.06, totalLength, 8);
    coreGeo.rotateZ(Math.PI / 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x39ff14,
      transparent: true,
      opacity: 0.6,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    pipelineGroup.add(coreMesh);

    // Holographic Stage Rings
    const stageRings: THREE.Mesh[] = [];
    const stageHalos: THREE.Mesh[] = [];
    const count = Math.max(stagesCount, 2);

    for (let i = 0; i < count; i++) {
      const xPos = -totalLength / 2 + (totalLength / (count - 1)) * i;

      // Torus ring
      const ringGeo = new THREE.TorusGeometry(0.65, 0.04, 12, 32);
      ringGeo.rotateY(Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.4,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.x = xPos;
      pipelineGroup.add(ringMesh);
      stageRings.push(ringMesh);

      // Outer pulsing halo
      const haloGeo = new THREE.RingGeometry(0.72, 0.85, 24);
      haloGeo.rotateY(Math.PI / 2);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x39ff14,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.x = xPos;
      pipelineGroup.add(haloMesh);
      stageHalos.push(haloMesh);
    }

    // Floating Data Packets traveling along X
    const packetCount = 8;
    const packetGeo = new THREE.OctahedronGeometry(0.14, 0);
    const packetMat = new THREE.MeshBasicMaterial({
      color: 0x39ff14,
      wireframe: true,
    });

    const packets: { mesh: THREE.Mesh; speed: number; offset: number }[] = [];
    for (let i = 0; i < packetCount; i++) {
      const pMesh = new THREE.Mesh(packetGeo, packetMat.clone());
      const offset = (i / packetCount) * totalLength;
      pMesh.position.set(-totalLength / 2 + offset, 0, 0);
      pipelineGroup.add(pMesh);
      packets.push({
        mesh: pMesh,
        speed: 0.035 + (i % 3) * 0.01,
        offset,
      });
    }

    // Ambient floating particle dust
    const dustCount = 40;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * totalLength;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 2;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.06,
      transparent: true,
      opacity: 0.5,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    pipelineGroup.add(dustPoints);

    // Interactive Drag / Tilt
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0.1;
    let targetRotX = 0.15;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      targetRotY += deltaX * 0.006;
      targetRotX = Math.max(-0.4, Math.min(0.4, targetRotX + deltaY * 0.006));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Animation Loop
    let animId: number;
    let time = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.025;

      // Smooth rotation toward targets
      pipelineGroup.rotation.y += (targetRotY - pipelineGroup.rotation.y) * 0.06;
      pipelineGroup.rotation.x += (targetRotX - pipelineGroup.rotation.x) * 0.06;

      // Conduit wireframe subtle spin
      conduitMesh.rotation.x = time * 0.2;

      // Update active stage ring luminescence
      const currentActive = activeStageRef.current;
      stageRings.forEach((ring, idx) => {
        const isActive = idx === currentActive;
        const ringMat = ring.material as THREE.MeshBasicMaterial;
        const halo = stageHalos[idx];
        const haloMat = halo?.material as THREE.MeshBasicMaterial;

        if (isActive) {
          const pulse = 1 + Math.sin(time * 6) * 0.15;
          ring.scale.set(pulse, pulse, pulse);
          ringMat.color.setHex(0x39ff14);
          ringMat.opacity = 0.9;
          if (halo) {
            halo.scale.set(pulse * 1.15, pulse * 1.15, 1);
            haloMat.opacity = 0.4 + Math.sin(time * 6) * 0.2;
            halo.rotation.z = time * 0.5;
          }
        } else if (idx < currentActive) {
          ring.scale.set(1, 1, 1);
          ringMat.color.setHex(0x00f0ff);
          ringMat.opacity = 0.55;
          if (halo) haloMat.opacity = 0.1;
        } else {
          ring.scale.set(0.9, 0.9, 0.9);
          ringMat.color.setHex(0x334155);
          ringMat.opacity = 0.25;
          if (halo) haloMat.opacity = 0.02;
        }
      });

      // Move data packets along the tube
      packets.forEach((p, idx) => {
        p.offset += p.speed;
        if (p.offset > totalLength) {
          p.offset = 0;
        }
        p.mesh.position.x = -totalLength / 2 + p.offset;
        p.mesh.rotation.x += 0.04;
        p.mesh.rotation.y += 0.05;

        // Shift packet color depending on which stage it passed
        const activeX = -totalLength / 2 + (totalLength / (count - 1)) * currentActive;
        const mat = p.mesh.material as THREE.MeshBasicMaterial;
        if (p.mesh.position.x <= activeX) {
          mat.color.setHex(0x39ff14);
        } else {
          mat.color.setHex(0x00f0ff);
        }
      });

      // Float dust
      dustPoints.rotation.x = time * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 600;
      const newH = container.clientHeight || 180;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      conduitGeo.dispose();
      conduitMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      packetGeo.dispose();
      stageRings.forEach((r) => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      stageHalos.forEach((h) => {
        h.geometry.dispose();
        (h.material as THREE.Material).dispose();
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [stagesCount]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[180px] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing border border-cyan-500/20 bg-slate-950/60 backdrop-blur-md shadow-[inset_0_0_30px_rgba(0,240,255,0.05)] ${className}`}
    >
      {/* Corner HUD Accents */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
          3D CONDUIT // LIVE DATAFLOW
        </span>
      </div>
      <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-500 z-10 pointer-events-none">
        [DRAG TO ROTATE]
      </div>
      <div className="absolute bottom-1.5 right-2 text-[9px] font-mono text-slate-600 z-10 pointer-events-none">
        STAGE {activeStageIndex + 1}/{stagesCount} PULSE ACTIVE
      </div>
    </div>
  );
}
