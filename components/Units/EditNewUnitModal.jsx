"use client";

import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, ConfigProvider } from "antd";
import { SaveOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { handleEditUnit } from "../../features/unitsSlice";
import { toast } from "react-toastify";
import { handleGetModuleUnits } from "../../features/modulesSlice";

const { TextArea } = Input;

const PALETTE = { primary: "#0F7490", text: "#202938" };

function EditUnitForm({
  open,
  id: moduleId,      // module id
  unitId,            // unit id
  initialUnit,       // { unit_name, unit_description, unit_order, status }
  onCancel,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  console.log(moduleId);
  useEffect(() => {
    if (!open) return;
    form.setFieldsValue({
      unitName: initialUnit?.unit_name ?? "",
      description: initialUnit?.unit_description ?? "",
      order: initialUnit?.unit_order ?? 1,
      status: initialUnit?.status ?? "active",
    });
  }, [open, initialUnit, form]);

  const handleFinish = async (values) => {
    setLoading(true);
    const payload = {
      unit_name: values?.unitName?.trim(),
      unit_description: values?.description?.trim(),
      unit_order: Number(values?.order) || 1,
      status: values?.status,
    };

    try {
      const res = await dispatch(
        handleEditUnit({ id: moduleId, unitId, body: payload })
      ).unwrap();

      if (res?.status === "success") {
        toast.success(res?.message || "Unit updated successfully");
        dispatch(handleGetModuleUnits({ id: moduleId }));
        onCancel?.();
        form.resetFields();
      } else {
        toast.error(res?.message || "Failed to update unit");
      }
    } catch (e) {
      toast.error(e?.toString?.() || "Failed to update unit");
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
          onCancel?.();
        }}
        footer={null}
        className="!w-full max-w-4xl"
      >
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#0F7490] rounded-lg flex items-center justify-center shadow-sm">
                <EditOutlined className="text-white text-lg" />
              </div>
              <h2 className="text-3xl font-bold" style={{ color: PALETTE.text }}>
                Edit Unit{initialUnit?.unit_name ? `: ${initialUnit.unit_name}` : ""}
              </h2>
            </div>
            <p className="text-gray-600">Update this unit’s details.</p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{
              unitName: "",
              description: "",
              order: 1,
              status: "active",
            }}
            className="grid grid-cols-1 gap-6"
          >
            <div className="bg-gray-50 p-5 rounded-xl">
              <h3 className="text-lg font-semibold mb-4" style={{ color: PALETTE.text }}>
                Basic Information
              </h3>

              <Form.Item
                label={<span className="font-medium" style={{ color: PALETTE.text }}>Unit Name *</span>}
                name="unitName"
                rules={[
                  { required: true, message: "Please enter unit name" },
                  {
                    validator: (_, v) =>
                      !v || v.trim().length >= 2
                        ? Promise.resolve()
                        : Promise.reject(new Error("Name must be at least 2 characters")),
                  },
                ]}
              >
                <Input
                  placeholder="e.g., Algebra Basics"
                  className="rounded-lg px-4 py-3 border hover:border-[#0F7490] focus:border-[#0F7490]"
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-medium" style={{ color: PALETTE.text }}>Description *</span>}
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
                <TextArea
                  rows={4}
                  placeholder="What is covered in this unit..."
                  className="rounded-lg px-4 py-3 border hover:border-[#0F7490] focus:border-[#0F7490] resize-none"
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-medium" style={{ color: PALETTE.text }}>Order *</span>}
                name="order"
                rules={[
                  { required: true, message: "Please set the unit order" },
                  { type: "number", min: 1, message: "Order must be 1 or greater" },
                ]}
              >
                <Input
                  type="number"
                  min={1}
                  step={1}
                  placeholder="1"
                  className="rounded-lg px-4 py-3 border hover:border-[#0F7490] focus:border-[#0F7490]"
                  onChange={(e) => {
                    const v = e.target.value ? parseInt(e.target.value, 10) : undefined;
                    form.setFieldsValue({ order: v });
                  }}
                />
              </Form.Item>

              <div className="mb-3">
                <label className="font-medium block mb-2" style={{ color: PALETTE.text }}>
                  Status *
                </label>
                <Form.Item name="status" rules={[{ required: true }]} className="!mb-0">
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

            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-end gap-4">
                <Button
                  type="default"
                  onClick={() => {
                    form.resetFields();
                    onCancel?.();
                  }}
                  className="px-8 py-3 text-gray-700 border border-gray-300 rounded-lg hover:border-gray-400"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="px-8 py-3 bg-[#0F7490] text-white rounded-lg hover:!bg-[#0d5f75]"
                  icon={!loading ? <SaveOutlined /> : undefined}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </ConfigProvider>
  );
}

export default EditUnitForm;
