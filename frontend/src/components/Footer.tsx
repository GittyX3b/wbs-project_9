export const Footer = ({ className = '' }: { className?: string }) => {
  return (
    <footer className={`bg-mt-color-4 flex items-center justify-center ${className}`}>
      <span>©MapTold 2026</span>
    </footer>
  );
};
