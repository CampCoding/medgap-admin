import React, { useState } from "react";
import {
  PlusOutlined,
  BookOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  ConfigProvider,
  message,
} from "antd";

const { TextArea } = Input;

const subjectColors = [
  { name: "Primary Blue", value: "#0F7490" },
  { name: "Secondary Gold", value: "#C9AE6C" },
  { name: "Accent Purple", value: "#8B5CF6" },
  { name: "Green", value: "#10B981" },
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F59E0B" },
  { name: "Pink", value: "#EC4899" },
  { name: "Indigo", value: "#6366F1" },
];

const AddSubjectForm = ({open , setOpen}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#8B5CF6");

  const handleFinish = async () => {
    setLoading(true);
    try {
      // Simulate API
      await new Promise((r) => setTimeout(r, 1500));

      const payload = { ...values, color: selectedColor };
      console.log("Form Data:", payload);

      message.success("Subject added successfully!");
      form.resetFields();
      setSelectedColor("#8B5CF6");
    } catch (e) {
      message.error("Failed to add subject. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setSelectedColor("#8B5CF6");
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0F7490",
          borderRadius: 12, // match rounded-lg / xl vibe
          controlHeight: 44, // match py-3 inputs
        },
      }}
    >
      <Modal
        title={null}
        open={open}
        onCancel={()=>setOpen(false)}
        footer={null}
        className="!w-full max-w-4xl"
      >
        <div className="bg-[#F9FAFC]">
          <div className="mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#0F7490] rounded-lg flex items-center justify-center">
                  <PlusOutlined className="text-white text-lg" />
                </div>
                <h1 className="text-3xl font-bold text-[#202938]">
                  Add New Subject
                </h1>
              </div>
              <p className="text-gray-600">
                Create and configure a new teaching subject
              </p>
            </div>

            <div className="bg-white border-0 rounded-2xl overflow-hidden p-6">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                  name: "",
                  code: "",
                  description: "",
                  category: "",
                  gradeLevel: "",
                  status: "active",
                }}
                className="space-y-6"
              >
                {/* Basic Information */}
                <div className="bg-gray-50  rounded-xl">
                  <h3 className="text-xl font-semibold text-[#202938] mb-4 flex items-center gap-2">
                    <BookOutlined className="text-[#0F7490]" />
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                      label={
                        <span className="text-[#202938] font-medium">
                          Subject Name *
                        </span>
                      }
                      name="name"
                      normalize={(v) => (typeof v === "string" ? v : "")}
                      rules={[
                        {
                          required: true,
                          message: "Please enter subject name",
                        },
                        {
                          validator: (_, value) =>
                            !value || value.trim().length >= 2
                              ? Promise.resolve()
                              : Promise.reject(
                                  new Error(
                                    "Subject name must be at least 2 characters"
                                  )
                                ),
                        },
                      ]}
                    >
                      <Input
                        placeholder="e.g., Mathematics, Physics, Biology"
                        className="px-4 py-3 rounded-lg border hover:border-[#0F7490] focus:border-[#0F7490]"
                      />
                    </Form.Item>

                    <Form.Item
                      label={
                        <span className="text-[#202938] font-medium">
                          Subject Code *
                        </span>
                      }
                      name="code"
                      getValueFromEvent={(e) => e.target.value.toUpperCase()}
                      rules={[
                        {
                          required: true,
                          message: "Please enter subject code",
                        },
                        {
                          pattern: /^[A-Z]{2,3}[0-9]{2,3}$/,
                          message:
                            "Code format: 2-3 letters + 2-3 numbers (e.g., MTH101)",
                        },
                      ]}
                    >
                      <Input
                        placeholder="e.g., MTH101, PHY201"
                        className="px-4 py-3 rounded-lg border hover:border-[#0F7490] focus:border-[#0F7490]"
                      />
                    </Form.Item>
                  </div>

                  <Form.Item
                    label={
                      <span className="text-[#202938] font-medium">
                        Description *
                      </span>
                    }
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: "Please enter subject description",
                      },
                      {
                        validator: (_, value) =>
                          !value || value.trim().length >= 10
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error(
                                  "Description must be at least 10 characters"
                                )
                              ),
                      },
                    ]}
                  >
                    <TextArea
                      rows={3}
                      placeholder="Brief description of the subject content and objectives..."
                      className="px-4 py-3 rounded-lg border hover:border-[#0F7490] focus:border-[#0F7490] resize-none"
                    />
                  </Form.Item>
                </div>

                {/* Subject Configuration */}
                <div className="bg-gray-50  rounded-xl">
                  <h3 className="text-xl font-semibold text-[#202938] mb-4 flex items-center gap-2">
                    <FileTextOutlined className="text-[#0F7490]" />
                    Subject Configuration
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <Form.Item
                      label={
                        <span className="text-[#202938] font-medium">
                          Status *
                        </span>
                      }
                      name="status"
                      rules={[{ required: true }]}
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
                </div>

                {/* Visual Settings */}
                <div className="bg-gray-50  rounded-xl">
                  <h3 className="text-xl font-semibold text-[#202938] mb-4">
                    Visual Settings
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-3">
                      <label className="text-[#202938] font-medium block">
                        Subject Color
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {subjectColors.map((color) => (
                          <div
                            key={color.value}
                            className={`w-10 h-10 rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                              selectedColor === color.value
                                ? "border-[#202938] scale-110 shadow-lg"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                            style={{ backgroundColor: color.value }}
                            onClick={() => setSelectedColor(color.value)}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[#202938] font-medium block">
                        Preview
                      </label>
                      <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: selectedColor }}
                          >
                            {(form.getFieldValue("name") || "Su")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-[#202938] font-semibold">
                              {form.getFieldValue("name") || "Subject Name"}
                            </h4>
                            <p className="text-gray-500 text-sm">
                              Code: {form.getFieldValue("code") || "SUB101"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-end gap-4">
                    <Button
                      type="default"
                      onClick={handleReset}
                      className="px-8 py-3 text-gray-700 border border-gray-300 rounded-lg hover:border-gray-400"
                    >
                      Reset
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      className="px-8 py-3 bg-[#0F7490] text-white rounded-lg hover:!bg-[#0d5f75]"
                      icon={!loading ? <PlusOutlined /> : undefined}
                    >
                      {loading ? "Adding..." : "Add Subject"}
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default AddSubjectForm;
