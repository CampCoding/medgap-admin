import React, { useEffect } from "react";
import Card from "../atoms/Card";
import {
  FileText,
  CheckCircle,
  XCircle,
  Users,
  Eye,
  BarChart3,
  TrendingUp,
  Calendar,
  Award,
} from "lucide-react";
import StatsCard from "../ui/StatsCard";
import { useDispatch, useSelector } from "react-redux";
import { handleGetQuestionStatistics } from "../../features/questionsSlice";

const QuestionStats = () => {
  const dispatch = useDispatch();
  const { question_statistics_list, question_statistics_loading } = useSelector(
    (state) => state?.questions
  );

  useEffect(() => {
    dispatch(handleGetQuestionStatistics());
  }, [dispatch]);

  const stats = question_statistics_list?.data?.stats || {};

  // Top-level numbers
  const totalQuestions = Number(stats?.total_questions || 0);
  const totalUsage = Number(stats?.total_usage || 0);
  const avgUsage = Number(
    stats?.avg_usage_per_question != null ? stats.avg_usage_per_question : 0
  );
  const acceptanceRate = Number(
    stats?.overall_acceptance_rate != null ? stats.overall_acceptance_rate : 0
  );

  // Secondary tiles
  const activeQuestions = Number(stats?.active_questions || 0);
  const inactiveQuestions = Math.max(totalQuestions - activeQuestions, 0);
  const independentQuestions = Number(stats?.independent_questions || 0);
  const createdThisWeek = Number(stats?.created_this_week || 0);

  // Distributions
  const mcq = Number(stats?.multiple_choice_count || 0);
  const essay = Number(stats?.essay_count || 0);
  const tf = Number(stats?.true_false_count || 0);

  const easy = Number(stats?.easy_count || 0);
  const medium = Number(stats?.medium_count || 0);
  const hard = Number(stats?.hard_count || 0);

  const pct = (n) => (totalQuestions > 0 ? (n / totalQuestions) * 100 : 0);

  return (
    <div className="space-y-6">
      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard icon={FileText} value={totalQuestions} label="Total Questions" loading={question_statistics_loading} />
        <StatsCard icon={Eye} value={totalUsage} label="Total Usage" loading={question_statistics_loading} />
        <StatsCard icon={BarChart3} value={avgUsage.toFixed(2)} label="Avg Usage per Question" loading={question_statistics_loading} />
        <StatsCard icon={TrendingUp} value={`${acceptanceRate.toFixed(1)}%`} label="Acceptance Rate" loading={question_statistics_loading} />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#202938]">{activeQuestions}</p>
              <p className="text-sm text-[#202938]/60">Active</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#202938]">{inactiveQuestions}</p>
              <p className="text-sm text-[#202938]/60">Inactive</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#202938]">{independentQuestions}</p>
              <p className="text-sm text-[#202938]/60">Independent</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#202938]">{createdThisWeek}</p>
              <p className="text-sm text-[#202938]/60">Created This Week</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Type & Difficulty Distributions */}
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
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct(mcq)}%` }} />
                </div>
                <span className="text-sm font-medium text-[#202938]">{mcq}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#202938]/70">Essay</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${pct(essay)}%` }} />
                </div>
                <span className="text-sm font-medium text-[#202938]">{essay}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#202938]/70">True/False</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${pct(tf)}%` }} />
                </div>
                <span className="text-sm font-medium text-[#202938]">{tf}</span>
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
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${pct(easy)}%` }} />
                </div>
                <span className="text-sm font-medium text-[#202938]">{easy}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#202938]/70">Medium</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${pct(medium)}%` }} />
                </div>
                <span className="text-sm font-medium text-[#202938]">{medium}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#202938]/70">Hard</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${pct(hard)}%` }} />
                </div>
                <span className="text-sm font-medium text-[#202938]">{hard}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuestionStats;
