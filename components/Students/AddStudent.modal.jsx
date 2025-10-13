"use client";

import React, { useState } from "react";
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
import { conifgs } from "@/config";
import { toast } from "react-toastify";
import { handleGetModuleStudents } from "@/features/modulesSlice";
import { useDispatch } from "react-redux";

const PALETTE = {
  primary: "#0F7490",
  text: "#202938",
};

const REGISTER_URL =
  "https://medgap.camp-coding.site/api/student/auth/register";

export default function AddStudentModal({ open, onCancel, onSuccess, id }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null); // store API response on success
  const dispatch = useDispatch();
  const handleClose = () => {
    form.resetFields();
    setCreated(null);
    onCancel?.();
  };

  const handleFinish = async (values) => {
    const payload = {
      full_name: values.full_name?.trim(),
      email: values.email?.trim(),
      password: values.password,
      phone: values.phone?.trim(),
      date_of_birth: values.date_of_birth?.format("YYYY-MM-DD"),
      gender: values.gender,
      address: values.address?.trim(),
    };

    setLoading(true);
    try {
      const { data } = await axios.post(REGISTER_URL, payload, {
        headers: { "Content-Type": "application/json" },
        // auth : `Bearer ${conifgs.localStorageTokenName}`
      });
      console.log(data);
      if (data?.status == "success") {
        message.success(data?.message || "Student registered successfully");
        dispatch(handleGetModuleStudents({ id }));
        setCreated(data?.data || payload); // prefer server data; fallback to payload
        onSuccess?.(data);
      }else {
        message.error(data || data?.message || "Error While create Student")
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
            <Descriptions
              bordered
              size="middle"
              column={1}
              labelStyle={{ width: 160 }}
            >
              <Descriptions.Item label="Full Name">
                {created.full_name || created.name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {created.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {created.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Date of Birth">
                {created.date_of_birth}
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                {created.gender}
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {created.address}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}

        {/* Form (kept visible so user can add another quickly) */}
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
                      : Promise.reject(
                          new Error("Name must be at least 2 characters")
                        ),
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
                {
                  pattern: /^[0-9+\-\s]{7,}$/,
                  message: "Enter a valid phone number",
                },
              ]}
            >
              <Input
                placeholder="01026122660"
                prefix={<PhoneOutlined className="text-gray-400 mr-2" />}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter password" },
                { min: 6, message: "At least 6 characters" },
              ]}
            >
              <Input.Password
                placeholder="********"
                prefix={<LockOutlined className="text-gray-400 mr-2" />}
              />
            </Form.Item>

            <Form.Item
              label="Date of Birth"
              name="date_of_birth"
              rules={[
                { required: true, message: "Please select date of birth" },
              ]}
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
              <Input
                placeholder="Zefta"
                prefix={<HomeOutlined className="text-gray-400 mr-2" />}
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
