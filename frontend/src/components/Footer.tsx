export const Footer = ({ className = '' }: { className?: string }) => {
  return (
    <footer className={`bg-mt-color-1 flex items-center justify-center pt-50 pb-20 ${className}`}>
      <span className='text-xs'>©MapTold 2026</span>
    </footer>
  );
};
