import { useState, useEffect } from 'react';

export const useInput = () => {
  const [keys, setKeys] = useState({ forward: false, backward: false, left: false, right: false, jump: false });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['KeyW', 'ArrowUp'].includes(e.code)) setKeys((k) => ({ ...k, forward: true }));
      if (['KeyS', 'ArrowDown'].includes(e.code)) setKeys((k) => ({ ...k, backward: true }));
      if (['KeyA', 'ArrowLeft'].includes(e.code)) setKeys((k) => ({ ...k, left: true }));
      if (['KeyD', 'ArrowRight'].includes(e.code)) setKeys((k) => ({ ...k, right: true }));
      if (['Space'].includes(e.code)) setKeys((k) => ({ ...k, jump: true }));
    };

    const handleKeyUp = (e) => {
      if (['KeyW', 'ArrowUp'].includes(e.code)) setKeys((k) => ({ ...k, forward: false }));
      if (['KeyS', 'ArrowDown'].includes(e.code)) setKeys((k) => ({ ...k, backward: false }));
      if (['KeyA', 'ArrowLeft'].includes(e.code)) setKeys((k) => ({ ...k, left: false }));
      if (['KeyD', 'ArrowRight'].includes(e.code)) setKeys((k) => ({ ...k, right: false }));
      if (['Space'].includes(e.code)) setKeys((k) => ({ ...k, jump: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
};
