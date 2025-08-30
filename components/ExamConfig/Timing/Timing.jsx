import React from "react";
import { Clock, Timer, AlertTriangle, Settings } from "lucide-react";

const TimingConfiguration = ({ formData, setFormData }) => {
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRadioChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const timingOptions = [
    {
      id: "enableExamTimer",
      label: "Enable Exam Timer",
      description: "Set a time limit for the entire exam",
      icon: Clock,
      iconColor: "text-blue-600",
    },
    {
      id: "showTimerToStudents",
      label: "Show Timer to Students",
      description: "Display countdown timer during the exam",
      icon: Timer,
      iconColor: "text-green-600",
    },
    {
      id: "autoSubmitWhenTimeExpires",
      label: "Auto-submit When Time Expires",
      description: "Automatically submit exam when timer reaches zero",
      icon: Settings,
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-3 rounded-xl mr-4 bg-amber-500">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: "#202938" }}>
            Configuration - Timing
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        {/* Timing Options */}
        <div className="space-y-4">
          {timingOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                  formData[option.id]
                    ? "border-cyan-600 bg-cyan-50 shadow-md"
                    : "border-gray-200 hover:border-cyan-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                      <IconComponent
                        className={`w-5 h-5 ${option.iconColor}`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3
                        className="text-lg font-semibold"
                        style={{ color: "#202938" }}
                      >
                        {option.label}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name={option.id}
                        checked={formData[option.id] === true}
                        onChange={() => handleRadioChange(option.id, true)}
                        className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
                      />
                      <span className="text-sm font-medium text-green-600">
                        Enable
                      </span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name={option.id}
                        checked={formData[option.id] === false}
                        onChange={() => handleRadioChange(option.id, false)}
                        className="w-4 h-4 text-gray-400 focus:ring-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-600">
                        Disable
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Warning at Minutes Remaining */}
        <div
          className={`p-5 rounded-xl border-2 transition-all duration-200 ${
            formData.enableWarning
              ? "border-cyan-600 bg-cyan-50 shadow-md"
              : "border-gray-200 hover:border-cyan-300 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-start space-x-4">
            <div className="flex items-center space-x-3 flex-1">
              <div className="p-2 rounded-lg bg-white shadow-sm">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "#202938" }}
                >
                  Warning at Minutes Remaining
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Show warning notification when specified time remains
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="enableWarning"
                  checked={formData.enableWarning === true}
                  onChange={() => handleRadioChange("enableWarning", true)}
                  className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-sm font-medium text-green-600">
                  Enable
                </span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="enableWarning"
                  checked={formData.enableWarning === false}
                  onChange={() => handleRadioChange("enableWarning", false)}
                  className="w-4 h-4 text-gray-400 focus:ring-gray-300"
                />
                <span className="text-sm font-medium text-gray-600">
                  Disable
                </span>
              </label>
            </div>
          </div>

          {/* Warning Minutes Input */}
          {formData.enableWarning && (
            <div className="mt-4 pt-4 border-t border-cyan-200">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Warning Time (minutes before exam ends)
              </label>
              <div className="relative max-w-xs">
                <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-500" />
                <input
                  type="number"
                  placeholder="e.g. 10"
                  min="1"
                  max="60"
                  value={formData.warningMinutes || ""}
                  onChange={(e) =>
                    handleInputChange("warningMinutes", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-yellow-300 border-opacity-50 focus:border-opacity-100 focus:outline-none transition-all duration-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* Timing Summary Card */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-200">
          <h3
            className="text-lg font-semibold mb-3"
            style={{ color: "#202938" }}
          >
            Timing Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              {/* <div className="bg-white p-3 rounded-lg">
                <div className="font-medium text-gray-700">Exam Duration</div>
                <div className="text-blue-600 font-semibold">
                  {formData.examDuration
                    ? `${formData.examDuration} minutes`
                    : "Not set"}
                </div>
              </div> */}
              <div className="bg-white p-3 rounded-lg">
                <div className="font-medium text-gray-700">
                  Timer Visibility
                </div>
                <div
                  className={`font-semibold ${
                    formData.showTimerToStudents
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {formData.showTimerToStudents
                    ? "Visible to students"
                    : "Hidden from students"}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-white p-3 rounded-lg">
                <div className="font-medium text-gray-700">Auto-submit</div>
                <div
                  className={`font-semibold ${
                    formData.autoSubmitWhenTimeExpires
                      ? "text-orange-600"
                      : "text-gray-400"
                  }`}
                >
                  {formData.autoSubmitWhenTimeExpires ? "Enabled" : "Disabled"}
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="font-medium text-gray-700">Warning Alert</div>
                <div
                  className={`font-semibold ${
                    formData.enableWarning ? "text-yellow-600" : "text-gray-400"
                  }`}
                >
                  {formData.enableWarning && formData.warningMinutes
                    ? `${formData.warningMinutes} min before end`
                    : formData.enableWarning
                    ? "Enabled (time not set)"
                    : "Disabled"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimingConfiguration;
