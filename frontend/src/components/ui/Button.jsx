export const Button = ({ children, variant = 'gradient', className = '', disabled = false, onClick, type = 'button' }) => {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2';
  const variantClasses = variant === 'gradient' ? 'gradient-button' : 'outline-button';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
};
