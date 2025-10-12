"use client";

import React from "react";
import { SurveyForm } from "@/components/survey/SurveyForm";
import { Survey } from "@/lib/types";

export default function SurveyPage() {
  const handleSurveySave = (survey: Survey) => {
    // Survey is automatically saved to IndexedDB in the form component
    // You could add additional logic here if needed
    console.log("Survey saved:", survey);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Youth Vegetable Farming Survey
          </h1>
          <p className="text-gray-600 mt-2">
            Complete the survey form to collect data
          </p>
        </div>

        <SurveyForm onSave={handleSurveySave} />
      </div>
    </div>
  );
}
