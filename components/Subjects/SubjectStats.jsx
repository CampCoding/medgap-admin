import React from "react";
import Card from "../atoms/Card";
import { BookOpen, Eye, FileText, Users } from "lucide-react";
import StatsCard from "../ui/StatsCard";
import LineMatchingGame from "../drafts/Connect.draft";
import WordArrangementPuzzle from "../drafts/Drag.draft";

const SubjectsStats = ({ subjects }) => {
  const totalStudents = subjects.reduce(
    (sum, subject) => sum + subject.students,
    0
  );
  const totalQuestions = subjects.reduce(
    (sum, subject) => sum + subject.questions,
    0
  );
  const activeSubjects = subjects.filter((s) => s.status === "active").length;

  return (

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <StatsCard
        icon={BookOpen}
        value={subjects.length}
        label={"Total Modules"}
      />
      <StatsCard icon={Users} value={totalStudents} label={"Total Students"} />
      <StatsCard icon={FileText} value={totalQuestions} label={"Total Questions"} />

      
  
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Eye className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#202938]">
              {activeSubjects}
            </p>
            <p className="text-sm text-[#202938]/60">Active Modules</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SubjectsStats;
