export const Input = ({ label, type = 'text', name, value, onChange, placeholder, required = false, error }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label} {required && <span className="text-accent-pink">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 bg-bg-secondary border border-white/10 rounded-lg text-white placeholder-text-secondary/50 focus:outline-none focus:border-accent-pink/50 focus:ring-2 focus:ring-accent-pink/20 transition-all"
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
};
