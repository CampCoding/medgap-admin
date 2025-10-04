const Badge = ({ children, color = 'default', className = '' }) => {
  const colorClasses = {
    default: 'bg-gray-100 text-gray-800',
    blue: 'bg-[#0F7490]/10 text-[#0F7490]',
    gold: 'bg-[#C9AE6C]/10 text-[#C9AE6C]',
    purple: 'bg-[#8B5CF6]/10 text-[#8B5CF6]',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;