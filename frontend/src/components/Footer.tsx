export const Footer = ({ className = '' }: { className?: string }) => {
  return (
    <footer className={`bg-mt-color-1 flex items-center justify-center pt-20 pb-15 ${className}`}>
      <span className='text-xs'>©MapTold 2026</span>
    </footer>
  );
};
