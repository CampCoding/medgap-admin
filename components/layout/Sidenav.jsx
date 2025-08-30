import { useState, useEffect } from "react";
import {
  Home,
  BookOpen,
  Settings,
  MessageCircle,
  Bell,
  X,
  ChevronRight,
  Sparkles,
  Phone,
  Pencil,
  GraduationCap,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav({ isOpen, setIsOpen }) {
  const [activeItem, setActiveItem] = useState("Home");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent scrolling when sidenav is open
    } else {
      document.body.style.overflow = "auto"; // Allow scrolling when sidenav is closed
    }
  }, [isOpen]);

  const menuItems = [
    {
      id: "Home",
      label: "Home",
      path:"/",
      icon: Home,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "About Us",
      label: "About Us",
      path:"/about-us",
      icon: BookOpen,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "Contact Us",
      label: "Contact Us",
      path:"/contact-us",
      icon: Phone, // Changed from PenTool to Phone (more suitable for contact)
      color: "from-purple-500 to-indigo-500",
    },
    {
      id: "Blog",
      label: "Blog",
      icon: Pencil, // Changed from Headphones to Pencil (more suitable for blog posts)
      color: "from-orange-500 to-red-500",
      arabic: "ممارسة التحدث",
      path:"/blogs",
    },
    {
      id: "Courses",
      label: "Courses",
      icon: GraduationCap, // Changed from Video to GraduationCap (better for learning/courses)
      color: "from-pink-500 to-rose-500",
      path:"/courses",
    },
  ];

  const bottomItems = [
    { id: "messages", label: "Messages", icon: MessageCircle, badge: "5" },
    { id: "notifications", label: "Notifications", icon: Bell, badge: "2" },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const pathname = usePathname()

  useEffect(() => {
    // Set active item based on current pathname
    const currentPath = pathname.split("/")[1] || "Home"; // Default to "Home" if no path
    const activeMenuItem = menuItems.find(item => item.path === `/${currentPath}`);
    if (activeMenuItem) {
      setActiveItem(activeMenuItem.id);
    } else {
      setActiveItem("Home");
    }



  } , [pathname])

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed z-[9999] inset-0  bg-black bg-opacity-50  md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Toggle Button */}
      {/* <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button> */}

      {/* Side Navigation */}
      <nav
        className={`fixed left-0 top-0 h-full  bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-100 z-[999999] transition-all duration-500 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isOpen ? "w-80" : "w-20"} shadow-2xl`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 text-6xl text-teal-400 animate-pulse">
            عربي
          </div>
          <div className="absolute bottom-40 left-10 text-4xl text-cyan-400 animate-bounce delay-1000">
            لغة
          </div>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 3}s`,
              }}
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
            </div>
          ))}
        </div>

        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-700 bg-white">
            <div className="flex items-center space-x-4">
              <div className="relative flex items-center justify-between w-full">
                <img src="/images/logo.png" className="w-[50px] " alt="" />
                <X onClick={() => setIsOpen(false)} />
              </div>
            </div>
          </div>

          {/* Search */}

          {/* Main Menu */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <Link
                href={item.path}
                  key={item.id}
                  className={`relative group transition-all duration-300 transform hover:scale-105 ${
                    activeItem === item.id ? "scale-105" : ""
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => {
                    setActiveItem(item.id)
                    setIsOpen(false); // Close sidenav on item click
                  }}
                >
                  {/* Active indicator */}
                  {activeItem === item.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-400 to-cyan-500 rounded-r-full animate-pulse"></div>
                  )}

                  <div
                    className={`relative flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                      activeItem === item.id
                        ? "bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-400/30"
                        : "hover:bg-slate-800 border border-transparent"
                    }`}
                  >
                    {/* Icon with gradient background */}
                    <div
                      className={`relative p-3 rounded-xl bg-gradient-to-r ${
                        item.color
                      } shadow-lg group-hover:shadow-xl transition-all duration-300 ${
                        hoveredItem === item.id ? "scale-110" : ""
                      }`}
                    >
                      <item.icon className="w-5 h-5 text-white" />
                      {item.badge && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold animate-bounce">
                          {item.badge}
                        </div>
                      )}
                    </div>

                    {isOpen && (
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-medium transition-colors duration-300 ${
                              activeItem === item.id
                                ? "text-primary"
                                : "text-primary group-hover:text-teal-300"
                            }`}
                          >
                            {item.label}
                          </span>
                          {hoveredItem === item.id && (
                            <ChevronRight className="w-4 h-4 text-teal-400 animate-pulse" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Hover effect */}
                    {hoveredItem === item.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-2xl animate-pulse"></div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom Menu */}
          {isOpen && (
            <div className="p-4 border-t border-slate-700">
              <div className=" space-x-3 flex items-center justify-between">
                {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
                  <div
                    key={index}
                    className="w-11 h-11 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer group"
                  >
                    <Icon className="w-4 h-4 text-white group-hover:animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      <style jsx>{`
        @font-face {
          font-family: "Arabic";
          src: url("https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap");
        }
        .font-arabic {
          font-family: "Amiri", serif;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(180deg);
          }
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
