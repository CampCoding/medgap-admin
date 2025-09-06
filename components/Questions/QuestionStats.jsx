import React from "react";
import Card from "../atoms/Card";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock3,
  Eye,
  BarChart3,
  Users,
  TrendingUp,
  Calendar,
  Award,
} from "lucide-react";
import StatsCard from "../ui/StatsCard";

const QuestionStats = ({ questions }) => {
  // Calculate basic statistics
  const totalQuestions = questions.length;
  const totalUsage = questions.reduce((sum, question) => sum + question.usageCount, 0);
  const avgUsage = totalQuestions > 0 ? Math.round(totalUsage / totalQuestions) : 0;

  // Calculate review statistics
  const acceptedQuestions = questions.filter(q => q.reviewStatus === 'accepted').length;
  const rejectedQuestions = questions.filter(q => q.reviewStatus === 'rejected').length;
  const pendingQuestions = questions.filter(q => q.reviewStatus === 'pending').length;
  
  // Calculate question type distribution
  const mcqQuestions = questions.filter(q => q.type === 'MCQ').length;
  const essayQuestions = questions.filter(q => q.type === 'Essay').length;
  const trueFalseQuestions = questions.filter(q => q.type === 'True/False').length;

  // Calculate difficulty distribution
  const easyQuestions = questions.filter(q => q.difficulty === 'Easy').length;
  const mediumQuestions = questions.filter(q => q.difficulty === 'Medium').length;
  const hardQuestions = questions.filter(q => q.difficulty === 'Hard').length;

  // Calculate acceptance rate
  const reviewedQuestions = acceptedQuestions + rejectedQuestions;
  const acceptanceRate = reviewedQuestions > 0 ? Math.round((acceptedQuestions / reviewedQuestions) * 100) : 0;

  // Get most recent question creation date
  const recentlyCreated = questions.filter(q => {
    const questionDate = new Date(q.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return questionDate >= weekAgo;
  }).length;

  return (
    <div className="space-y-6">
      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          icon={FileText}
          value={totalQuestions}
          label="Total Questions"
        />
        <StatsCard
          icon={Eye}
          value={totalUsage}
          label="Total Usage"
        />
        <StatsCard
          icon={BarChart3}
          value={avgUsage}
          label="Avg Usage per Question"
        />
        <StatsCard
          icon={TrendingUp}
          value={`${acceptanceRate}%`}
          label="Acceptance Rate"
        />
      </div>

      {/* Review Status Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#202938]">{acceptedQuestions}</p>
              <p className="text-sm text-[#202938]/60">Accepted</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#202938]">{rejectedQuestions}</p>
              <p className="text-sm text-[#202938]/60">Rejected</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock3 className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#202938]">{pendingQuestions}</p>
              <p className="text-sm text-[#202938]/60">Pending Review</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#202938]">{recentlyCreated}</p>
              <p className="text-sm text-[#202938]/60">Created This Week</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Question Type & Difficulty Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Question Types */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[#202938] mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-[#0F7490]" />
            Question Types
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#202938]/70">Multiple Choice (MCQ)</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${totalQuestions > 0 ? (mcqQuestions / totalQuestions) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-[#202938]">{mcqQuestions}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#202938]/70">Essay Questions</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full" 
                    style={{ width: `${totalQuestions > 0 ? (essayQuestions / totalQuestions) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-[#202938]">{essayQuestions}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#202938]/70">True/False</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 rounded-full" 
                    style={{ width: `${totalQuestions > 0 ? (trueFalseQuestions / totalQuestions) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-[#202938]">{trueFalseQuestions}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Difficulty Levels */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[#202938] mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-[#0F7490]" />
            Difficulty Levels
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#202938]/70">Easy</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: `${totalQuestions > 0 ? (easyQuestions / totalQuestions) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-[#202938]">{easyQuestions}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#202938]/70">Medium</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 rounded-full" 
                    style={{ width: `${totalQuestions > 0 ? (mediumQuestions / totalQuestions) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-[#202938]">{mediumQuestions}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#202938]/70">Hard</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full" 
                    style={{ width: `${totalQuestions > 0 ? (hardQuestions / totalQuestions) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-[#202938]">{hardQuestions}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuestionStats;
