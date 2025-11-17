"use client";
import React, { useEffect } from "react";
import {
  Users,
  UserCheck,
  Clock,
  UserX
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { handleGetTeacherStatistics } from "../../features/teachersSlice";

const TeacherStats = ({ role, data = [] }) => {
  const dispatch = useDispatch();
  const { all_teacher_statistics, all_teacher_statistics_loading } = useSelector(
    (state) => state?.teachers || {}
  );

  // Fetch teachers stats only if role is not reviewer
  useEffect(() => {
    if (role !== "reviewer") {
      dispatch(handleGetTeacherStatistics());
    }
  }, [dispatch, role]);

  // ---------------- TEACHERS DATA (from API) ----------------
  const stats = all_teacher_statistics?.data?.stats || {};
  const {
    total = 0,
    approved = 0,
    pending = 0,
    rejected = 0,
  } = stats;

  // ---------------- REVIEWERS DATA (from props) ----------------
  const reviewerStats = {
    total_reviewers: data.length || 0,
    approved_reviewers: data.filter((r) => r.status === "approved").length,
    pending_reviewers: data.filter((r) => r.status === "pending").length,
    rejected_reviewers: data.filter((r) => r.status === "rejected").length,
  };

  // ---------------- LOADING SKELETON ----------------
  if (all_teacher_statistics_loading && role !== "reviewer") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-100 rounded-lg p-6 animate-pulse h-24"
          />
        ))}
      </div>
    );
  }

  // ---------------- ROLE-BASED STATS ----------------
  const isReviewer = role === "reviewer";
  const totals = isReviewer
    ? {
        total: reviewerStats.total_reviewers,
        approved: reviewerStats.approved_reviewers,
        pending: reviewerStats.pending_reviewers,
        rejected: reviewerStats.rejected_reviewers,
      }
    : {
        total,
        approved,
        pending,
        rejected,
      };

  // ---------------- DISPLAY CARDS ----------------
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Total */}
      <StatsCard
        icon={Users}
        value={totals.total}
        label={`Total ${isReviewer ? "Reviewers" : "Teachers"}`}
        iconColor="text-blue-600"
        bgColor="bg-blue-50"
        description={`All ${isReviewer ? "reviewers" : "teachers"}`}
      />

      {/* Approved */}
      <StatsCard
        icon={UserCheck}
        value={totals.approved}
        label="Approved"
        iconColor="text-green-600"
        bgColor="bg-green-50"
        description="Verified and active"
      />

      {/* Pending */}
      <StatsCard
        icon={Clock}
        value={totals.pending}
        label="Pending"
        iconColor="text-yellow-600"
        bgColor="bg-yellow-50"
        description="Awaiting approval"
      />

      {/* Rejected */}
      <StatsCard
        icon={UserX}
        value={totals.rejected}
        label="Rejected"
        iconColor="text-red-600"
        bgColor="bg-red-50"
        description="Not approved"
      />
    </div>
  );
};

// ---------------- REUSABLE CARD COMPONENT ----------------
const StatsCard = ({
  icon: Icon,
  value,
  label,
  iconColor = "text-blue-600",
  bgColor = "bg-blue-50",
  description,
}) => {
  return (
    <div
      className={`${bgColor} rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default TeacherStats;
