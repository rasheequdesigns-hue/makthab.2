import { Html } from '@react-three/drei';
import { useStore } from '../store/useStore';
import { useRef, useEffect } from 'react';
import { X } from 'lucide-react';

const MobileJoystick = () => {
  const setJoystickValues = useStore((state) => state.setJoystickValues);
  const joystickRef = useRef(null);

  useEffect(() => {
    const el = joystickRef.current;
    if (!el) return;

    let isDragging = false;
    let centerX = 0;
    let centerY = 0;
    let touchId = null;

    const handleStart = (e) => {
      isDragging = true;
      const t = e.changedTouches ? e.changedTouches[0] : e;
      touchId = t.identifier;
      const rect = el.getBoundingClientRect();
      centerX = rect.left + rect.width / 2;
      centerY = rect.top + rect.height / 2;
      updateJoystick(t.clientX, t.clientY);
    };

    const handleMove = (e) => {
      if (!isDragging) return;
      let t = e;
      if (e.changedTouches) {
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === touchId) {
            t = e.changedTouches[i];
            break;
          }
        }
      }
      if (t.clientX) updateJoystick(t.clientX, t.clientY);
    };

    const handleEnd = (e) => {
      if (!isDragging) return;
      if (e.changedTouches && touchId !== null) {
        let isOurTouch = false;
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === touchId) isOurTouch = true;
        }
        if (!isOurTouch) return;
      }
      isDragging = false;
      touchId = null;
      setJoystickValues({ x: 0, y: 0 });
      el.children[0].style.transform = `translate(-50%, -50%)`;
    };

    const updateJoystick = (clientX, clientY) => {
      const maxDist = 50;
      let dx = clientX - centerX;
      let dy = clientY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > maxDist) {
        dx = (dx / dist) * maxDist;
        dy = (dy / dist) * maxDist;
      }
      
      const thumb = el.children[0];
      thumb.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
      
      setJoystickValues({ x: dx / maxDist, y: dy / maxDist });
    };

    el.addEventListener('touchstart', handleStart);
    el.addEventListener('touchmove', handleMove);
    el.addEventListener('touchend', handleEnd);
    el.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    return () => {
       el.removeEventListener('touchstart', handleStart);
       el.removeEventListener('touchmove', handleMove);
       el.removeEventListener('touchend', handleEnd);
       el.removeEventListener('mousedown', handleStart);
       window.removeEventListener('mousemove', handleMove);
       window.removeEventListener('mouseup', handleEnd);
    };
  }, [setJoystickValues]);

  return (
    <div className="joystick-base" ref={joystickRef}>
      <div className="joystick-thumb"></div>
    </div>
  );
};

export const UIOverlay = () => {
  const currentZone = useStore((state) => state.currentZone);
  const setCurrentZone = useStore((state) => state.setCurrentZone);

  return (
    <Html center zIndexRange={[100, 0]}>
      <div className="ui-overlay-container pointer-events-none" style={{ position: 'fixed', top: '-50vh', left: '-50vw', width: '100vw', height: '100vh' }}>
        <div className="ui-root">
        
        {currentZone && (
          <div className="glass-modal pointer-events-auto">
            <button className="close-btn" onClick={() => setCurrentZone(null)}>
              <X size={24} />
            </button>
            <h1 className="zone-title">{currentZone}</h1>
            
            {currentZone === 'Design Island' && (
               <p>Welcome to Kagazi and Studio.qo. I craft high-fidelity digital branding and 3D product visual identities combining futuristic and pixel-perfect geometry.</p>
            )}
            {currentZone === 'Dev Island' && (
               <p>Explore Payfolio and DesignLink. Translating cutting-edge Figma prototypes into optimized, scalable React and Three.js frontend applications.</p>
            )}
            {currentZone === 'The Tunnel' && (
               <p>Entering the 200sqft immersive Exhibition Tunnel. Feel free to accelerate and experience the transition.</p>
            )}
          </div>
        )}

        {/* Mobile touch controls */}
        <div className="mobile-controls pointer-events-auto">
           <MobileJoystick />
        </div>
      </div>
      </div>
    </Html>
  );
};
