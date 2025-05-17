import React, { useEffect, useRef } from 'react';

interface ParticleLoaderProps {
  isLoading: boolean;
}

const ParticleLoader: React.FC<ParticleLoaderProps> = ({ isLoading }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isLoading || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Define particles
    const particleCount = 300;
    const particles: Particle[] = [];
    
    // Brand colors from tailwind config
    const primaryColors = [
      '#a78bfa', // primary-400
      '#8b5cf6', // primary-500
      '#7c3aed', // primary-600
    ];
    
    const accentColors = [
      '#fdba74', // accent-300
      '#fb923c', // accent-400
      '#f97316', // accent-500
    ];
    
    // All colors to use
    const colors = [...primaryColors, ...accentColors];
    
    // Target positions to form "Harrpy" text
    const text = 'HARRPY';
    const textSize = Math.min(canvas.width / 8, 80);
    ctx.font = `bold ${textSize}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const textWidth = ctx.measureText(text).width;
    const textX = canvas.width / 2;
    const textY = canvas.height / 2;
    
    // Get pixel positions from text
    const textPositions: {x: number, y: number}[] = [];
    
    // Draw the text (temporarily)
    ctx.fillText(text, textX, textY);
    
    // Sample points from the text
    const imageData = ctx.getImageData(
      textX - textWidth / 2 - 10, 
      textY - textSize / 2 - 10,
      textWidth + 20,
      textSize + 20
    );
    
    // Clear the text
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Sample points from the text at regular intervals
    const sampleInterval = 4; // Adjust for more or fewer particles
    for (let y = 0; y < imageData.height; y += sampleInterval) {
      for (let x = 0; x < imageData.width; x += sampleInterval) {
        const idx = (y * imageData.width + x) * 4;
        // If pixel has any opacity, use it as a position
        if (imageData.data[idx + 3] > 0) {
          textPositions.push({
            x: textX - textWidth / 2 + x,
            y: textY - textSize / 2 + y
          });
        }
      }
    }
    
    // Class to represent a particle
    class Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      targetX: number;
      targetY: number;
      velocity: number;
      angle: number;
      gravity: number;
      friction: number;
      hasTarget: boolean;
      
      constructor() {
        // Start from random position around the screen
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        
        // Random size
        this.size = Math.random() * 3 + 1;
        
        // Random color from our palette
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        // Will be assigned target position later if needed
        this.targetX = 0;
        this.targetY = 0;
        
        // Physics properties
        this.velocity = Math.random() * 2 + 0.5;
        this.angle = Math.random() * Math.PI * 2;
        this.gravity = 0.03;
        this.friction = 0.95;
        
        // Flag to indicate if this particle has a target position
        this.hasTarget = false;
      }
      
      update() {
        // If we have a target, move towards it
        if (this.hasTarget) {
          // Calculate direction to target
          const dx = this.targetX - this.x;
          const dy = this.targetY - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // If we're close enough to target, slow down
          if (distance < 50) {
            this.velocity *= 0.9;
          }
          
          // Move towards target
          if (distance > 0.1) {
            this.x += (dx / distance) * this.velocity;
            this.y += (dy / distance) * this.velocity;
          }
        } else {
          // Random movement for particles without targets
          this.x += Math.cos(this.angle) * this.velocity;
          this.y += Math.sin(this.angle) * this.velocity + this.gravity;
          
          // Slightly change angle for organic movement
          this.angle += (Math.random() - 0.5) * 0.2;
          
          // Bounce off edges
          if (this.x < 0 || this.x > canvas.width) {
            this.angle = Math.PI - this.angle;
          }
          if (this.y < 0 || this.y > canvas.height) {
            this.angle = -this.angle;
            this.y = this.y < 0 ? 0 : canvas.height;
            this.velocity *= this.friction;
          }
        }
      }
      
      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      assignTarget(x: number, y: number) {
        this.targetX = x;
        this.targetY = y;
        this.hasTarget = true;
      }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Assign target positions to particles
    const assignTargets = () => {
      // First, make sure we don't assign more particles than targets
      const particlesToAssign = Math.min(particles.length, textPositions.length);
      
      // Shuffle particles to get a random selection
      const shuffledParticles = [...particles].sort(() => Math.random() - 0.5);
      
      // Assign targets to the first N particles
      for (let i = 0; i < particlesToAssign; i++) {
        shuffledParticles[i].assignTarget(
          textPositions[i].x + (Math.random() - 0.5) * 2, // Add slight variation
          textPositions[i].y + (Math.random() - 0.5) * 2
        );
      }
    };
    
    // Wait a short time before assigning targets for initial animation effect
    setTimeout(assignTargets, 700);
    
    // Animation loop
    const animate = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      // Continue animation loop
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFF5E9]/90 backdrop-blur-sm">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};

export default ParticleLoader; 