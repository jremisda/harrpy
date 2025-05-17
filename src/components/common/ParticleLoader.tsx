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

    // Define particles - more particles for better text definition
    const particleCount = 600;
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
    
    // Define text to display
    const text = 'HARRPY';
    
    // Pre-defined letter paths (simplified coordinates for each letter)
    // These are coordinates that form the shape of each letter
    const letterCoordinates: Record<string, [number, number][]> = {
      'H': [
        [-30, -40], [-30, -20], [-30, 0], [-30, 20], [-30, 40], // left vertical line
        [-30, 0], [-20, 0], [-10, 0], [0, 0], [10, 0], [20, 0], [30, 0], // horizontal line
        [30, -40], [30, -20], [30, 0], [30, 20], [30, 40], // right vertical line
      ],
      'A': [
        [-30, 40], [-20, 20], [-10, 0], [-5, -20], [0, -40], // left diagonal
        [5, -20], [10, 0], [20, 20], [30, 40], // right diagonal
        [-15, 10], [-5, 10], [5, 10], [15, 10], // horizontal bar
      ],
      'R': [
        [-30, -40], [-30, -20], [-30, 0], [-30, 20], [-30, 40], // left vertical line
        [-30, -40], [-20, -40], [-10, -40], [0, -40], [10, -40], [20, -35], // top horizontal
        [25, -30], [30, -20], [30, -10], [25, 0], [20, 5], // curve down
        [10, 5], [0, 5], [-10, 5], [-20, 5], [-30, 5], // middle horizontal
        [0, 5], [10, 15], [20, 25], [30, 40], // right diagonal down
      ],
      'P': [
        [-30, -40], [-30, -20], [-30, 0], [-30, 20], [-30, 40], // left vertical line
        [-30, -40], [-20, -40], [-10, -40], [0, -40], [10, -40], [20, -35], // top horizontal
        [25, -30], [30, -20], [30, -10], [25, 0], [20, 5], // curve
        [10, 5], [0, 5], [-10, 5], [-20, 5], [-30, 5], // bottom horizontal
      ],
      'Y': [
        [-30, -40], [-20, -30], [-10, -20], [0, -10], // top left diagonal
        [10, -20], [20, -30], [30, -40], // top right diagonal
        [0, -10], [0, 0], [0, 10], [0, 20], [0, 40], // vertical line
      ],
    };
    
    // Calculate actual positions for letters in the text
    const getTextPositions = () => {
      const positions: [number, number][] = [];
      const letterWidth = 70; // Width of each letter
      const totalWidth = text.length * letterWidth;
      const startX = canvas.width / 2 - totalWidth / 2 + letterWidth / 2;
      const centerY = canvas.height / 2;
      
      // For each letter in the text
      for (let i = 0; i < text.length; i++) {
        const letter = text[i];
        const letterX = startX + i * letterWidth;
        
        // Get the coordinates for this letter
        if (letterCoordinates[letter]) {
          for (const [x, y] of letterCoordinates[letter]) {
            positions.push([letterX + x, centerY + y]);
          }
        } else {
          // Fallback for letters not defined - just make a grid of points
          for (let x = -30; x <= 30; x += 10) {
            for (let y = -40; y <= 40; y += 10) {
              positions.push([letterX + x, centerY + y]);
            }
          }
        }
      }
      
      return positions;
    };
    
    // Class to represent a particle
    class Particle {
      x: number;
      y: number;
      size: number;
      baseSize: number;
      color: string;
      targetX: number;
      targetY: number;
      vx: number;
      vy: number;
      friction: number;
      inPosition: boolean;
      phase: 'random' | 'approaching' | 'positioned';
      
      constructor() {
        // Start from random position
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        
        // Size properties
        this.baseSize = Math.random() * 3 + 3;
        this.size = this.baseSize;
        
        // Random color from our palette
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        // Target position (set later)
        this.targetX = 0;
        this.targetY = 0;
        
        // Velocity components
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        
        // Physics
        this.friction = 0.95;
        
        // State flags
        this.inPosition = false;
        this.phase = 'random';
      }
      
      update() {
        if (this.phase === 'random') {
          // Random movement in initial phase
          this.x += this.vx;
          this.y += this.vy;
          
          // Boundary check and bounce
          if (this.x < 0 || this.x > canvas.width) {
            this.vx *= -1;
          }
          if (this.y < 0 || this.y > canvas.height) {
            this.vy *= -1;
          }
          
          // Slowly reduce velocity
          this.vx *= 0.99;
          this.vy *= 0.99;
          
        } else if (this.phase === 'approaching') {
          // Calculate distance to target
          const dx = this.targetX - this.x;
          const dy = this.targetY - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Move towards target at a speed proportional to distance
          // but capped to ensure smooth movement
          const speed = Math.min(distance * 0.05, 3);
          
          if (distance > 0.5) {
            this.x += (dx / distance) * speed;
            this.y += (dy / distance) * speed;
          } else {
            // Arrived at target position
            this.phase = 'positioned';
            this.inPosition = true;
            this.size = this.baseSize * 1.5; // Grow a bit when positioned
          }
        } else {
          // Small random movement when in final position
          this.x += (Math.random() - 0.5) * 0.5;
          this.y += (Math.random() - 0.5) * 0.5;
          
          // Stay close to target
          this.x = this.x * 0.9 + this.targetX * 0.1;
          this.y = this.y * 0.9 + this.targetY * 0.1;
        }
      }
      
      draw() {
        if (!ctx) return;
        
        ctx.globalAlpha = this.phase === 'positioned' ? 1 : 0.8;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      
      assignTarget(x: number, y: number) {
        this.targetX = x;
        this.targetY = y;
        this.phase = 'approaching';
      }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Animation phases
    let phase = 0;
    const phases = [
      { name: 'random', duration: 2000 },
      { name: 'text', duration: 4000 },
    ];
    let phaseStartTime = Date.now();
    let animationFrame: number;
    
    // Animation loop
    const animate = () => {
      if (!ctx) return;
      
      // Clear canvas with slight transparency for trail effect
      ctx.fillStyle = 'rgba(255, 245, 233, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Check phase timing
      const now = Date.now();
      const phaseElapsed = now - phaseStartTime;
      
      if (phase === 0 && phaseElapsed >= phases[0].duration) {
        // Move to text phase
        phase = 1;
        phaseStartTime = now;
        
        // Calculate text positions
        const textPositions = getTextPositions();
        
        // Assign targets to particles
        const particlesToAssign = Math.min(particles.length, textPositions.length);
        for (let i = 0; i < particlesToAssign; i++) {
          particles[i].assignTarget(textPositions[i][0], textPositions[i][1]);
        }
      }
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      // Draw loading text below the particle animation
      ctx.fillStyle = '#333';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Loading experience...', canvas.width / 2, canvas.height / 2 + 80);
      
      // Continue animation
      animationFrame = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFF5E9] backdrop-blur-sm">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};

export default ParticleLoader; 