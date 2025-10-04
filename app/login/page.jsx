"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Clock,
  CheckCircle,
  Sparkles,
  Shield,
  Award,
  Heart,
  Activity,
  Zap,
} from "lucide-react";
import CheckBox from "../../components/ui/CheckBox";
import { useDispatch, useSelector } from "react-redux";
import { handleSubmitLogin } from "../../features/authSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { conifgs } from "../../config";

export default function LoginPage() {
  const dispatch = useDispatch();
  const {is_loading ,  login_data , login_error} = useSelector(state => state?.login)
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    specialization: "",
    experience: "",
    qualification: "",
  });
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [userData , setUserData] = useState({});
  const router = useRouter();


  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  // Track mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin =  () => {
    console.log(formData);
    const data_send = {
      admin_email : formData?.email ,
      admin_password : formData?.password
    }
    console.log(data_send);
    
     dispatch(handleSubmitLogin({body : data_send}))
     .unwrap()
     .then(res => {
      if(res?.status == "success") {
        toast.success(res?.message);
        setUserData(res?.data)
        Cookies.set("medgap_refresh_token" , res?.data?.refresh_token);
        localStorage.setItem(conifgs?.localStorageTokenName ,res?.data?.token);
        router.replace("/")
      }else {
        toast.error(res)
      }
     })
  };


  return (
    <div className="min-h-screen relative overflow-hidden py-12">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/10 via-white/5 to-purple-50/10"></div>

        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white/20 backdrop-blur-sm"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `float ${particle.duration}s infinite ease-in-out ${particle.delay}s`,
            }}
          />
        ))}

        {/* Interactive Gradient Orbs */}
        <div
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-3xl transition-all duration-1000 ease-out"
          style={{
            left: `${mousePosition.x * 0.1}%`,
            top: `${mousePosition.y * 0.1}%`,
          }}
        />
        <div
          className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-pink-400/20 to-blue-400/20 blur-3xl transition-all duration-1500 ease-out"
          style={{
            right: `${mousePosition.x * 0.05}%`,
            bottom: `${mousePosition.y * 0.05}%`,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-5xl w-full ">
          <div className="grid grid-cols-2 ">
            {/* Animated Logo Section */}
            <div className="text-center fixed top-1/2  -translate-y-1/2  flex items-center justify-center flex-col mb-8 animate-fade-in-up ">
              <div className="flex flex-col gap-3 items-center space-x-4 mb-6 group">
                <div className="relative transform transition-all duration-500 hover:scale-110">
                  <div className="w-36 h-36 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-blue-500/50 transition-all duration-500 animate-pulse-glow">
                    <span className="text-white font-bold text-7xl transform transition-transform duration-300 group-hover:rotate-12">
                      M
                    </span>
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-3xl opacity-20 blur-xl group-hover:opacity-40 transition-all duration-500"></div>
                  <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-sparkle" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-6xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-text-shimmer">
                    MedGap
                  </span>
                  <br />
                  <div className="text-3xl mt-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-text-shimmer">
                    Admin Panel
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Heart className="w-5 h-5 text-red-400 animate-heartbeat" />
                <p className="text-white/80 text-lg font-medium">
                  Medical Education Platform
                </p>
                <Activity className="w-5 h-5 text-green-400 animate-pulse" />
              </div>
            </div>
            <div></div>

            {/* Enhanced Main Card */}
            <div>
              {/* Enhanced Status Messages */}
              {registrationStatus === "pending" && (
                <div className="mb-6 p-6 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 border border-yellow-300/30 rounded-2xl backdrop-blur-lg animate-slide-in-down">
                  <div className="flex items-center">
                    <div className="relative">
                      <Clock className="w-6 h-6 text-yellow-300 animate-spin-slow" />
                      <div className="absolute inset-0 rounded-full bg-yellow-300/20 animate-ping"></div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-yellow-100 text-lg">
                        ⏳ Registration Pending
                      </h4>
                      <p className="text-yellow-200/80 text-sm">
                        Your application is being reviewed by our expert team.
                        You'll receive an email once approved!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {registrationStatus === "approved" && (
                <div className="mb-6 p-6 bg-gradient-to-r from-green-400/10 to-emerald-400/10 border border-green-300/30 rounded-2xl backdrop-blur-lg animate-slide-in-down">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-300 animate-bounce" />
                    <div className="ml-4">
                      <h4 className="font-bold text-green-100 text-lg">
                        🎉 Account Approved!
                      </h4>
                      <p className="text-green-200/80 text-sm">
                        Welcome aboard! You can now access all premium features.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-fade-in-up transform hover:scale-105 transition-all duration-500">
                {/* Enhanced Tab Navigation */}
                <div className="flex relative">
                  <div
                    className="absolute bottom-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-500 ease-out rounded-full"
                   
                  />
                  <button
                    onClick={() => setActiveTab("login")}
                    className={`flex-1 py-6 px-6 text-center font-bold transition-all duration-300 relative group ${
                      activeTab === "login"
                        ? "text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Shield
                        className={`w-5 h-5 transition-all duration-300 ${
                          activeTab === "login" ? "animate-bounce" : ""
                        }`}
                      />
                      <span>Sign In</span>
                    </div>
                  </button>
             
                </div>

                <div className="p-8">
                  <div className="space-y-6 animate-slide-in-left">
                      <div className="group">
                        <label className="  flex items-center gap-2 text-sm font-bold text-white/90 mb-3 group-focus-within:text-blue-300 transition-colors">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-white placeholder-white/50 backdrop-blur-sm hover:bg-white/15"
                            placeholder="Enter your email address"
                            required
                          />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-pink-400/0 group-focus-within:from-blue-400/20 group-focus-within:via-purple-400/10 group-focus-within:to-pink-400/20 transition-all duration-500 pointer-events-none"></div>
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-bold text-white/90 mb-3 group-focus-within:text-purple-300 transition-colors">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-14 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-white placeholder-white/50 backdrop-blur-sm hover:bg-white/15"
                            placeholder="Enter your password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5 animate-pulse" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/0 via-pink-400/0 to-blue-400/0 group-focus-within:from-purple-400/20 group-focus-within:via-pink-400/10 group-focus-within:to-blue-400/20 transition-all duration-500 pointer-events-none"></div>
                        </div>
                      </div>

                      {/* <div className="flex items-center justify-between animate-fade-in">
                        <label className="flex items-center group cursor-pointer">
                          <CheckBox />
                          <span className="ml-3 text-sm text-white/80 group-hover:text-white transition-colors">
                            Remember me
                          </span>
                        </label>
                        <a
                          href="#"
                          className="text-sm text-blue-300 hover:text-blue-200 transition-colors hover:underline"
                        >
                          Forgot password?
                        </a>
                      </div> */}

                      <button
                        type="button"
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-4 px-6 rounded-2xl font-bold hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:shadow-2xl relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        {is_loading ? (
                          <div className="flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                            <span className="animate-pulse">
                              Signing you in...
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Shield className="w-5 h-5 mr-2" />
                            <span>Sign In to MedGap</span>
                            <Zap className="w-4 h-4 ml-2 animate-flash" />
                          </div>
                        )}
                      </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" mt-10 bottom-0 left-0 right-0 z-10 flex justify-center items-center p-4 bg-blacsk/50 backdrop-blur-sm">
        {/* Enhanced Footer */}
        <div className="text-center m text-white/60 animate-fade-in-up">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Heart className="w-4 h-4 text-red-400 animate-heartbeat" />
            <p className="text-sm text-white">
              © {new Date().getFullYear()} MedGap. Empowering Medical Education
            </p>
            <Activity className="w-4 h-4 text-green-400 animate-pulse" />
          </div>
          <p className="text-xs">
            <a
              href="#"
              className="text-blue-300 hover:text-blue-200 transition-colors hover:underline"
            >
              Privacy Policy
            </a>
            {" • "}
            <a
              href="#"
              className="text-blue-300 hover:text-blue-200 transition-colors hover:underline"
            >
              Terms of Service
            </a>
            {" • "}
            <a
              href="#"
              className="text-blue-300 hover:text-blue-200 transition-colors hover:underline"
            >
              Support
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(90deg);
          }
          50% {
            transform: translateY(-40px) rotate(180deg);
          }
          75% {
            transform: translateY(-20px) rotate(270deg);
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(147, 51, 234, 0.5);
          }
        }

        @keyframes text-shimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes sparkle {
          0%,
          100% {
            opacity: 1;
            transform: rotate(0deg) scale(1);
          }
          50% {
            opacity: 0.5;
            transform: rotate(180deg) scale(1.2);
          }
        }

        @keyframes heartbeat {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes flash {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .animate-text-shimmer {
          background-size: 200% 200%;
          animation: text-shimmer 3s ease-in-out infinite;
        }

        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }

        .animate-heartbeat {
          animation: heartbeat 1.5s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-flash {
          animation: flash 1.5s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-slide-in-down {
          animation: slide-in-down 0.5s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
