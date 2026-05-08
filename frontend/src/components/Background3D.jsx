import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Background3D = ({ opacity = 1 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create bubbles
    const bubbleCount = 15;
    const bubbles = [];

    const colors = ['#FFDAB9', '#A67B5B', '#FFF8F0'];

    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        // Random size between 50px and 250px
        const size = Math.random() * 200 + 50;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        // Random starting position
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.top = `${Math.random() * 100}%`;
        
        // Initial opacity and color
        const color = colors[Math.floor(Math.random() * colors.length)];
        bubble.style.background = `radial-gradient(circle at 30% 30%, ${color}33, ${color}11)`;
        bubble.style.opacity = (Math.random() * 0.2 + 0.05).toString();
        
        container.appendChild(bubble);
        bubbles.push(bubble);
        
        // GSAP Animation for each bubble
        gsap.to(bubble, {
            x: `random(-150, 150)`,
            y: `random(-150, 150)`,
            rotation: `random(-180, 180)`,
            duration: `random(15, 30)`,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        // Pulsing scale
        gsap.to(bubble, {
            scale: `random(0.7, 1.3)`,
            duration: `random(4, 7)`,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    return () => {
        bubbles.forEach(b => b.remove());
    };
  }, []);

  return (
    <div 
        ref={containerRef}
        className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#2E1F13]"
        style={{ opacity }}
    >
        {/* Subtle radial lights */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#A67B5B]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#FFDAB9]/5 rounded-full blur-[150px]" />
    </div>
  );
};

export default Background3D;
