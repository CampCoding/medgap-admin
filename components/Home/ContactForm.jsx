"use client";

import React, { useState } from "react";
import {
  Send,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Building,
  MessageSquare,
} from "lucide-react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
    subject: "",
    message: "",
    priority: "medium",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const roles = [
    "Teacher/Educator",
    "Administrator",
    "IT Manager",
    "Student",
    "Parent",
    "Other",
  ];

  const priorities = [
    {
      value: "low",
      label: "General Inquiry",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "medium",
      label: "Support Request",
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "high", label: "Urgent Issue", color: "bg-red-100 text-red-800" },
  ];

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      detail: "support@eduplatform.com",
      subtitle: "We respond within 2 hours",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      detail: "+1 (555) 123-4567",
      subtitle: "Mon-Fri, 9AM-6PM EST",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      detail: "123 Education St, Learning City",
      subtitle: "Schedule an appointment",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Response Time",
      detail: "< 2 hours",
      subtitle: "Average response time",
    },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    if (formData.message.length < 10)
      newErrors.message = "Message must be at least 10 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after success
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        organization: "",
        role: "",
        subject: "",
        message: "",
        priority: "medium",
      });
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const InputField = ({
    name,
    label,
    type = "text",
    required = false,
    icon,
    placeholder,
    rows,
  }) => (
    <div className="relative">
      <label
        className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
          focusedField === name ? "text-teal-600" : "text-gray-700"
        }`}
        style={{ color: focusedField === name ? "#0F7490" : "#202938" }}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <span
              style={{ color: focusedField === name ? "#0F7490" : "#9CA3AF" }}
            >
              {icon}
            </span>
          </div>
        )}

        {rows ? (
          <textarea
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onFocus={() => setFocusedField(name)}
            onBlur={() => setFocusedField(null)}
            rows={rows}
            placeholder={placeholder}
            className={`w-full ${
              icon ? "pl-10" : "pl-4"
            } pr-4 py-3 border-2 rounded-xl transition-all duration-300 resize-none ${
              errors[name]
                ? "border-red-300 bg-red-50"
                : focusedField === name
                ? "border-teal-500 bg-teal-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
            style={{
              borderColor: errors[name]
                ? "#FCA5A5"
                : focusedField === name
                ? "#0F7490"
                : "#E5E7EB",
              backgroundColor: errors[name]
                ? "#FEF2F2"
                : focusedField === name
                ? "#F0FDFA"
                : "white",
            }}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onFocus={() => setFocusedField(name)}
            onBlur={() => setFocusedField(null)}
            placeholder={placeholder}
            className={`w-full ${
              icon ? "pl-10" : "pl-4"
            } pr-4 py-3 border-2 rounded-xl transition-all duration-300 ${
              errors[name]
                ? "border-red-300 bg-red-50"
                : focusedField === name
                ? "border-teal-500 bg-teal-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
            style={{
              borderColor: errors[name]
                ? "#FCA5A5"
                : focusedField === name
                ? "#0F7490"
                : "#E5E7EB",
              backgroundColor: errors[name]
                ? "#FEF2F2"
                : focusedField === name
                ? "#F0FDFA"
                : "white",
            }}
          />
        )}
      </div>

      {errors[name] && (
        <div className="flex items-center mt-2 text-red-600 text-sm animate-fadeIn">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errors[name]}
        </div>
      )}
    </div>
  );

  if (isSubmitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ backgroundColor: "#F9FAFC" }}
      >
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <div
              className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center animate-bounce"
              style={{ backgroundColor: "#0F7490" }}
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: "#202938" }}
            >
              Message Sent! 🎉
            </h2>
            <p className="text-lg opacity-70 mb-6" style={{ color: "#202938" }}>
              Thank you for reaching out. We'll get back to you within 2 hours.
            </p>
            <div
              className="w-full h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: "#E5E7EB" }}
            >
              <div
                className="h-full rounded-full animate-pulse"
                style={{ backgroundColor: "#0F7490", width: "100%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-20 px-6"
      style={{ backgroundColor: "#F9FAFC" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
            style={{ backgroundColor: "#0F7490" }}
          >
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: "#202938" }}>
            Get In Touch
          </h1>
          <p
            className="text-xl opacity-70 max-w-2xl mx-auto"
            style={{ color: "#202938" }}
          >
            Have questions about our platform? Need support? We're here to help
            you succeed.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: "#202938" }}
              >
                Contact Information
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: "#0F7490" }}
                    >
                      <span className="text-white">{info.icon}</span>
                    </div>
                    <div>
                      <h3
                        className="font-semibold text-lg"
                        style={{ color: "#202938" }}
                      >
                        {info.title}
                      </h3>
                      <p className="font-medium" style={{ color: "#0F7490" }}>
                        {info.detail}
                      </p>
                      <p
                        className="text-sm opacity-70"
                        style={{ color: "#202938" }}
                      >
                        {info.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-teal-400 to-teal-600 flex flex-col items-center justify-center">
                <iframe
                className="w-full h-full"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27422.228416417503!2d31.199812966534015!3d30.78079412187662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f7c0b123c253d7%3A0x4140efbbb5f95e78!2z2LTYsdi02KfYqNip2Iwg2LLZgdiq2YnYjCDZhdit2KfZgdi42Kkg2KfZhNi62LHYqNmK2Kk!5e0!3m2!1sar!2seg!4v1753894235161!5m2!1sar!2seg"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

           
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h2
              className="text-2xl font-bold mb-6"
              style={{ color: "#202938" }}
            >
              Send us a Message
            </h2>

            <div className="space-y-6">
              {/* Name Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <InputField
                  name="firstName"
                  label="First Name"
                  required
                  icon={<User className="w-5 h-5" />}
                  placeholder="John"
                />
                <InputField
                  name="lastName"
                  label="Last Name"
                  required
                  icon={<User className="w-5 h-5" />}
                  placeholder="Doe"
                />
              </div>

              {/* Contact Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <InputField
                  name="email"
                  label="Email"
                  type="email"
                  required
                  icon={<Mail className="w-5 h-5" />}
                  placeholder="john@example.com"
                />
                <InputField
                  name="phone"
                  label="Phone"
                  type="tel"
                  icon={<Phone className="w-5 h-5" />}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Organization Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <InputField
                  name="organization"
                  label="Organization"
                  icon={<Building className="w-5 h-5" />}
                  placeholder="Your School/Company"
                />
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#202938" }}
                  >
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-4 pr-4 py-3 border-2 rounded-xl transition-all duration-300 bg-white"
                    style={{ borderColor: "#E5E7EB" }}
                  >
                    <option value="">Select your role</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject */}
              <InputField
                name="subject"
                label="Subject"
                placeholder="How can we help you?"
              />

              {/* Priority */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#202938" }}
                >
                  Priority Level
                </label>
                <div className="flex flex-wrap gap-3">
                  {priorities.map((priority) => (
                    <button
                      key={priority.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          priority: priority.value,
                        }))
                      }
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        formData.priority === priority.value
                          ? priority.color + " transform scale-105"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {priority.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <InputField
                name="message"
                label="Message"
                required
                rows={5}
                placeholder="Tell us more about your inquiry..."
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                  isSubmitting
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:shadow-lg transform hover:scale-105"
                }`}
                style={{ backgroundColor: "#0F7490" }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>

              {/* Form Footer */}
              <p
                className="text-sm text-center opacity-70"
                style={{ color: "#202938" }}
              >
                We typically respond within 2 hours during business hours.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ContactForm;
