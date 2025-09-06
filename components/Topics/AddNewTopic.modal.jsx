"use client";

import React, { useMemo, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  ConfigProvider,
  InputNumber,
  DatePicker,
  Switch,
  Tag,
  Upload,
  message,
} from "antd";
import {
  PlusOutlined,
  InboxOutlined,
  BookOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Dragger } = Upload;

const PALETTE = {
  primary: "#0F7490",
  secondary: "#C9AE6C",
  accent: "#8B5CF6",
  background: "#F9FAFC",
  text: "#202938",
};

const TOPIC_COLORS = [
  "#0F7490",
  "#C9AE6C",
  "#8B5CF6",
  "#10B981",
  "#6366F1",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
];

const toISO = (d) =>
  d
    ? typeof d.toDate === "function"
      ? d.toDate().toISOString()
      : d.toISOString?.()
    : null;

function AddTopicForm({ open, onCancel, onSubmit, units = [], defaultUnitId }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState(TOPIC_COLORS[2]);
  const [coverPreview, setCoverPreview] = useState(null);
  const [tags, setTags] = useState([]);

  const unitOptions = useMemo(
    () =>
      units.map((u) => ({
        label: u.code ? `${u.name} (${u.code})` : u.name,
        value: String(u.id),
      })),
    [units]
  );

  const handleFinish = async (values) => {
    const payload = {
      ...values,
      color,
      startDate: toISO(values.startDate),
      tags,
      cover: coverPreview, // swap for server URL if uploading
    };
    try {
      setLoading(true);
      if (typeof onSubmit === "function") {
        await onSubmit(payload);
      } else {
        await new Promise((r) => setTimeout(r, 700));
        // eslint-disable-next-line no-console
        console.log("Topic payload:", payload);
      }
      message.success("Topic created successfully");
      form.resetFields();
      setTags([]);
      setCoverPreview(null);
      setColor(TOPIC_COLORS[2]);
      onCancel && onCancel();
    } catch (e) {
      message.error("Failed to create topic. Please try again.");
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
          setTags([]);
          setCoverPreview(null);
          setColor(TOPIC_COLORS[2]);
          onCancel && onCancel();
        }}
        footer={null}
        className="!w-full max-w-4xl"
      >
        <div className="bg-background">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <PlusOutlined className="text-white text-lg" />
              </div>
              <h2 className="text-3xl font-bold text-text">Add New Topic</h2>
            </div>
            <p className="text-gray-600">
              Create and configure a topic inside a unit.
            </p>
          </div>

          <div className="">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              initialValues={{
                topicName: "",
                topicCode: "",
                unitId: defaultUnitId ? String(defaultUnitId) : undefined,
                description: "",
                learningObjectives: "",
                difficulty: "medium",
                status: "active",
                order: 1,
                estMinutes: 30,
                startDate: null,
                isPublished: true,
              }}
              className="grid grid-cols-1 lg:grid-cols-1 gap-6"
            >
              {/* LEFT */}
              <div className="space-y-6">
                {/* Basic */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <BookOutlined className="text-primary" />
                    Basic Information
                  </h3>

                  <Form.Item
                    label={
                      <span className="text-text font-medium">
                        Topic Name *
                      </span>
                    }
                    name="topicName"
                    rules={[
                      { required: true, message: "Please enter topic name" },
                      {
                        validator: (_, v) =>
                          !v || v.trim().length >= 2
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error("Name must be at least 2 characters")
                              ),
                      },
                    ]}
                  >
                    <Input
                      placeholder="e.g., Cell Structure"
                      className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary"
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="text-text font-medium">
                        Short Description *
                      </span>
                    }
                    name="description"
                    rules={[
                      { required: true, message: "Please enter description" },
                      {
                        validator: (_, v) =>
                          !v || v.trim().length >= 10
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error("At least 10 characters")
                              ),
                      },
                    ]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Brief summary of what this topic covers…"
                      className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary resize-none"
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="text-text font-medium">
                        Learning Objectives
                      </span>
                    }
                    name="learningObjectives"
                  >
                    <TextArea
                      rows={3}
                      placeholder="e.g., Identify organelles; explain membrane transport; …"
                      className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary resize-none"
                    />
                  </Form.Item>
                     {/* Status */}
                  <div className="mb-4">
                    <label className="text-text font-medium block mb-2">
                      Status *
                    </label>
                    <Form.Item
                      name="status"
                      rules={[{ required: true }]}
                      className="!mb-0"
                    >
                      <Select
                        className="rounded-lg"
                        options={[
                          { label: "🟢 Active", value: "active" },
                          { label: "⚪ Inactive", value: "inactive" },
                          { label: "🟡 Draft", value: "draft" },
                        ]}
                      />
                    </Form.Item>
                  </div>

                  {/* Tags */}
                  <div className="mb-4">
                    <label className="text-text font-medium block mb-2">
                      Tags
                    </label>
                    <Select
                      mode="tags"
                      placeholder="Add tags and press Enter"
                      value={tags}
                      onChange={setTags}
                      tokenSeparators={[","]}
                      className="w-full rounded-lg"
                    />
                    {!!tags?.length && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {tags.map((t) => (
                          <Tag key={t}>{t}</Tag>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="lg:col-span-2 border-t border-gray-200 pt-6">
                <div className="flex justify-end gap-4">
                  <Button
                    type="default"
                    onClick={() => {
                      form.resetFields();
                      setTags([]);
                      setCoverPreview(null);
                      setColor(TOPIC_COLORS[2]);
                    }}
                    className="px-8 py-3 text-gray-700 border border-gray-300 rounded-lg hover:border-gray-400"
                  >
                    Reset
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="px-8 py-3 bg-primary text-white rounded-lg hover:!bg-[#0d5f75]"
                    icon={!loading ? <PlusOutlined /> : undefined}
                  >
                    {loading ? "Adding..." : "Add Topic"}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
}

export default AddTopicForm;
