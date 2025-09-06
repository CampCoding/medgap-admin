const TextArea = ({
  placeholder,
  className = "",
  label,
  required = false,
  rows = 4,
  ...props
}) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-medium text-[#202938]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <textarea
      className={`block w-full rounded-lg border border-gray-200 focus:border-[#0F7490] focus:ring-[#0F7490] bg-white px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors resize-none ${className}`}
      placeholder={placeholder}
      rows={rows}
      {...props}
    />
  </div>
);


export default TextArea;