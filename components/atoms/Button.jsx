const Button = ({
  children,
  type = "default",
  size = "default",
  className = "",
  onClick,
  disabled = false,
  loading = false,
  icon,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    default: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base",
  };
  const typeClasses = {
    primary:
      "bg-[#0F7490] hover:bg-[#0F7490]/90 text-white focus:ring-[#0F7490]/50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    secondary:
      "bg-[#C9AE6C] hover:bg-[#C9AE6C]/90 text-white focus:ring-[#C9AE6C]/50",
    accent:
      "bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white focus:ring-[#8B5CF6]/50",
    default:
      "bg-white hover:bg-gray-50 text-[#202938] border border-gray-200 focus:ring-gray-200",
    text: "bg-transparent hover:bg-gray-100 text-[#202938] focus:ring-gray-200",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-200",
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${typeClasses[type]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className={`${ children && "mr-2"}`}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
