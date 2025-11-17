'use client';

import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleGetFlashcardStatistics } from '../../features/flashcardsSlice';
import {
  LibraryBig,
  Layers,
  Clock,
  BookOpen,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Target,
  Award,
  Activity
} from 'lucide-react';

export default function FlashCardStatistics() {
  const dispatch = useDispatch();

  // Grab data from Redux
  const {
    flashcards_statistics_loading,
    flashcard_statics,
    flashcards_statistics_error,
  } = useSelector((state) => state?.flashcards || {});

  useEffect(() => {
    dispatch(handleGetFlashcardStatistics());
  }, [dispatch]);

  // Extract stats safely from the API shape you showed
  const stats = flashcard_statics?.data?.stats || {};

  const {
    total_libraries = 0,
    active_libraries = 0,
    draft_libraries = 0,
    inactive_libraries = 0,
    created_this_week = 0,
    total_cards = 0,
    easy_libraries = 0,
    medium_libraries = 0,
    hard_libraries = 0,
    avg_estimated_time = 0,
  } = stats;

  const isLoading = !!flashcards_statistics_loading;
  const error = flashcards_statistics_error || flashcard_statics?.error || null;

  const statusBreakdown = useMemo(() => {
    const total = total_libraries || 0;
    const pct = (n) => (total ? Math.round((n / total) * 100) : 0);
    return [
      { label: 'Active', value: active_libraries, pct: pct(active_libraries), color: 'bg-emerald-500', lightColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
      { label: 'Draft', value: draft_libraries, pct: pct(draft_libraries), color: 'bg-amber-500', lightColor: 'bg-amber-50', textColor: 'text-amber-700' },
      { label: 'Inactive', value: inactive_libraries, pct: pct(inactive_libraries), color: 'bg-slate-400', lightColor: 'bg-slate-50', textColor: 'text-slate-700' },
    ];
  }, [total_libraries, active_libraries, draft_libraries, inactive_libraries]);

  const difficultyBreakdown = useMemo(() => {
    const total = total_libraries || 0;
    const pct = (n) => (total ? Math.round((n / total) * 100) : 0);
    return [
      { label: 'Easy', value: easy_libraries, pct: pct(easy_libraries), color: 'bg-green-500', lightColor: 'bg-green-50', textColor: 'text-green-700' },
      { label: 'Medium', value: medium_libraries, pct: pct(medium_libraries), color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-700' },
      { label: 'Hard', value: hard_libraries, pct: pct(hard_libraries), color: 'bg-red-500', lightColor: 'bg-red-50', textColor: 'text-red-700' },
    ];
  }, [total_libraries, easy_libraries, medium_libraries, hard_libraries]);

  const isEmpty = !isLoading && total_libraries === 0 && total_cards === 0 && created_this_week === 0;

  const refresh = () => {
    dispatch(handleGetFlashcardStatistics());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
    
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Loading State */}
        {isLoading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white/80 backdrop-blur-sm p-6 animate-pulse shadow-sm border border-white/20"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-4 w-20 bg-slate-200 rounded-lg" />
                    <div className="w-10 h-10 bg-slate-200 rounded-xl" />
                  </div>
                  <div className="h-8 w-16 bg-slate-200 rounded-lg mb-2" />
                  <div className="h-3 w-24 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white/80 backdrop-blur-sm p-6 animate-pulse shadow-sm border border-white/20"
                >
                  <div className="h-5 w-32 bg-slate-200 rounded-lg mb-4" />
                  <div className="h-4 w-full bg-slate-200 rounded-full mb-4" />
                  <div className="space-y-3">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-4 w-full bg-slate-200 rounded" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="rounded-2xl border border-red-200/60 bg-gradient-to-r from-red-50 to-rose-50 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Unable to load statistics</h3>
                <p className="text-red-700 text-sm">{String(error)}</p>
                <button
                  onClick={refresh}
                  className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && isEmpty && (
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-12 text-center shadow-sm border border-white/20">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No flashcard data yet
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Create your first flashcard library to start tracking your learning progress and see detailed analytics here.
            </p>
            <button
              onClick={refresh}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
            >
              Create First Library
            </button>
          </div>
        )}

        {/* Main Content */}
        {!isLoading && !error && !isEmpty && (
          <>
            {/* Hero Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <EnhancedKpiCard
                icon={<LibraryBig className="w-6 h-6" />}
                label="Total Libraries"
                value={total_libraries}
                sub={`${active_libraries} active`}
                trend="" // optional trend
                color="indigo"
              />
              <EnhancedKpiCard
                icon={<Layers className="w-6 h-6" />}
                label="Total Cards"
                value={total_cards.toLocaleString()}
                sub={`${created_this_week} new this week`}
                trend=""
                color="emerald"
              />
              <EnhancedKpiCard
                icon={<Clock className="w-6 h-6" />}
                label="Avg. Study Time"
                value={`${avg_estimated_time}m`}
                sub="per library"
                trend=""
                color="amber"
              />
              <EnhancedKpiCard
                icon={<Target className="w-6 h-6" />}
                label="Completion Rate"
                value="—"
                sub="(not provided)"
                trend=""
                color="rose"
              />
            </div>

            {/* Activity Overview (visual only) */}
            <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-sm border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Weekly Activity</h2>
              </div>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <div key={day} className="text-center">
                    <div className="text-xs text-slate-500 mb-2">{day}</div>
                    <div
                      className={`h-16 rounded-lg ${
                        i < 5 ? 'bg-gradient-to-t from-blue-500 to-cyan-400' : 'bg-slate-100'
                      } relative overflow-hidden`}
                      style={{ opacity: i < 5 ? (0.4 + (i + 1) * 0.1) : 0.3 }}
                    >
                      {i < 5 && <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      {i < 5 ? Math.max(1, Math.floor(created_this_week * 2 - i)) : '0'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Cards studied this week</span>
                <span className="font-medium text-slate-900">
                  {created_this_week * 12 /* purely illustrative */} total
                </span>
              </div>
            </div>

            {/* Breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EnhancedBreakdownCard
                title="Library Status"
                subtitle="Distribution by current status"
                icon={<CheckCircle2 className="w-5 h-5" />}
                items={statusBreakdown}
                total={total_libraries}
              />
              <EnhancedBreakdownCard
                title="Difficulty Level"
                subtitle="Libraries by complexity"
                icon={<TrendingUp className="w-5 h-5" />}
                items={difficultyBreakdown}
                total={total_libraries}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* -------------------- UI bits -------------------- */

function EnhancedKpiCard({ icon, label, value, sub, trend, color }) {
  const colorClasses = {
    indigo: 'from-indigo-500 to-purple-600',
    emerald: 'from-emerald-500 to-teal-600',
    amber: 'from-amber-500 to-orange-600',
    rose: 'from-rose-500 to-pink-600',
  };

  return (
    <div className="group rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg group-hover:shadow-xl transition-shadow`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
      <div className="mb-2">
        <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
        <div className="text-sm text-slate-500">{sub}</div>
      </div>
      {trend ? (
        <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </div>
      ) : null}
    </div>
  );
}

function EnhancedBreakdownCard({ title, subtitle, icon, items, total }) {
  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-100 rounded-xl">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600">{subtitle}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden mb-6">
        {items.map((item, i) => (
          <div
            key={i}
            className={`${item.color} h-full transition-all duration-1000 ease-out`}
            style={{ width: `${item.pct}%`, animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${item.lightColor} transition-all hover:scale-105`}>
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${item.color} shadow-sm`} />
              <span className={`font-medium ${item.textColor}`}>{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-bold ${item.textColor}`}>{item.value}</span>
              <span className="text-xs text-slate-500 bg-white/60 px-2 py-1 rounded-full">
                {item.pct}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Total Libraries</span>
          <span className="font-semibold text-slate-900">{total}</span>
        </div>
      </div>
    </div>
  );
}

function AchievementBadge({ title, description, icon, color }) {
  const colorClasses = {
    orange: 'from-orange-400 to-red-500',
    yellow: 'from-yellow-400 to-orange-500',
    blue: 'from-blue-400 to-indigo-500',
  };

  return (
    <div className="bg-white/80 rounded-xl p-4 border border-white/40 hover:shadow-md transition-all hover:-translate-y-1">
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-xl mb-3 shadow-lg`}>
        {icon}
      </div>
      <h4 className="font-semibold text-slate-900 mb-1">{title}</h4>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}
