import React from "react";
import Card from "../atoms/Card";
import Input from "../atoms/Input";
import { Search } from "lucide-react";
import Select from "../atoms/Select";

const QuestionsSearchAndFilters = ({
  searchTerm,
  setSearchTerm,
  selectedSubject,
  setSelectedSubject,
  selectedType,
  setSelectedType,
}) => {
  const subjectOptions = [
    { value: "math", label: "Math" },
    { value: "science", label: "Science" },
    { value: "history", label: "History" },
    { value: "english", label: "English" },
  ];

  const typeOptions = [
    { value: "mcq", label: "MCQ" },
    { value: "truefalse", label: "True/False" },
    { value: "essay", label: "Essay" },
    { value: "fillblanks", label: "Fill in the Blanks" },
  ];

  return (
    <div className="mb-8">
      {/* Search and Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search questions..."
              prefix={<Search className="w-4 h-4 text-gray-400" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            placeholder="Filter by Subject"
            options={subjectOptions}
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          />
          <Select
            placeholder="Filter by Type"
            options={typeOptions}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          />
        </div>
      </Card>
    </div>
  );
};

export default QuestionsSearchAndFilters;
