"use client";

import Link from "next/link";
import {
  Users,
  GraduationCap,
  FileText,
  Bell,
  Settings,
  BarChart3,
  BookOpen,
  ChevronDown,
  Book,
  Cog,
  LogOut,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { handleGetListModulesAvailable } from "../../../features/modulesSlice";

/**
 * Sidebar that supports subject switching using your modules payload:
 * {
 *   module_id: number,
 *   subject_name: string,     // e.g. "الرياضيات"
 *   subject_code: string,     // e.g. "MATH101" (used in route segments)
 *   subject_color: string
 * }
 *
 * - Query param ?subject=<subject_name> is maintained for easy reads on pages.
 * - Dynamic routes use /subjects/[subject_code]/... consistently.
 * - When user changes subject from dropdown while on a subject route, we swap the [subject_code]
 *   segment in-place and keep the rest of the path.
 */

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [notifications] = useState(3);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { list_module_available_loading, list_module_available } = useSelector(
    (state) => state?.modules
  );

  // Fetch modules
  useEffect(() => {
    dispatch(handleGetListModulesAvailable());
  }, [dispatch]);

  // Available modules from your payload
  const availableModules = list_module_available?.data?.modules || [];

  // --- Helpers ---------------------------------------------------------------

  // Resolve subject from either query (?subject=Name) or path (/subjects/[code]/...)
  const resolveSubjectFromURL = () => {
    const fromQuery = searchParams.get("subject");
    if (fromQuery) {
      const byName = availableModules.find((m) => m?.subject_name === fromQuery);
      if (byName) return byName;
    }

    // Try to resolve from dynamic path segment /subjects/[subject_code]
    const parts = pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("subjects");
    if (idx !== -1 && parts[idx + 1]) {
      const code = parts[idx + 1];
      const byCode = availableModules.find((m) => m?.subject_code === code);
      if (byCode) return byCode;
    }

    return null;
  };

  const baseMenuItems = [
    { name: "Overview", icon: BarChart3, path: "/" },
    { name: "Manage Modules", icon: BookOpen, path: "/subjects" },
    { name: "Manage Teachers", icon: Users, path: "/teachers" },
    { name: "Manage Reviewers", icon: UserCheck, path: "/reviewers" },
  ];


  useEffect(() =>{
    console.log(availableModules)
  } , [availableModules])
  // Subject-specific navs (use subject_code in the route)
  const getSubjectSpecificItems = (subjectName) => {
    if (!subjectName) return [];
    const subject = availableModules.find((m) => m?.subject_name === subjectName);
    console.log(subject , availableModules);
    if (!subject) return [];

    const subjectCode = subject?.module_id;
    return [
      { name: "Teachers", icon: Users, path: `/subjects/${subjectCode}/teachers` },
      { name: "Students", icon: GraduationCap, path: `/subjects/${subjectCode}/students` },
      // { name: "Exams", icon: FileText, path: `/subjects/${subjectCode}/exams` },
      // { name: "Manage", icon: Cog, path: `/subjects/${subjectCode}/units` },
    ];
  };

  // When changing subject from dropdown, also update the dynamic segment if present
  const handleSubjectChange = (subjectName) => {
    const subject = availableModules.find((m) => m.subject_name === subjectName);
    if (!subject) return;

    setSelectedSubject(subjectName);
    setIsSubjectDropdownOpen(false);

    const params = new URLSearchParams(searchParams.toString());
    params.set("subject", subjectName);

    const parts = pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("subjects");

    if (idx !== -1 && parts[idx + 1]) {
      // We are in a subject route → swap the code segment and preserve rest of path
      parts[idx + 1] = subject?.module_id;
      const newPath = `/${parts.join("/")}`;
      router.push(`${newPath}?${params.toString()}`);
    } else {
      // Not in subject route → just update the query
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  // Initialize selected subject from URL or default to first module
  useEffect(() => {
    if (!availableModules.length) return;

    const resolved = resolveSubjectFromURL();
    if (resolved) {
      setSelectedSubject(resolved.subject_name);

      // Ensure query reflects resolved subject
      const params = new URLSearchParams(searchParams.toString());
      if (params.get("subject") !== resolved.subject_name) {
        params.set("subject", resolved.subject_name);
        router.replace(`${pathname}?${params.toString()}`);
      }
      return;
    }

    // Fallback to first module
    const first = availableModules[0];
    if (first) {
      setSelectedSubject(first.subject_name);
      const params = new URLSearchParams(searchParams.toString());
      params.set("subject", first.subject_name);

      // If already on a /subjects/[code] page, keep you in-place but switch code
      const parts = pathname.split("/").filter(Boolean);
      const idx = parts.indexOf("subjects");
      if (idx !== -1 && parts[idx + 1]) {
        parts[idx + 1] = first?.module_id;
        const newPath = `/${parts.join("/")}`;
        router.replace(`${newPath}?${params.toString()}`);
      } else {
        router.replace(`${pathname}?${params.toString()}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableModules]);

  // Track active tab by current path
  useEffect(() => {
    const all = [...baseMenuItems, ...getSubjectSpecificItems(selectedSubject)];
    const exact = all.find((i) => pathname === i.path);

    if (exact) {
      setActiveTab(exact.name);
      return;
    }

    // Nested subject routes handling
    const parts = pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("subjects");
    if (idx !== -1) {
      const routeSegment = parts[idx + 2]; // e.g., 'teachers'
      switch (routeSegment) {
        case "teachers":
          setActiveTab("Teachers");
          break;
        case "students":
          setActiveTab("Students");
          break;
        case "exams":
          setActiveTab("Exams");
          break;
        case "units":
          setActiveTab("Manage");
          break;
        default:
          // If it's /subjects/[code] without a sub-route
          setActiveTab("Manage");
      }
    }
  }, [pathname, selectedSubject]);

  const menuItems = [
    { name: "Notifications", icon: Bell, badge: notifications, path: "/notifications" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  const selectedSubjectData = availableModules.find(
    (m) => m.subject_name === selectedSubject
  );
  const SelectedSubjectIcon = selectedSubjectData ? BookOpen : Book;

  // --- UI --------------------------------------------------------------------

  if (list_module_available_loading) {
    return (
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-100">
        <div className="p-6 border-b-2 border-accent/30 border-dashed">
          <div className="flex items-center">
            <div className="group flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-[#075260] via-[#075260] to-[#0793b0] rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
              </div>
              <span className="text-3xl font-black bg-gradient-to-r from-gray-900 via-[#075260] to-[#0793b0] bg-clip-text text-transparent">
                MedGap
              </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-100">
      <div className="p-6 border-b-2 border-accent/30 border-dashed">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="group flex items-center space-x-4 transition-transform duration-300 hover:scale-105"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#075260] via-[#075260] to-[#0793b0] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-[#075260] via-[#075260] to-[#0793b0] rounded-2xl opacity-20 blur-lg"></div>
            </div>
            <span className="text-3xl font-black bg-gradient-to-r from-gray-900 via-[#075260] to-[#0793b0] bg-clip-text text-transparent">
              MedGap
            </span>
          </Link>
        </div>
      </div>

      <nav className="mt-6 overflow-y-auto h-[calc(100vh-200px)] custom-scrollbar">
        {/* Top static navs */}
        <RenderNavs
          items={baseMenuItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedSubject={selectedSubject}
        />

        {/* Subject Selector */}
        {availableModules.length > 0 && (
          <div className="px-6 py-3">
            <div className="relative">
              <button
                onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all duration-200"
              >
                <div className="flex items-center">
                  <SelectedSubjectIcon className="w-5 h-5 mr-3 text-blue-600" />
                  <span className="font-medium text-gray-700 truncate">
                    {selectedSubject || "Select Subject"}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isSubjectDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isSubjectDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  {availableModules.map((module) => (
                    <button
                      key={module.module_id ?? module.subject_code ?? module.subject_name}
                      onClick={() => handleSubjectChange(module.subject_name)}
                      className={`w-full flex items-center px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors duration-150 ${
                        selectedSubject === module.subject_name
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      <span className="font-medium truncate">
                        {module.subject_name}
                      </span>
                      {selectedSubject === module.subject_name && (
                        <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subject-specific menu items */}
            {selectedSubject && (
              <RenderNavs
                items={getSubjectSpecificItems(selectedSubject)}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedSubject={selectedSubject}
              />
            )}
          </div>
        )}

        <hr />

        {/* Bottom menu */}
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              href={item.path}
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center px-6 py-3 text-left transition-all duration-200 hover:bg-gray-50 ${
                activeTab === item.name ? "border-r-3 bg-blue-50" : ""
              }`}
              style={{
                borderRightColor:
                  activeTab === item.name ? "#0F7490" : "transparent",
                color: activeTab === item.name ? "#0F7490" : "#202938",
              }}
            >
              <IconComponent className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.name}</span>
              {item.badge && (
                <span
                  className="ml-auto px-2 py-1 text-xs rounded-full text-white"
                  style={{ backgroundColor: "#075260" }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Logout */}
        <Link
          href={"/login"}
          className="absolute bottom-0 flex gap-3 text-center !bg-red-700/20 font-semibold items-center text-red-700 w-full p-4 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" /> Log Out
        </Link>
      </nav>
    </div>
  );
}

const RenderNavs = ({ items, setActiveTab, activeTab, selectedSubject }) => {
  return items.map((item) => {
    const IconComponent = item.icon;
    return (
      <Link
        href={{
          pathname: item.path,
          query: selectedSubject ? { subject: selectedSubject } : {},
        }}
        key={`${item.name}-${selectedSubject || "none"}`}
        onClick={() => setActiveTab(item.name)}
        className={`w-full flex items-center px-6 py-3 text-left transition-all duration-200 hover:bg-gray-50 ${
          activeTab === item.name ? "border-r-3 bg-blue-50 border-r-4" : ""
        }`}
        style={{
          borderRightColor: activeTab === item.name ? "#0F7490" : "transparent",
          color: activeTab === item.name ? "#0F7490" : "#202938",
        }}
      >
        <IconComponent className="w-5 h-5 mr-3" />
        <span className="font-medium">{item.name}</span>
        {item.badge && (
          <span
            className="ml-auto px-2 py-1 text-xs rounded-full text-white"
            style={{ backgroundColor: "#075260" }}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );
  });
};
