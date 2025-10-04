import React, { useEffect } from "react";
import { 
  Users,
  UserCheck,
  Clock,
  UserX,
  Crown,
  UserCog,
  BookOpen,
  GraduationCap,
  Award,
  ShieldCheck
} from "lucide-react";
// import StatsCard from "./../ui/StatsCard";
import { useDispatch, useSelector } from "react-redux";
import { handleGetTeacherStatistics } from "../../features/teachersSlice";

const TeacherStats = ({role}) => {
  const dispatch = useDispatch();
  const { all_teacher_statistics, all_teacher_statistics_loading } = useSelector(state => state?.teachers);

  useEffect(() => {
    dispatch(handleGetTeacherStatistics());
  }, [dispatch]);

  // Get statistics from API response with fallbacks
  const stats = all_teacher_statistics?.data?.stats || {};
  
  const {
    total_teachers = 0,
    approved_teachers = 0,
    pending_teachers = 0,
    rejected_teachers = 0,
    heads_of_department = 0,
    assistants = 0
  } = stats;

  // If you want to show loading state
  if (all_teacher_statistics_loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-100 rounded-lg p-6 animate-pulse">
            <div className="h-8 w-8 bg-gray-300 rounded-full mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-6">
      {/* Total Teachers - Represents all teaching staff */}
      <StatsCard 
        icon={Users} 
        value={total_teachers} 
        label={`Total ${role =="reviewer" ? "Reviewers" : "Teachers"}`}
        iconColor="text-blue-600"
        bgColor="bg-blue-50"
        description="All teaching staff"
      />
      
      {/* Approved Teachers - Verified and active */}
      <StatsCard 
        icon={UserCheck} 
        value={approved_teachers} 
        label={"Approved"}
        iconColor="text-green-600"
        bgColor="bg-green-50"
        description={`Verified ${role == "reviewer" ?"Reviewers" :"Teachers"}`}
      />
      
      {/* Pending Teachers - Awaiting approval */}
      <StatsCard 
        icon={Clock} 
        value={pending_teachers} 
        label={"Pending Review"}
        iconColor="text-yellow-600"
        bgColor="bg-yellow-50"
        description="Awaiting approval"
      />
      
      {/* Rejected Teachers - Not approved */}
      <StatsCard 
        icon={UserX} 
        value={rejected_teachers} 
        label={"Rejected"}
        iconColor="text-red-600"
        bgColor="bg-red-50"
        description="Not approved"
      />
      
      {/* Heads of Department - Leadership roles */}
      <StatsCard 
        icon={Crown} 
        value={heads_of_department} 
        label={"Department Heads"}
        iconColor="text-purple-600"
        bgColor="bg-purple-50"
        description="Leadership roles"
      />
      
      {/* Assistants - Supporting teaching staff */}
      <StatsCard 
        icon={UserCog} 
        value={assistants} 
        label={"Teaching Assistants"}
        iconColor="text-indigo-600"
        bgColor="bg-indigo-50"
        description="Support staff"
      />
    </div>
  );
};

// If your StatsCard component doesn't support description, here's an enhanced version:
const EnhancedStatsCard = ({ icon: Icon, value, label, iconColor, bgColor, description }) => (
  <div className={`${bgColor} rounded-lg p-6 border border-gray-200`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <div className={`p-3 rounded-full ${bgColor.replace('bg-', 'bg-')}`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
    </div>
  </div>
);

export default TeacherStats;

// Updated StatsCard component (if you have access to modify it)
const StatsCard = ({ icon: Icon, value, label, iconColor = "text-blue-600", bgColor = "bg-blue-50", description }) => {
  return (
    <div className={`${bgColor} rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${bgColor} bg-opacity-50`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};