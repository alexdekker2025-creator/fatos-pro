'use client';

import { useEffect, useRef } from 'react';

export default function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Star class
    class Star {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      twinkleSpeed: number;
      twinkleDirection: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random();
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinkleDirection = Math.random() > 0.5 ? 1 : -1;
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x < 0) this.x = canvasWidth;
        if (this.x > canvasWidth) this.x = 0;
        if (this.y < 0) this.y = canvasHeight;
        if (this.y > canvasHeight) this.y = 0;

        // Twinkle effect
        this.opacity += this.twinkleSpeed * this.twinkleDirection;
        if (this.opacity <= 0.2 || this.opacity >= 1) {
          this.twinkleDirection *= -1;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      life: number;
      maxLife: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        
        // Purple/pink/blue colors
        const colors = [
          'rgba(168, 85, 247, ',  // purple
          'rgba(236, 72, 153, ',  // pink
          'rgba(59, 130, 246, ',  // blue
          'rgba(139, 92, 246, ',  // violet
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.maxLife = Math.random() * 100 + 100;
        this.life = this.maxLife;
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;

        // Wrap around screen
        if (this.x < 0) this.x = canvasWidth;
        if (this.x > canvasWidth) this.x = 0;
        if (this.y < 0) this.y = canvasHeight;
        if (this.y > canvasHeight) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        const opacity = this.life / this.maxLife;
        ctx.fillStyle = this.color + opacity + ')';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color + opacity + ')';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      isDead() {
        return this.life <= 0;
      }
    }

    // Interactive Particle - реагирует на мышь
    class InteractiveParticle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      color: string;
      symbol: string;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 4 + 2;
        
        // Golden/purple colors for arcana symbols
        const colors = [
          'rgba(255, 215, 0, ',   // gold
          'rgba(251, 191, 36, ',  // amber
          'rgba(168, 85, 247, ',  // purple
          'rgba(139, 92, 246, ',  // violet
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        // Arcana symbols
        const symbols = ['✦', '✧', '✨', '⭐', '🔮', '✴', '❂', '✵'];
        this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
      }

      update(mouseX: number, mouseY: number) {
        // Calculate distance from mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
          // Move away from mouse
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 5;
          this.y -= Math.sin(angle) * force * 5;
        } else {
          // Return to base position
          this.x += (this.baseX - this.x) * 0.05;
          this.y += (this.baseY - this.y) * 0.05;
        }
      }

      draw() {
        if (!ctx) return;
        
        // Draw symbol
        ctx.font = `${this.size * 4}px Arial`;
        ctx.fillStyle = this.color + '0.6)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color + '0.8)';
        ctx.fillText(this.symbol, this.x, this.y);
        ctx.shadowBlur = 0;
      }
    }

    // Create stars and particles
    const stars: Star[] = [];
    const particles: Particle[] = [];
    const interactiveParticles: InteractiveParticle[] = [];
    const starCount = 200;
    const particleCount = 50;
    const interactiveCount = 30;

    for (let i = 0; i < starCount; i++) {
      stars.push(new Star(canvas.width, canvas.height));
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }

    for (let i = 0; i < interactiveCount; i++) {
      interactiveParticles.push(new InteractiveParticle(canvas.width, canvas.height));
    }

    // Animation loop
    function animate() {
      if (!ctx || !canvas) return;
      
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(17, 24, 39, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw stars
      stars.forEach(star => {
        star.update(canvas.width, canvas.height);
        star.draw();
      });

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update(canvas.width, canvas.height);
        particles[i].draw();
        
        // Remove dead particles and create new ones
        if (particles[i].isDead()) {
          particles.splice(i, 1);
          particles.push(new Particle(canvas.width, canvas.height));
        }
      }

      // Update and draw interactive particles
      interactiveParticles.forEach(particle => {
        particle.update(mouseRef.current.x, mouseRef.current.y);
        particle.draw();
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}
