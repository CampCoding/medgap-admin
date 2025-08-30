import React from "react";
import { Settings, Calendar, Clock, Users } from "lucide-react";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const Avilability = ({ formData, setFormData }) => {
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateTimeChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value ? value.format("YYYY-MM-DD HH:mm:ss") : null,
    }));
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-3 rounded-xl mr-4 bg-amber-500">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: "#202938" }}>
            Configuration - Availability
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        {/* Start Date & Time */}
        <div>
          <label
            className="block text-base font-semibold mb-2"
            style={{ color: "#202938" }}
          >
            Start Date & Time
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-600 z-10" />
            <DatePicker
              showTime={{
                format: "HH:mm",
                minuteStep: 15,
              }}
              format="YYYY-MM-DD HH:mm"
              placeholder="Select start date and time"
              value={
                formData.startDateTime ? dayjs(formData.startDateTime) : null
              }
              onChange={(value) => handleDateTimeChange("startDateTime", value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-cyan-600 border-opacity-30 focus:border-opacity-100 transition-all duration-200"
              style={{
                height: "48px",
              }}
            />
          </div>
        </div>

        {/* End Date & Time */}
        <div>
          <label
            className="block text-base font-semibold mb-2"
            style={{ color: "#202938" }}
          >
            End Date & Time
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-600 z-10" />
            <DatePicker
              showTime={{
                format: "HH:mm",
                minuteStep: 15,
              }}
              format="YYYY-MM-DD HH:mm"
              placeholder="Select end date and time"
              value={formData.endDateTime ? dayjs(formData.endDateTime) : null}
              onChange={(value) => handleDateTimeChange("endDateTime", value)}
              disabledDate={(current) => {
                if (!formData.startDateTime) return false;
                return (
                  current &&
                  current < dayjs(formData.startDateTime).startOf("day")
                );
              }}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-cyan-600 border-opacity-30 focus:border-opacity-100 transition-all duration-200"
              style={{
                height: "48px",
              }}
            />
          </div>
        </div>

        {/* Maximum Attempts */}
        <div>
          <label
            className="block text-base font-semibold mb-2"
            style={{ color: "#202938" }}
          >
            Maximum Attempts
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
              <input
                type="number"
                placeholder="e.g. 3"
                min="1"
                max="10"
                value={formData.maxAttempts || ""}
                onChange={(e) =>
                  handleInputChange("maxAttempts", e.target.value)
                }
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-cyan-600 border-opacity-30 focus:border-opacity-100 focus:outline-none transition-all duration-200"
              />
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="bg-blue-50 p-3 rounded-xl w-full">
                <span className="font-medium">Recommended: 1-3 attempts</span>
                <br />
                <span className="text-xs">
                  Students can retry the exam up to this limit
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Availability Summary Card */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-200">
          <h3
            className="text-lg font-semibold mb-3"
            style={{ color: "#202938" }}
          >
            Availability Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg">
              <div className="font-medium text-gray-700">Opens</div>
              <div className="text-cyan-600 font-semibold">
                {formData.startDateTime
                  ? dayjs(formData.startDateTime).format(
                      "MMM DD, YYYY at HH:mm"
                    )
                  : "Not set"}
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="font-medium text-gray-700">Closes</div>
              <div className="text-amber-600 font-semibold">
                {formData.endDateTime
                  ? dayjs(formData.endDateTime).format("MMM DD, YYYY at HH:mm")
                  : "Not set"}
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="font-medium text-gray-700">Max Attempts</div>
              <div className="text-green-600 font-semibold">
                {formData.maxAttempts || "Not set"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .ant-picker {
          border-radius: 12px !important;
        }

        .ant-picker:hover {
          border-color: rgba(8, 145, 178, 0.6) !important;
        }

        .ant-picker-focused {
          border-color: rgba(8, 145, 178, 1) !important;
          box-shadow: none !important;
        }

        .ant-picker-input > input {
          font-size: 14px !important;
        }
      `}</style>
    </div>
  );
};

export default Avilability;
