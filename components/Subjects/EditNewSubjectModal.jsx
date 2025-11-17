import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  handleGetAllModules,
  handleUpdateModule,
} from "../../features/modulesSlice";
import { toast } from "react-toastify";

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

const EditSubjectForm = ({ open, setOpen, rowData, setRowData }) => {
  const dispatch = useDispatch();
  const { update_module_loading } = useSelector((state) => state?.modules);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#8B5CF6");

  // Update form values and selected color when rowData changes
  useEffect(() => {
    if (rowData && open) {
      form.setFieldsValue({
        name: rowData?.name,
        code: rowData?.code,
        description: rowData?.description,
        status: rowData?.status,
      });
      setSelectedColor(rowData?.subject_color || "#8B5CF6");
    }
  }, [rowData, open, form]);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const data_send = {
        subject_name: values.name, // Use the form values, not rowData
        subject_code: values.code,
        description: values.description,
        status: values.status,
        subject_color: selectedColor,
      };

      console.log("Form Data:", data_send);

      dispatch(handleUpdateModule({ body: data_send, id: rowData?.id }))
        .unwrap()
        .then((res) => {
          console.log(res);
          if (res?.status === "success") {
            dispatch(handleGetAllModules());
            toast.success(res?.message);
            form.resetFields();
            setSelectedColor("#8B5CF6");
            setOpen(false);
            if (setRowData) setRowData(null); // Clear rowData
          } else {
            toast.error(res?.message || "Failed to update module");
          }
        })
        .catch((e) => {
          console.error("Error:", e);
          message.error(e?.response?.data?.message || "Failed to update module. Please try again.");
        });
    } catch (e) {
      console.error("Error:", e);
      message.error("Failed to update module. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    // Reset to the current rowData values
    form.setFieldsValue({
      name: rowData?.name,
      code: rowData?.code,
      description: rowData?.description,
      status: rowData?.status,
    });
    setSelectedColor(rowData?.subject_color || "#8B5CF6");
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedColor("#8B5CF6");
    if (setRowData) setRowData(null);
    setOpen(false);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0F7490",
          borderRadius: 12,
          controlHeight: 44,
        },
      }}
    >
      <Modal
        title={null}
        open={open}
        onCancel={handleCancel}
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
                  Edit Module
                </h1>
              </div>
              <p className="text-gray-600">
                Update the details for this teaching module
              </p>
            </div>

            <div className="bg-white border-0 rounded-2xl overflow-hidden p-6">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                className="space-y-6"
              >
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-xl font-semibold text-[#202938] mb-4 flex items-center gap-2">
                    <BookOutlined className="text-[#0F7490]" />
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                      label={<span className="text-[#202938] font-medium">Module Name *</span>}
                      name="name"
                      rules={[
                        { required: true, message: "Please enter module name" },
                        { min: 2, message: "Module name must be at least 2 characters" },
                      ]}
                    >
                      <Input
                        placeholder="e.g., Mathematics, Physics, Biology"
                        className="px-4 py-3 rounded-lg border hover:border-[#0F7490] focus:border-[#0F7490]"
                      />
                    </Form.Item>

                    <Form.Item
                      label={<span className="text-[#202938] font-medium">Module Code *</span>}
                      name="code"
                      normalize={(value) => (value ? value.toUpperCase() : "")}
                      rules={[
                        { required: true, message: "Please enter module code" },
                        {
                          pattern: /^[A-Z]{2,3}[0-9]{2,3}$/,
                          message: "Code format: 2-3 letters + 2-3 numbers (e.g., MTH101)",
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
                    label={<span className="text-[#202938] font-medium">Description *</span>}
                    name="description"
                    rules={[
                      { required: true, message: "Please enter module description" },
                      { min: 10, message: "Description must be at least 10 characters" },
                    ]}
                  >
                    <TextArea
                      rows={3}
                      placeholder="Brief description of the module content and objectives..."
                      className="px-4 py-3 rounded-lg border hover:border-[#0F7490] focus:border-[#0F7490] resize-none"
                    />
                  </Form.Item>
                </div>

                {/* Subject Configuration */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-xl font-semibold text-[#202938] mb-4 flex items-center gap-2">
                    <FileTextOutlined className="text-[#0F7490]" />
                    Module Configuration
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <Form.Item
                      label={<span className="text-[#202938] font-medium">Status *</span>}
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
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-xl font-semibold text-[#202938] mb-4">Visual Settings</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-3">
                      <label className="text-[#202938] font-medium block">Module Color</label>
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
                      <label className="text-[#202938] font-medium block">Preview</label>
                      <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: selectedColor }}
                          >
                            {(form.getFieldValue("name") || "Su").slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-[#202938] font-semibold">
                              {form.getFieldValue("name") || "Module Name"}
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
                      loading={update_module_loading || loading}
                      className="px-8 py-3 bg-[#0F7490] text-white rounded-lg hover:!bg-[#0d5f75]"
                      icon={!(update_module_loading || loading) ? <PlusOutlined /> : undefined}
                    >
                      {(update_module_loading || loading) ? "Updating..." : "Update Module"}
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

export default EditSubjectForm;