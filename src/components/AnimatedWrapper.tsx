import React, { useState, useEffect } from 'react';

interface AnimatedWrapperProps {
  show: boolean;
  children: React.ReactNode;
  enterClass?: string;
  exitClass?: string;
  duration?: number;
}

const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({ 
  show, 
  children, 
  enterClass = 'smooth-entrance', 
  exitClass = 'smooth-exit', 
  duration = 300 
}) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      setAnimationClass(enterClass);
    } else if (shouldRender) {
      setAnimationClass(exitClass);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setAnimationClass('');
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, enterClass, exitClass, duration, shouldRender]);

  if (!shouldRender) return null;

  return <div className={animationClass}>{children}</div>;
};

export default AnimatedWrapper; 