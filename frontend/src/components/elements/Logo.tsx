import maptoldIcon from '@assets/images/maptold-icon.png';
import maptoldLogo from '@assets/images/maptold-logo.png';

export const App_Icon = ({ className = '' }: { className?: string }) => {
  return (
    <img
      src={maptoldIcon}
      alt='MapTold Icon'
      className={`pointer-events-none h-full select-none ${className}`}
    />
  );
};

export const App_Logo = ({ className = '' }: { className?: string }) => {
  return (
    <img
      src={maptoldLogo}
      alt='MapTold Logo'
      className={`pointer-events-none select-none ${className}`}
    />
  );
};
