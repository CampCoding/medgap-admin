"use client";

import React from "react";
import Card from "../../atoms/Card";
import Badge from "../../atoms/Badge";
import { Calendar, Edit3, Settings, Trash2 } from "lucide-react";
import Button from "../../atoms/Button";
import Link from "next/link";
import PreserveSubjectLink from "../../PreserveSubjectLink";

const SubjectCard = ({ subject, setSelectedSubject }) => {

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "blue";
      case "draft":
        return "purple";
      case "archived":
        return "default";
      default:
        return "default";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "green";
      case "Medium":
        return "gold";
      case "Hard":
        return "red";
      default:
        return "default";
    }
  };

  return (
    <>
      <Card
        key={subject.id}
        className="p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        <PreserveSubjectLink href={`/subjects/${subject.code}/units`}>
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#0F7490] to-[#8B5CF6] rounded-xl flex items-center justify-center text-white font-bold">
              {subject.name.substring(0, 2)}
            </div>
            <div className="flex space-x-1">
              <Badge color={getStatusColor(subject.status)}>
                {subject.status.charAt(0).toUpperCase() +
                  subject.status.slice(1)}
              </Badge>
              {/* <Badge color={getDifficultyColor(subject.difficulty)}>
            {subject.difficulty}
          </Badge> */}
            </div>
          </div>
          <h3 className="text-xl font-bold text-[#202938] mb-1">
            {subject.name}
          </h3>
          <p className="text-sm text-[#202938]/60 mb-1">Code: {subject.code}</p>
          <p className="text-sm text-[#202938]/80 mb-4 line-clamp-2">
            {subject.description}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-4 text-center">
            <div>
              <p className="text-lg font-bold text-[#0F7490]">
                {subject?.units?.length}
              </p>
              <p className="text-xs text-[#202938]/60">Units</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[#C9AE6C]">
                {subject?.students}
              </p>
              <p className="text-xs text-[#202938]/60">Students</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[#8B5CF6]">
                {subject.questions}
              </p>
              <p className="text-xs text-[#202938]/60">Questions</p>
            </div>
          </div>
        </PreserveSubjectLink>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-xs text-[#202938]/60">
            <Calendar className="w-3 h-3" />
            <span>{subject.lastUpdated}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              type="text"
              size="small"
              className="text-[#0F7490] hover:bg-[#0F7490]/10"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              type="text"
              size="small"
              className="text-[#C9AE6C] hover:bg-[#C9AE6C]/10"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => {
                setSelectedSubject(subject);
              }}
              type="text"
              size="small"
              className="text-red-500 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default SubjectCard;
