"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button as AntButton,
  ConfigProvider,
  Tag,
  message,
} from "antd";
import { PlusOutlined, BookOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { handleEditTopic, handleGetAllTopics } from "../../features/topicsSlice";
import { toast } from "react-toastify";

const { TextArea } = Input;

const PALETTE = {
  primary: "#0F7490",
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

function EditTopicForm({
  open,
  onCancel,
  onSuccess,
  topic,
  defaultUnitId,
}) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { edit_topic_loading, create_topic_loading } = useSelector((state) => state?.topics || {});
  const loading = edit_topic_loading ?? create_topic_loading ?? false;

  const [tags, setTags] = useState([]);

  // derive initial values from topic
  const initialValues = useMemo(
    () => ({
      topicName: topic?.topic_name ?? topic?.name ?? "",
      description: topic?.short_description ?? "",
      learningObjectives: topic?.learning_objectives ?? "",
      status: topic?.status ?? "active",
      order: topic?.topic_order ?? 1,
    }),
    [topic]
  );

  useEffect(() => {
    if (open && topic) {
      form.setFieldsValue(initialValues);
      setTags(Array.isArray(topic?.tags) ? topic.tags : []);
    } else if (!open) {
      form.resetFields();
      setTags([]);
    }
  }, [open, topic, form, initialValues]);

  const handleFinish = async (values) => {
    const payload = {
      topic_id: topic?.topic_id ?? topic?.id, // must have topic_id for edit
      unit_id: Number(defaultUnitId),
      topic_name: values?.topicName?.trim(),
      short_description: values?.description?.trim(),
      learning_objectives: values?.learningObjectives?.trim(),
      status: values?.status,
      topic_order: Number(values?.order ?? 1),
      tags,
    };

    if (!payload.topic_id) {
      message.error("Missing topic_id for editing.");
      return;
    }

    try {
      const res = await dispatch(handleEditTopic({ body: payload , id : topic?.id })).unwrap();
      if (res?.status === "success") {
        toast.success(res?.message || "Topic updated successfully");
        // refresh list for this unit
        await dispatch(handleGetAllTopics({ unit_id: defaultUnitId }));
        onSuccess?.();
      } else {
        message.error(res?.message || "Failed to update topic.");
      }
    } catch (err) {
      message.error(err?.message || "Failed to update topic.");
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
        onCancel={onCancel}
        footer={null}
        className="!w-full max-w-3xl"
        destroyOnClose
      >
        <div>
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[--primary] rounded-lg flex items-center justify-center shadow-sm"
                   style={{ background: PALETTE.primary }}>
                <BookOutlined className="text-white text-lg" />
              </div>
              <h2 className="text-3xl font-bold" style={{ color: PALETTE.text }}>
                Edit Topic
              </h2>
            </div>
            <p className="text-gray-600">
              Update topic details and status.
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={initialValues}
            className="grid grid-cols-1 gap-6"
          >
            <div className="space-y-6">
              {/* Basic */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: PALETTE.text }}>
                  <BookOutlined style={{ color: PALETTE.primary }} />
                  Basic Information
                </h3>

                <Form.Item
                  label={<span className="font-medium">Topic Name *</span>}
                  name="topicName"
                  rules={[
                    { required: true, message: "Please enter topic name" },
                    {
                      validator: (_, v) =>
                        !v || v.trim().length >= 2
                          ? Promise.resolve()
                          : Promise.reject(new Error("Name must be at least 2 characters")),
                    },
                  ]}
                >
                  <Input placeholder="e.g., Linear Equations" />
                </Form.Item>

                <Form.Item
                  label={<span className="font-medium">Short Description *</span>}
                  name="description"
                  rules={[
                    { required: true, message: "Please enter description" },
                    {
                      validator: (_, v) =>
                        !v || v.trim().length >= 10
                          ? Promise.resolve()
                          : Promise.reject(new Error("At least 10 characters")),
                    },
                  ]}
                >
                  <TextArea rows={4} placeholder="Brief summary of this topic…" />
                </Form.Item>

                <Form.Item
                  label={<span className="font-medium">Learning Objectives</span>}
                  name="learningObjectives"
                >
                  <TextArea rows={3} placeholder="e.g., Solve first-degree equations; understand properties…" />
                </Form.Item>

                <div className="mb-4">
                  <label className="font-medium block mb-2">Status *</label>
                  <Form.Item name="status" rules={[{ required: true }]} className="!mb-0">
                    <Select
                      options={[
                        { label: "🟢 Active", value: "active" },
                        { label: "⚪ Inactive", value: "inactive" },
                      ]}
                    />
                  </Form.Item>
                </div>

                {/* Tags */}
                <div className="mb-2">
                  <label className="font-medium block mb-2">Tags</label>
                  <Select
                    mode="tags"
                    placeholder="Add tags and press Enter"
                    value={tags}
                    onChange={setTags}
                    tokenSeparators={[","]}
                    className="w-full"
                  />
                  {!!tags?.length && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tags.map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  )}
                </div>

                <Form.Item
                  label={<span className="font-medium">Display Order</span>}
                  name="order"
                  rules={[
                    {
                      validator: (_, v) =>
                        v == null || Number(v) >= 0
                          ? Promise.resolve()
                          : Promise.reject(new Error("Order must be ≥ 0")),
                    },
                  ]}
                >
                  <Input type="number" min={0} />
                </Form.Item>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-end gap-4">
                <AntButton onClick={onCancel}>Cancel</AntButton>
                <AntButton
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={!loading ? <PlusOutlined /> : undefined}
                  style={{ background: PALETTE.primary }}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </AntButton>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </ConfigProvider>
  );
}

export default EditTopicForm;
