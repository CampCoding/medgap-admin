import React from "react";
import Card from "../atoms/Card";
import { BookOpen, Eye, FileText, Users } from "lucide-react";
import StatsCard from "./../ui/StatsCard";
import LineMatchingGame from "../drafts/Connect.draft";
import WordArrangementPuzzle from "../drafts/Drag.draft";

const TopicsStats = ({ topics }) => {
  const totalQuestions = topics.reduce((sum, units) => sum + units.questions, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <StatsCard icon={BookOpen} value={topics.length} label={"Total Topics"} />
      <StatsCard
        icon={FileText}
        value={totalQuestions}
        label={"Total Questions"}
      />
    </div>
  );
};

export default TopicsStats;
