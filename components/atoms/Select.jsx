





const Select = ({ placeholder, options = [], className = "", onChange, ...props }) => (
  <select
    className={`block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#0F7490] focus:outline-none focus:ring-1 focus:ring-[#0F7490] ${className}`}
    onChange={onChange}
    {...props}
  >
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);


export default Select;