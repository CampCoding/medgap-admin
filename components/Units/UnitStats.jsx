import React from "react";
import Card from "../atoms/Card";
import { BookOpen, Eye, FileText, Users } from "lucide-react";
import StatsCard from "./../ui/StatsCard";
import LineMatchingGame from "../drafts/Connect.draft";
import WordArrangementPuzzle from "../drafts/Drag.draft";

const UnitsStats = ({ units }) => {
  const totalStudents = units.reduce(
    (sum, units) => sum + units.students,
    0
  );
  const totalQuestions = units.reduce(
    (sum, units) => sum + units.questions,
    0
  );

  return (

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <StatsCard
        icon={BookOpen}
        value={units.length}
        label={"Total Units"}
      />
      <StatsCard icon={Users} value={totalStudents} label={"Total Students"} />
      <StatsCard icon={FileText} value={totalQuestions} label={"Total Questions"} />

      
  
    </div>
  );
};

export default UnitsStats;
