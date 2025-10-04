
const Card = ({ children, className = "", title, extra, ...props }) => (
  <div
    className={`bg-white rounded-xl border border-gray-100 shadow-sm ${className}`}
    {...props}
  >
    {title && (
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#202938]">{title}</h3>
        {extra && <div>{extra}</div>}
      </div>
    )}
    {children}
  </div>
);

export default Card;