import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Add type declaration for the global moveTimeout property
declare global {
  interface Window {
    moveTimeout: ReturnType<typeof setTimeout> | undefined;
  }
}

interface TrailPoint {
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  id: number;
  animationDuration: number;
  depth: number;
  distortionLevel: number;
  timestamp: number;
}

const CursorTrail: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [trailPoints, setTrailPoints] = useState<TrailPoint[]>([]);
  const [isMoving, setIsMoving] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [nextId, setNextId] = useState(1); // Start with 1 instead of 0
  const [throttle, setThrottle] = useState(false);

  // Colors from our palette
  const primaryColor = useMemo(() => '#F3A146', []); // Sunset Gold
  const secondaryColor = useMemo(() => '#6FA5EE', []); // Creator Blue
  
  // Reset cursor effects
  const resetCursorEffects = useCallback(() => {
    setVelocity(0);
    setIsMoving(false);
    setTrailPoints([]);
  }, []);
  
  // Calculate velocity based on mouse movement
  const calculateVelocity = useCallback((x: number, y: number) => {
    const dx = x - lastMousePos.x;
    const dy = y - lastMousePos.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, [lastMousePos]);

  // Handle mouse move - optimized with throttling
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (throttle) return;
    
    setThrottle(true);
    setTimeout(() => setThrottle(false), 16); // ~60fps (1000ms / 60 ≈ 16ms)
    
    const { clientX, clientY } = e;
    
    // Calculate velocity
    const newVelocity = calculateVelocity(clientX, clientY);
    // Cap the velocity to prevent huge swirls after tab switching
    const cappedVelocity = Math.min(newVelocity, 100);
    setVelocity(cappedVelocity);
    setLastMousePos({ x: clientX, y: clientY });
    
    // Set cursor position
    setMousePosition({ x: clientX, y: clientY });
    setCursorVisible(true);
    
    // Indicate movement for animation effects
    setIsMoving(true);
    clearTimeout(window.moveTimeout);
    window.moveTimeout = setTimeout(() => setIsMoving(false), 100);
    
    // Reduce particle generation for better performance
    // Only generate particles based on velocity or at regular intervals (every 4th move)
    if (nextId % 4 === 0 || cappedVelocity > 35) {
      // Cap the size to prevent huge swirls
      const size = Math.max(20, Math.min(50, 20 + cappedVelocity * 0.5));
      const newPoint: TrailPoint = {
        x: clientX,
        y: clientY,
        size,
        color: Math.random() >= 0.5 ? secondaryColor : primaryColor, // Exactly 50/50 distribution
        opacity: Math.min(0.95, 0.65 + cappedVelocity * 0.005), // Increased opacity to 65% base, 95% max
        id: nextId,
        animationDuration: Math.max(0.8, 1.5 - cappedVelocity * 0.005),
        depth: 0, // Remove random depth for better performance
        distortionLevel: Math.min(5, Math.random() * 5), // Reduce distortion level
        timestamp: Date.now()
      };
      
      setTrailPoints(prevPoints => {
        // Keep only the last 25 points for better performance
        const newPoints = [...prevPoints, newPoint];
        if (newPoints.length > 25) {
          return newPoints.slice(newPoints.length - 25);
        }
        return newPoints;
      });
      
      // Always increment the ID to ensure uniqueness
      setNextId(prevId => prevId + 1);
    } else {
      // Increment ID even when not creating a point to maintain the modulo pattern
      setNextId(prevId => prevId + 1);
    }
    
  }, [calculateVelocity, lastMousePos, nextId, primaryColor, secondaryColor, throttle]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setCursorVisible(false);
  }, []);

  // Handle mouse enter
  const handleMouseEnter = useCallback(() => {
    setCursorVisible(true);
  }, []);
  
  // Handle visibility change - reset cursor effects when page regains focus
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'visible') {
      resetCursorEffects();
    }
  }, [resetCursorEffects]);
  
  // Handle window blur/focus events
  const handleWindowBlur = useCallback(() => {
    resetCursorEffects();
  }, [resetCursorEffects]);
  
  const handleWindowFocus = useCallback(() => {
    resetCursorEffects();
  }, [resetCursorEffects]);

  // Set up event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      clearTimeout(window.moveTimeout);
    };
  }, [handleMouseEnter, handleMouseLeave, handleMouseMove, handleVisibilityChange, handleWindowBlur, handleWindowFocus]);

  // Clean up expired trail points
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setTrailPoints(prevPoints => 
        prevPoints.filter(point => now - point.timestamp < 1800) // Remove points older than 1.8 seconds
      );
    }, 1000);
    
    return () => clearInterval(cleanup);
  }, []);

  return (
    <>
      {/* Main cursor dot */}
      <div 
        className="cursor-dot"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          opacity: cursorVisible ? 1 : 0,
          width: isMoving ? `${10 + Math.min(5, velocity * 0.1)}px` : '8px',
          height: isMoving ? `${10 + Math.min(5, velocity * 0.1)}px` : '8px',
          boxShadow: `0 0 ${6 + velocity * 0.1}px ${1 + velocity * 0.02}px ${primaryColor}`,
          backgroundColor: `rgba(243, 161, 70, 0.35)`, // More transparent glassy background
          backdropFilter: 'blur(2px)', // Added glass effect
          border: '1px solid rgba(243, 161, 70, 0.5)'
        }}
      />
      
      {/* Shimmer effect under cursor */}
      <div 
        className="cursor-shimmer"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          width: `${30 + velocity * 0.3}px`,
          height: `${30 + velocity * 0.3}px`,
          opacity: cursorVisible ? (0.2 + velocity * 0.005) : 0
        }}
      />
      
      {/* Trail particles - using a conditional render to limit number of particles */}
      {trailPoints.slice(-15).map((point) => (
        <div
          key={`trail-${point.id}`}
          id={`trail-${point.id}`}
          className="cursor-trail"
          style={{
            left: `${point.x}px`,
            top: `${point.y}px`,
            width: `${point.size}px`,
            height: `${point.size}px`,
            backgroundColor: point.color,
            opacity: point.opacity,
            animationDuration: `${point.animationDuration}s, 3s, 2s`,
            boxShadow: `0 0 ${5 + point.distortionLevel}px ${point.color}`,
            zIndex: 9998
          }}
        />
      ))}
    </>
  );
};

export default CursorTrail; 