"use client";
import React, { useState } from "react";
import { Settings, Calendar, Clock, Users } from "lucide-react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import Avilability from "./Avilability/Avilability";
import Timing from "./Timing/Timing";
import ReviewConfiguration from "./Review/Review";
import SecurityConfiguration from "./Security/Security";

const Configuration = ({ formData, setFormData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    {
      label: "Avilability",
      component: <Avilability formData={formData} setFormData={setFormData} />,
    },
    {
      label: "Timing",
      component: <Timing formData={formData} setFormData={setFormData} />,
    },
    {
      label: "Review",
      component: (
        <ReviewConfiguration formData={formData} setFormData={setFormData} />
      ),
    },
    {
      label: "Security",
      component: (
        <SecurityConfiguration formData={formData} setFormData={setFormData} />
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-4">
        {/* Tab Navigation */}
        <div className="relative">
          {/* Background bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200"></div>

          {/* Active tab indicator */}
          <div
            className="absolute bottom-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 ease-out"
            style={{
              width: `${100 / steps.length}%`,
              left: `${(currentStep * 100) / steps.length}%`,
            }}
          ></div>

          {/* Tab buttons */}
          <div className="flex relative">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ease-out relative group ${
                  currentStep === index
                    ? "text-cyan-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {/* Hover background */}
                <div
                  className={`absolute inset-0 ${
                    currentStep == index
                      ? ""
                      : "group-hover:opacity-100 bg-gray-50"
                  } opacity-0  transition-opacity duration-200 rounded-t-lg`}
                ></div>

                {/* Content */}
                <div className="relative flex items-center justify-center gap-2">
                  <span className="text-base">{step.icon}</span>
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden">{step.label.slice(0, 4)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {steps[currentStep].component}
      </div>
    </div>
  );
};

export default Configuration;
