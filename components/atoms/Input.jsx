const Input = ({ placeholder, prefix, className = '', ...props }) => (
  <div className="relative">
    {prefix && (
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {prefix}
      </div>
    )}
    <input
      className={`block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder-gray-500 focus:border-[#0F7490] focus:outline-none focus:ring-1 focus:ring-[#0F7490] ${prefix ? 'pl-10' : ''} ${className}`}
      placeholder={placeholder}
      {...props}
    />
  </div>
);

export default Input;