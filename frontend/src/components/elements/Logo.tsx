import maptoldIcon from '@assets/images/maptold-icon.png';
import maptoldLogo from '@assets/images/maptold-icon.png';

export const App_Icon = ({ className = '' }: { className?: string }) => {
  return <img src={maptoldIcon} alt='MapTold Icon' className={`h-full ${className}`} />;
};

export const App_Logo = () => {
  return <img src={maptoldLogo} alt='MapTold Logo' />;
};
