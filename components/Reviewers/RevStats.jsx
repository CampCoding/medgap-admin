import React from "react";
import { BookOpen, Check, CheckCheck, Clock, Eye, FileText, User, Users, XCircle } from "lucide-react";
import StatsCard from "./../ui/StatsCard";

const RevsStats = ({ topics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <StatsCard icon={User} value={5} label={"Total Teachers"} />
      <StatsCard icon={CheckCheck  } value={2} label={"Approved"} />
      <StatsCard icon={Clock} value={2} label={"Pending"} />
      <StatsCard icon={XCircle} value={1} label={"Rejected"} />
    </div>
  );
};

export default RevsStats;
