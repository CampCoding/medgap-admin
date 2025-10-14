"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  ConfigProvider,
  Alert,
  message,
  Descriptions,
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  HomeOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllModules, handleGetModuleStudents } from "@/features/modulesSlice";

const PALETTE = {
  primary: "#0F7490",
  text: "#202938",
};

const REGISTER_URL = "https://medgap.camp-coding.site/api/student/auth/register";

export default function AddStudentModal({ open, onCancel, onSuccess, id }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null); // store API response on success
  const dispatch = useDispatch();

  // NOTE: selector name as you provided
  const { list_module_data } = useSelector((state) => state?.modules || {});

  // Normalize modules array shape (supports both {data:{modules:[]}} and {modules:[]})
  const modulesArr = useMemo(
    () =>
      list_module_data?.data?.modules ||
      list_module_data?.modules ||
      [],
    [list_module_data]
  );

  // Build Select options
  const moduleOptions = useMemo(
    () =>
      (modulesArr || []).map((m) => ({
        label: `${m.subject_name || m.name || `Module ${m.module_id || m.id}`} • ${m.subject_code || m.code || ""}`.trim(),
        value: m.module_id ?? m.id, // API shows module_id
        raw: m,
      })),
    [modulesArr]
  );

  useEffect(() => {
    // fetch modules for the multi-select
    dispatch(handleGetAllModules());
  }, [dispatch]);

  const handleClose = () => {
    form.resetFields();
    setCreated(null);
    onCancel?.();
  };

  const handleFinish = async (values) => {
    // values.modules = array of module IDs
    const payload = {
      full_name: values.full_name?.trim(),
      email: values.email?.trim(),
      password: values.password,
      phone: values.phone?.trim(),
      date_of_birth: values.date_of_birth?.format("YYYY-MM-DD"),
      gender: values.gender,
      address: values.address?.trim(),
      modules: Array.isArray(values.modules) ? values.modules : [], // <— IMPORTANT
    };

    setLoading(true);
    try {
      const { data } = await axios.post(REGISTER_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(data);
      if (data?.status === "success") {
        message.success(data?.message || "Student registered successfully");
        // refresh students list for this module/course
        dispatch(handleGetModuleStudents({ id }));
        // prefer server object if returned, else persist what we sent
        const createdObj = data?.data ? { ...data.data } : { ...payload };
        // if server doesn't echo module names, store selected IDs for summary
        if (!createdObj.modules) createdObj.modules = payload.modules;
        setCreated(createdObj);
        onSuccess?.(data);
        // (اختياري) سيب الفورم مفتوح لإضافة طالب تاني أو اعمل reset:
        // form.resetFields();
      } else {
        message.error(data?.message || "Error while creating student");
      }
    } catch (err) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Registration failed";
      message.error(apiMsg);
    } finally {
      setLoading(false);
    }
  };

  // Map selected module IDs (from success object) to pretty labels for the summary
  const selectedModuleLabels = useMemo(() => {
    const idSet = new Set(
      (created?.modules && Array.isArray(created.modules) ? created.modules : [])
        // handle server may send full objects
        .map((m) => (typeof m === "object" ? (m.module_id ?? m.id) : m))
    );
    if (!idSet.size) return [];

    return moduleOptions
      .filter((opt) => idSet.has(opt.value))
      .map((opt) => opt.label);
  }, [created, moduleOptions]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: PALETTE.primary,
          colorText: PALETTE.text,
          borderRadius: 12,
          controlHeight: 44,
        },
      }}
    >
      <Modal
        open={open}
        onCancel={handleClose}
        footer={null}
        title={null}
        className="!w-full max-w-xl"
        destroyOnClose
      >
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[--ant-color-primary] rounded-lg flex items-center justify-center shadow-sm">
              <PlusOutlined className="text-white text-lg" />
            </div>
            <h2 className="text-2xl font-bold text-[--ant-color-text]">
              Register Student
            </h2>
          </div>
          <p className="text-gray-600">Add a student with basic credentials.</p>
        </div>

        {/* Success summary */}
        {created && (
          <div className="mb-5">
            <Alert
              type="success"
              showIcon
              message="Student created successfully"
              description="The student has been registered. Details are shown below."
              className="mb-3"
            />
            <Descriptions bordered size="middle" column={1} labelStyle={{ width: 180 }}>
              <Descriptions.Item label="Full Name">
                {created.full_name || created.name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">{created.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{created.phone}</Descriptions.Item>
              <Descriptions.Item label="Date of Birth">
                {created.date_of_birth}
              </Descriptions.Item>
              <Descriptions.Item label="Gender">{created.gender}</Descriptions.Item>
              <Descriptions.Item label="Address">{created.address}</Descriptions.Item>

              <Descriptions.Item label="Modules">
                {selectedModuleLabels.length ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedModuleLabels.map((lbl, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-700"
                      >
                        {lbl}
                      </span>
                    ))}
                  </div>
                ) : Array.isArray(created.modules) && created.modules.length ? (
                  // fallback: show raw IDs if names not available locally
                  created.modules.join(", ")
                ) : (
                  "—"
                )}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{
              full_name: "",
              email: "",
              password: "",
              phone: "",
              date_of_birth: null,
              gender: "Male",
              address: "",
              modules: [], // <— default empty
            }}
          >
            <Form.Item
              label="Full Name"
              name="full_name"
              rules={[
                { required: true, message: "Please enter full name" },
                {
                  validator: (_, v) =>
                    !v || v.trim().length >= 2
                      ? Promise.resolve()
                      : Promise.reject(new Error("Name must be at least 2 characters")),
                },
              ]}
            >
              <Input
                placeholder="e.g., محمد رضا عبدالغفار سليم"
                prefix={<UserOutlined className="text-gray-400 mr-2" />}
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input
                placeholder="example@email.com"
                prefix={<MailOutlined className="text-gray-400 mr-2" />}
              />
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                { required: true, message: "Please enter phone" },
                { pattern: /^[0-9+\-\s]{7,}$/, message: "Enter a valid phone number" },
              ]}
            >
              <Input placeholder="01026122660" prefix={<PhoneOutlined className="text-gray-400 mr-2" />} />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter password" },
                { min: 6, message: "At least 6 characters" },
              ]}
            >
              <Input.Password placeholder="********" prefix={<LockOutlined className="text-gray-400 mr-2" />} />
            </Form.Item>

            <Form.Item
              label="Date of Birth"
              name="date_of_birth"
              rules={[{ required: true, message: "Please select date of birth" }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Please select gender" }]}
            >
              <Select
                options={[
                  { label: "Male", value: "Male", icon: <ManOutlined /> },
                  { label: "Female", value: "Female", icon: <WomanOutlined /> },
                ]}
              />
            </Form.Item>

            <Form.Item label="Address" name="address">
              <Input placeholder="Zefta" prefix={<HomeOutlined className="text-gray-400 mr-2" />} />
            </Form.Item>

            {/* NEW: Modules Multi-Select */}
            <Form.Item
              label="Modules"
              name="modules"
              tooltip="Select one or more modules to enroll the student in."
              rules={[
                { required: true, message: "Please select at least one module" },
                {
                  validator: (_, v) =>
                    Array.isArray(v) && v.length > 0
                      ? Promise.resolve()
                      : Promise.reject(new Error("Select at least one module")),
                },
              ]}
            >
              <Select
                mode="multiple"
                allowClear
                placeholder={modulesArr.length ? "Select modules…" : "Loading modules…"}
                options={moduleOptions}
                optionFilterProp="label"
                maxTagCount="responsive"
                disabled={!modulesArr.length}
              />
            </Form.Item>

            <div className="border-t border-gray-200 pt-6 mt-2 flex justify-end gap-3">
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="!bg-blue-500 !text-white"
                icon={<PlusOutlined />}
              >
                {loading ? "Adding..." : "Add Student"}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </ConfigProvider>
  );
}
