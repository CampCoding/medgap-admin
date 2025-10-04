import React from "react";
import Card from "../atoms/Card";
import {
  Award,
  BookOpen,
  Check,
  CheckCheck,
  Clock,
  Cpu,
  Eye,
  FileText,
  Trophy,
  User,
  Users,
  XCircle,
} from "lucide-react";
import StatsCard from "./../ui/StatsCard";
import LineMatchingGame from "../drafts/Connect.draft";
import WordArrangementPuzzle from "../drafts/Drag.draft";

const ExamsStats = ({}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <StatsCard icon={FileText} value={12} label={"Total Exams"} />
      <StatsCard icon={CheckCheck} value={9} label={"Published"} />
      <StatsCard icon={Users} value={340} label={"Total Attempts"} />
      <StatsCard icon={Trophy} value={"79%"} label={"Avg Pass Rate"} />
    </div>
  );
};

export default ExamsStats;
