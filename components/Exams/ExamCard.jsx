import React from "react";
import { Card, Tag, Tooltip, Progress, Button, Space, Popconfirm, Pagination } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  CheckCircleTwoTone,
  ExclamationCircleTwoTone,
} from "@ant-design/icons";

/**
 * ExamCards
 * - Replaces a table with responsive cards
 * - Tailwind for layout/spacing/typography
 * - Ant Design for Card/Tag/Progress/Buttons
 */

const STATUS_COLORS = {
  Published: "green",
  Draft: "gold",
};

const SUBJECT_COLORS = {
  Math: "blue",
  Physics: "purple",
  Geography: "green",
};

const ExamCard = ({ exam, onView, onEdit, onDelete }) => {
  const {
    title,
    subject,
    creator,
    status,
    questions,
    durationMinutes,
    attempts,
    passRate, // number | string (e.g., 85)
    createdAt,
  } = exam;

  const statusColor = STATUS_COLORS[status] || "default";
  const subjectColor = SUBJECT_COLORS[subject] || "default";

  return (
    <Card
      className="h-full shadow-sm hover:shadow-md transition-shadow rounded-2xl"
      bodyStyle={{ padding: 16 }}
      title={
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <FileTextOutlined className="text-slate-500" />
          </div>
          <div className="min-w-0">
            <div className="text-base font-semibold text-slate-800 truncate">{title}</div>
            <div className="text-xs text-slate-500">Created: {createdAt}</div>
          </div>
        </div>
      }
      extra={
        <Space size={6} wrap>
          <Tag color={subjectColor} className="px-2 py-0.5 text-[11px]">{subject}</Tag>
          <Tag color={statusColor} className="px-2 py-0.5 text-[11px] flex items-center gap-1">
            {status === "Published" ? (
              <CheckCircleTwoTone twoToneColor="#52c41a" />
            ) : (
              <ExclamationCircleTwoTone twoToneColor="#faad14" />
            )}
            {status}
          </Tag>
        </Space>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-sm text-slate-600">
            <span className="font-medium text-slate-700">Creator:</span> {creator}
          </div>
          <div className="flex items-center text-sm text-slate-600 gap-1">
            <ClockCircleOutlined />
            <span>{durationMinutes} minutes</span>
          </div>
          <div className="text-sm text-slate-600">
            <span className="font-medium text-slate-700">{questions}</span> questions
          </div>
          <div className="text-sm text-slate-600">
            <span className="font-medium text-slate-700">{attempts}</span> attempts
          </div>
        </div>

        {/* Performance */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Progress type="circle" percent={Number(passRate)} size={56} />
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">Pass Rate</div>
              <div className="text-lg font-semibold text-slate-800">{passRate}%</div>
            </div>
          </div>

          {/* Actions */}
          <Space>
            <Tooltip title="Preview">
              <Button shape="circle" icon={<EyeOutlined />} onClick={() => onView?.(exam)} />
            </Tooltip>
            <Tooltip title="Edit">
              <Button shape="circle" icon={<EditOutlined />} onClick={() => onEdit?.(exam)} />
            </Tooltip>
            <Popconfirm
              title="Delete exam?"
              description="This action cannot be undone."
              okText="Delete"
              okButtonProps={{ danger: true }}
              onConfirm={() => onDelete?.(exam)}
            >
              <Tooltip title="Delete">
                <Button danger shape="circle" icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          </Space>
        </div>
      </div>
    </Card>
  );
};

const DEFAULT_DATA = [
  {
    id: 1,
    title: "Algebra Basics",
    subject: "Math",
    creator: "Ahmed Hassan",
    status: "Published",
    questions: 25,
    durationMinutes: 60,
    attempts: 145,
    passRate: 85,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    title: "Forces & Motion",
    subject: "Physics",
    creator: "Nour Adel",
    status: "Draft",
    questions: 30,
    durationMinutes: 90,
    attempts: 0,
    passRate: 0,
    createdAt: "2024-01-18",
  },
  {
    id: 3,
    title: "World Geography",
    subject: "Geography",
    creator: "Omar Salah",
    status: "Published",
    questions: 40,
    durationMinutes: 75,
    attempts: 89,
    passRate: 92,
    createdAt: "2024-01-10",
  },
];

export default function ExamCards({ data = DEFAULT_DATA, pageSize = 9 }) {
  const [page, setPage] = React.useState(1);

  const start = (page - 1) * pageSize;
  const paged = data.slice(start, start + pageSize);

  const handleView = (exam) => console.log("view", exam);
  const handleEdit = (exam) => console.log("edit", exam);
  const handleDelete = (exam) => console.log("delete", exam);

  return (
    <div className="w-full">
      {/* Header / Controls (optional) */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-800">Exams</h2>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {paged.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />)
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-end">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={data.length}
          onChange={(p) => setPage(p)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}
