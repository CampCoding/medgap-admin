"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Modal,
  Form,
  Select,
  message,
  ConfigProvider,
  Button,
  Avatar,
  Space,
  Tag,
} from "antd";
import {
  UserAddOutlined,
  EditOutlined,
  UserOutlined,
  BookOutlined,
} from "@ant-design/icons";

const PALETTE = {
  primary: "#0F7490",
  secondary: "#C9AE6C",
  accent: "#8B5CF6",
  background: "#F9FAFC",
  text: "#202938",
};

function AssignReviewerModal({
  open,
  onCancel,
  onSubmit,
  teacher,
  reviewerOptions = [],
  subjectOptions = [],
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const isEditing = teacher?.reviewer; // Check if teacher already has a reviewer

  const normalizedReviewers = useMemo(
    () =>
      reviewerOptions.map((r) => ({
        label: (
          <div className="flex items-center gap-3">
            <Avatar
              size={24}
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #0F7490 100%)",
              }}
              icon={<UserOutlined />}
            >
              {r.name?.split(" ").map(n => n[0]).join("").toUpperCase()}
            </Avatar>
            <div>
              <div className="font-medium">{r.name}</div>
              <div className="text-xs text-gray-500">{r.reviewSubject}</div>
            </div>
          </div>
        ),
        value: r.id,
        reviewer: r,
      })),
    [reviewerOptions]
  );

  const normalizedSubjects = useMemo(
    () =>
      subjectOptions.map((s) => ({
        label: s.code ? `${s.name} (${s.code})` : s.name,
        value: String(s.id ?? s.value ?? s.code ?? s.name),
      })),
    [subjectOptions]
  );

  // Set initial values when modal opens
  useEffect(() => {
    if (open && teacher) {
      form.setFieldsValue({
        reviewerId: teacher.reviewer?.id || undefined,
        reviewSubject: teacher.reviewer?.reviewSubject || undefined,
      });
    }
  }, [open, teacher, form]);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      
      const selectedReviewer = reviewerOptions.find(r => r.id === values.reviewerId);
      
      const payload = {
        teacherId: teacher.id,
        reviewerId: values.reviewerId,
        reviewer: selectedReviewer,
        reviewSubject: values.reviewSubject,
        action: isEditing ? 'update' : 'assign',
      };

      if (typeof onSubmit === "function") {
        await onSubmit(payload);
      } else {
        await new Promise((r) => setTimeout(r, 700));
        console.log("Reviewer assignment payload:", payload);
      }

      message.success(
        isEditing 
          ? "Reviewer assignment updated successfully"
          : "Reviewer assigned successfully"
      );
      
      form.resetFields();
      onCancel && onCancel();
    } catch (error) {
      message.error("Failed to assign reviewer. Please try again.");
      console.error("Reviewer assignment error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveReviewer = async () => {
    try {
      setLoading(true);
      
      const payload = {
        teacherId: teacher.id,
        reviewerId: null,
        reviewer: null,
        action: 'remove',
      };

      if (typeof onSubmit === "function") {
        await onSubmit(payload);
      }

      message.success("Reviewer removed successfully");
      form.resetFields();
      onCancel && onCancel();
    } catch (error) {
      message.error("Failed to remove reviewer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: PALETTE.primary,
          borderRadius: 14,
          colorText: PALETTE.text,
          controlHeight: 44,
        },
      }}
    >
      <Modal
        title={null}
        open={open}
        onCancel={() => {
          form.resetFields();
          onCancel && onCancel();
        }}
        footer={null}
        className="!w-full max-w-2xl"
      >
        <div className="bg-background">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                {isEditing ? (
                  <EditOutlined className="text-white text-lg" />
                ) : (
                  <UserAddOutlined className="text-white text-lg" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text">
                  {isEditing ? "Edit Reviewer Assignment" : "Assign Reviewer"}
                </h2>
                <p className="text-gray-600">
                  {isEditing ? "Update" : "Assign"} reviewer for {teacher?.name}
                </p>
              </div>
            </div>
          </div>

          {/* Current Assignment Info */}
          {isEditing && teacher.reviewer && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3">
                <Avatar
                  size={40}
                  style={{
                    background: "linear-gradient(135deg, #8B5CF6 0%, #0F7490 100%)",
                  }}
                  icon={<UserOutlined />}
                >
                  {teacher.reviewer.name?.split(" ").map(n => n[0]).join("").toUpperCase()}
                </Avatar>
                <div>
                  <div className="font-medium text-gray-800">
                    Current Reviewer: {teacher.reviewer.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Subject: {teacher.reviewer.reviewSubject}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              className="space-y-4"
            >
              <Form.Item
                label={
                  <span className="text-text font-medium flex items-center gap-2">
                    <UserOutlined className="text-primary" />
                    Select Reviewer *
                  </span>
                }
                name="reviewerId"
                rules={[
                  {
                    required: true,
                    message: "Please select a reviewer",
                  },
                ]}
              >
                <Select
                  placeholder="Choose a reviewer"
                  options={normalizedReviewers}
                  className="rounded-lg"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.reviewer?.name?.toLowerCase().includes(input.toLowerCase()) ||
                    option?.reviewer?.reviewSubject?.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-text font-medium flex items-center gap-2">
                    <BookOutlined className="text-primary" />
                    Review Subject
                  </span>
                }
                name="reviewSubject"
              >
                <Select
                  placeholder="Select subject to review (optional)"
                  options={normalizedSubjects}
                  className="rounded-lg"
                  showSearch
                  allowClear
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  {isEditing && (
                    <Button
                      danger
                      onClick={handleRemoveReviewer}
                      loading={loading}
                      className="rounded-lg"
                    >
                      Remove Reviewer
                    </Button>
                  )}
                </div>
                
                <Space>
                  <Button
                    onClick={() => {
                      form.resetFields();
                      onCancel && onCancel();
                    }}
                    className="rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="rounded-lg"
                  >
                    {isEditing ? "Update Assignment" : "Assign Reviewer"}
                  </Button>
                </Space>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
}

export default AssignReviewerModal;
