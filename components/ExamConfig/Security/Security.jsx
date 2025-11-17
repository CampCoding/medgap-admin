import React from "react";
import { Shield, Copy, MousePointer, Settings, Lock } from "lucide-react";

const SecurityConfiguration = ({ formData, setFormData }) => {
  const handleRadioChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const securityOptions = [
    {
      id: "blockCopyPaste",
      label: "Block Copy-Paste",
      description:
        "Prevent students from copying or pasting content during the exam",
      icon: Copy,
      iconColor: "text-red-600",
    },
    {
      id: "disableRightClick",
      label: "Disable Right-Click",
      description:
        "Disable right-click context menu to prevent access to browser functions",
      icon: MousePointer,
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-3 rounded-xl mr-4 bg-amber-500">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: "#202938" }}>
            Configuration - Security
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        {/* Security Options */}
        <div className="space-y-4">
          {securityOptions.map((option) => {
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

        {/* Security Summary Card */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-200">
          <h3
            className="text-lg font-semibold mb-3"
            style={{ color: "#202938" }}
          >
            Security Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg">
              <div className="font-medium text-gray-700">
                Copy-Paste Protection
              </div>
              <div
                className={`font-semibold ${
                  formData.blockCopyPaste ? "text-red-600" : "text-gray-400"
                }`}
              >
                {formData.blockCopyPaste ? "Blocked" : "Allowed"}
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="font-medium text-gray-700">Right-Click Menu</div>
              <div
                className={`font-semibold ${
                  formData.disableRightClick
                    ? "text-orange-600"
                    : "text-gray-400"
                }`}
              >
                {formData.disableRightClick ? "Disabled" : "Enabled"}
              </div>
            </div>
          </div>
        </div>

        {/* Security Level Indicator */}
        {(formData.blockCopyPaste || formData.disableRightClick) && (
          <div className="bg-red-50 p-5 rounded-xl border border-red-200">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-red-100">
                <Lock className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-red-900 mb-2">
                  Security Level:{" "}
                  {formData.blockCopyPaste && formData.disableRightClick
                    ? "High"
                    : "Medium"}
                </h4>
                <p className="text-sm text-red-800">
                  {formData.blockCopyPaste && formData.disableRightClick
                    ? "Maximum security measures are enabled. Students will have restricted browser functionality during the exam."
                    : "Some security measures are enabled. Consider enabling all options for maximum protection."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* No Security Warning */}
        {!formData.blockCopyPaste && !formData.disableRightClick && (
          <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Shield className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-semibold text-yellow-900 mb-2">
                  Security Level: Low
                </h4>
                <p className="text-sm text-yellow-800">
                  No security restrictions are currently enabled. Consider
                  enabling security measures to maintain exam integrity and
                  prevent potential cheating attempts.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityConfiguration;
