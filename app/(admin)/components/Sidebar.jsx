"use client";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  HelpCircle,
  FileText,
  Bell,
  Settings,
  BarChart3,
  TrendingUp,
  Award,
  Calendar,
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  BookOpen,
  ChevronDown,
  Book,
  Cog,
  LogOut,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { subjects } from "../../../data/subjects";

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [notifications, setNotifications] = useState(3);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0].name);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  const getSubjectFromParams = () => {
    const subjectParam = searchParams.get("subject");
    return subjects.find((s) => s.name === subjectParam);
  };
  const baseMenuItems = [
    { name: "Overview", icon: BarChart3, path: "/" },
    { name: "Manage Modules", icon: BookOpen, path: "/subjects" },
    { name: "Manage Teachers", icon: Users, path: "/teachers" },
    { name: "Manage Reviewers", icon: UserCheck, path: "/reviewers" },
  ];

  const getSubjectSpecificItems = (subjectName) => {
    const subject = subjects.find((s) => s.name === subjectName);
    const subjectPath = subject?.code;

    return [
      {
        name: "Teachers",
        icon: Users,
        path: `/subjects/${subjectPath}/teachers`,
      },
      {
        name: "Students",
        icon: GraduationCap,
        path: `/subjects/${subjectPath}/students`,
      },
      {
        name: "Exams",
        icon: FileText,
        path: `/subjects/${subjectPath}/exams`,
      },
      { name: "Manage", icon: Cog, path: `/subjects/${subjectPath}/units` },
    ];
  };

  const handleSubjectChange = (subjectName) => {
    const subject = subjects.find((s) => s.name === subjectName);
    if (!subject) return;

    setSelectedSubject(subjectName);
    setIsSubjectDropdownOpen(false);

    const params = new URLSearchParams(searchParams.toString());
    params.set("subject", subjectName);

    const pathSegments = pathname.split("/");
    const subjectIndex = pathSegments.findIndex((seg) => seg === "subjects");

    // Replace subject ID in path if present
    if (subjectIndex !== -1 && pathSegments.length > subjectIndex + 1) {
      pathSegments[subjectIndex + 1] = subject.code;

      // If currently inside a deeper unit/topic page (e.g., /units/Algebra/topics)
      const isInUnitsChildRoute =
        pathSegments[subjectIndex + 2] === "units" &&
        pathSegments.length > subjectIndex + 3;

      // 查找"subjects"在路径中的位置
      if (isInUnitsChildRoute) {
        // Go to clean units page
        router.replace(`/subjects/${subject.code}/units?${params.toString()}`);
        return;
      }
    }

    const newPath = pathSegments.join("/");
    router.replace(`${newPath}?${params.toString()}`);
  };

  const menuItem1 = [
    ...baseMenuItems,
    ...getSubjectSpecificItems(selectedSubject),
  ];

  const menuItems = [
    {
      name: "Notifications",
      icon: Bell,
      badge: notifications,
      path: "/notifications",
    },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  useEffect(() => {
    const currentItem = menuItem1.find((item) => pathname == item.path);

    if (currentItem) {
      setActiveTab(currentItem.name);
    }
  }, []);

  useEffect(() => {
    const subjectFromParams = getSubjectFromParams();
    if (subjectFromParams) {
      setSelectedSubject(subjectFromParams.name);
    } else {
      handleSubjectChange(subjects[0].name);
      const params = new URLSearchParams(searchParams.toString());
      params.set("subject", subjects[0].name);
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, pathname]);

  const selectedSubjectData = subjects.find((s) => s.name === selectedSubject);
  const SelectedSubjectIcon = selectedSubjectData?.icon || BookOpen;

  return (
    <div className="fixed left-0 top-0 h-full  w-64 bg-white shadow-lg border-r border-gray-100">
      <div className="p-6 border-b-2 border-accent/30 border-dashed">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="group flex items-center space-x-4 transition-transform duration-300 hover:scale-105"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-300 transform group-hover:rotate-3">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl opacity-20 group-hover:opacity-40 transition-all duration-300 blur-lg"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl group-hover:from-white/30 transition-all duration-300"></div>
            </div>
            <div>
              <span className="text-3xl font-black bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 bg-clip-text text-transparent">
                MedGap
              </span>
            </div>
          </Link>
        </div>
      </div>

      <nav className="mt-6 ">
        <RenderNavs
          items={baseMenuItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedSubject={selectedSubject}
        />

        {/* Subject Selector */}
        <div className="px-6 py-3 ">
          <div className="relative">
            <button
              onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all duration-200"
            >
              <div className="flex items-center">
                <SelectedSubjectIcon className="w-5 h-5 mr-3 text-blue-600" />
                <span className="font-medium text-gray-700 truncate">
                  {selectedSubject}
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
                {subjects.map((subject) => (
                  <button
                    key={subject.name}
                    onClick={() => handleSubjectChange(subject.name)}
                    className={`w-full flex items-center px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors duration-150 ${
                      selectedSubject === subject.name
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    <span className="font-medium">{subject.name}</span>
                    {selectedSubject === subject.name && (
                      <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <RenderNavs
            items={getSubjectSpecificItems(selectedSubject)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedSubject={selectedSubject}
          />
        </div>
        <hr />

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
                  style={{ backgroundColor: "#8B5CF6" }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
         <Link href={"/login"} className="absolute bottom-0 flex gap-3 text-center !bg-red-700/20 font-semibold  items-center text-red-700 w-full p-4 ">
          <LogOut /> Log Out
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
        key={`${item.name}-${selectedSubject}`}
        onClick={() => setActiveTab(item.name)}
        className={`w-full flex items-center px-6 py-3 text-left transition-all duration-200 hover:bg-gray-50 ${
          activeTab === item.name ? "border-r-3 bg-blue-50" : ""
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
            style={{ backgroundColor: "#8B5CF6" }}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );
  });
};
