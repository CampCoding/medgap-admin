import React from "react";
import { Card, Badge, Avatar, Tooltip, Button, Row, Col, Tag } from "antd";
import {
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  IdcardOutlined,
  StarOutlined,
} from "@ant-design/icons";

/** helpers — reuse your own if you already have them */
const getGradeColor = (grade) => {
  if (grade?.startsWith("12")) return "#8B5CF6"; // purple
  if (grade?.startsWith("11")) return "#0F766E"; // teal
  if (grade?.startsWith("10")) return "#D4A73C"; // gold
  return "#64748B";
};
const getGPAColor = (gpa) => (gpa >= 3.7 ? "#16a34a" : gpa >= 3.3 ? "#eab308" : "#ef4444");
const getStatusAnt = (s) =>
  s === "active" ? "success" : s === "inactive" ? "default" : "warning";
const getInitials = (name = "") =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/** Card view */
export default function StudentsCards({
  students = [],
  loading = false,
  onView = () => {},
  onChangeStatus = () => {},
}) {
  return (
    <div className="p-3">
      <Row gutter={[16, 16]}>
        {students.map((s) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={s.id}>
            <Card
              loading={loading}
              className="shadow-md border-0 rounded-2xl"
              bodyStyle={{ padding: 16 }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <Avatar
                  size={48}
                  className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold"
                >
                  {getInitials(s.name)}
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 truncate">
                      {s.name}
                    </span>
                    <Badge status={getStatusAnt(s.status)} />
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <IdcardOutlined />
                    {s.id}
                  </div>
                </div>
              </div>

              {/* Grade & GPA */}
              <div className="flex items-center justify-between mb-3">
                <Tag
                  className="px-3 py-1 text-xs font-medium border-0"
                  style={{ backgroundColor: getGradeColor(s.grade), color: "#fff" }}
                >
                  {s.grade}
                </Tag>
              
              </div>

              {/* Contact */}
              <div className="space-y-1 mb-3">
                <div className="text-sm text-blue-600 flex items-center">
                  <MailOutlined className="mr-2 text-xs" />
                  <span className="truncate">{s.email}</span>
                </div>
                <div className="text-sm text-gray-600 flex items-center">
                  <PhoneOutlined className="mr-2 text-xs" /> {s.phone}
                </div>
              </div>

              {/* Enrolled */}
              <div className="flex items-center text-gray-700 text-sm mb-4">
                <CalendarOutlined className="mr-2 text-blue-500" />
                {new Date(s.enrolledAt).toLocaleDateString()}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Tooltip title="View Details">
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    className="bg-purple-600 hover:bg-purple-700 border-purple-600"
                    onClick={() => onView(s)}
                  />
                </Tooltip>

                {s.status !== "blocked" ? (
                  <Button
                    danger
                    icon={<LockOutlined />}
                    className="!flex-1"
                    onClick={() => onChangeStatus(s.id, "blocked")}
                  >
                    Block
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    icon={<UnlockOutlined />}
                    className="bg-green-600 hover:bg-green-700 border-green-600 !flex-1"
                    onClick={() => onChangeStatus(s.id, "active")}
                  >
                    Unblock
                  </Button>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
