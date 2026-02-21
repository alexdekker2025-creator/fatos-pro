'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
}

export default function MagicCursor() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let particleId = 0;
    let animationFrame: number;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Создаем новую частицу
      const colors = ['#a855f7', '#ec4899', '#8b5cf6', '#d946ef', '#fbbf24'];
      const newParticle: Particle = {
        id: particleId++,
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 8 + 4,
        opacity: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      setParticles((prev) => [...prev, newParticle]);
    };

    // Анимация частиц
    const animate = () => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            opacity: particle.opacity - 0.02,
            y: particle.y - 1,
            size: particle.size * 0.98,
          }))
          .filter((particle) => particle.opacity > 0)
      );

      animationFrame = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      {/* Магический курсор */}
      <div
        className="pointer-events-none fixed z-50 mix-blend-screen"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="relative">
          {/* Внешнее свечение */}
          <div className="absolute inset-0 w-8 h-8 bg-purple-500/30 rounded-full blur-xl animate-pulse"></div>
          {/* Внутреннее ядро */}
          <div className="absolute inset-0 w-4 h-4 bg-purple-400/50 rounded-full blur-sm"></div>
        </div>
      </div>

      {/* Частицы */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="pointer-events-none fixed z-40 mix-blend-screen"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Звездочка */}
          <svg
            viewBox="0 0 24 24"
            fill={particle.color}
            className="w-full h-full animate-spin-slow"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      ))}

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
      `}</style>
    </>
  );
}
