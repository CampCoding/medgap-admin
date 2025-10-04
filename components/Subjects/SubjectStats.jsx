import React from "react";
import Card from "../../components/atoms/Card";
import { 
  BookOpen, 
  BookCheck, 
  BookDashed, 
  BookX,
  Library,
  Users,
  FileText,
  FileQuestion,
  Eye 
} from "lucide-react";

// StatsCard component implementation
const StatsCard = ({ icon: Icon, value, label, color = "blue" }) => {
  const colorMap = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      value: "text-blue-700"
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
      value: "text-green-700"
    },
    orange: {
      bg: "bg-orange-100",
      text: "text-orange-600",
      value: "text-orange-700"
    },
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      value: "text-purple-700"
    },
    red: {
      bg: "bg-red-100",
      text: "text-red-600",
      value: "text-red-700"
    }
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <Card className="p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
        <div>
          <p className={`text-2xl font-bold ${colors.value}`}>
            {value !== undefined ? value : 0}
          </p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </Card>
  );
};

const SubjectsStats = ({ subjects }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        icon={Library}
        value={subjects?.total_modules}
        label="Total Modules"
        color="blue"
      />
      <StatsCard
        icon={BookCheck}
        value={subjects?.active_modules}
        label="Active Modules"
        color="green"
      />
      <StatsCard
        icon={BookDashed}
        value={subjects?.draft_modules}
        label="Draft Modules"
        color="orange"
      />
      <StatsCard
        icon={BookX}
        value={subjects?.inactive_modules}
        label="Inactive Modules"
        color="red"
      />
    </div>
  );
};

export default SubjectsStats;