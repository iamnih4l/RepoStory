'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface CyberCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'lime' | 'violet' | 'amber';
  enableTilt?: boolean;
  hudTag?: string;
  onClick?: () => void;
}

export function CyberCard({
  children,
  className = '',
  glowColor = 'cyan',
  enableTilt = true,
  hudTag,
  onClick,
}: CyberCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const glowStyles = {
    cyan: 'border-cyan-500/25 hover:border-cyan-400/50 shadow-[0_4px_24px_rgba(0,240,255,0.06)] hover:shadow-[0_8px_32px_rgba(0,240,255,0.18)]',
    lime: 'border-lime-500/25 hover:border-lime-400/50 shadow-[0_4px_24px_rgba(57,255,20,0.06)] hover:shadow-[0_8px_32px_rgba(57,255,20,0.18)]',
    violet: 'border-purple-500/25 hover:border-purple-400/50 shadow-[0_4px_24px_rgba(168,85,247,0.06)] hover:shadow-[0_8px_32px_rgba(168,85,247,0.18)]',
    amber: 'border-amber-500/25 hover:border-amber-400/50 shadow-[0_4px_24px_rgba(245,158,11,0.06)] hover:shadow-[0_8px_32px_rgba(245,158,11,0.18)]',
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 5; // max 5deg tilt
    const rotY = ((x - centerX) / centerX) * 5;

    setRotateX(rotX);
    setRotateY(rotY);
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      className={`relative rounded-2xl bg-slate-900/60 backdrop-blur-xl border transition-all duration-200 ease-out overflow-hidden ${glowStyles[glowColor]} ${
        onClick ? 'cursor-pointer active:scale-[0.98]' : ''
      } ${className}`}
    >
      {/* Dynamic Specular Sheen on Hover */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-60 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 240, 255, 0.12), transparent 70%)`,
          }}
        />
      )}

      {/* Cyberpunk HUD Corner Accent Brackets */}
      <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 border-cyan-400/40 pointer-events-none" />
      <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 border-cyan-400/40 pointer-events-none" />
      <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-2 border-l-2 border-cyan-400/40 pointer-events-none" />
      <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-2 border-r-2 border-cyan-400/40 pointer-events-none" />

      {/* Optional HUD Telemetry Tag */}
      {hudTag && (
        <div className="absolute top-2.5 right-3 text-[9px] font-mono tracking-widest text-cyan-400/70 select-none pointer-events-none uppercase">
          [{hudTag}]
        </div>
      )}

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
