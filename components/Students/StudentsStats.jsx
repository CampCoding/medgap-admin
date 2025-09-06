import React from "react";
import Card from "../atoms/Card";
import {
  BookOpen,
  Check,
  CheckCheck,
  Clock,
  Eye,
  FileText,
  User,
  Users,
  XCircle,
} from "lucide-react";
import StatsCard from "./../ui/StatsCard";
import LineMatchingGame from "../drafts/Connect.draft";
import WordArrangementPuzzle from "../drafts/Drag.draft";

const StudentsStats = ({}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <StatsCard icon={User} value={5} label={"Total Students"} />
      <StatsCard icon={CheckCheck} value={2} label={"Active Students"} />
      <StatsCard icon={Clock} value={2} label={"Blocked Students"} />
    </div>
  );
};

export default StudentsStats;
