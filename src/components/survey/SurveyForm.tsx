import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Radio } from "@/components/ui/Radio";
import { Notification } from "@/components/ui/Notification";
import { EnumeratorInstructions } from "./EnumeratorInstructions";
// import { InitialDataCollection } from "./InitialDataCollection";
import { SectionA } from "./SectionA";
import { SectionB } from "./SectionB";
import { SectionC } from "./SectionC";
import { SectionD } from "./SectionD";
import { SectionE } from "./SectionE";
import { SectionF } from "./SectionF";
import { SectionG } from "./SectionG";
import { SectionH } from "./SectionH";
import { SectionI } from "./SectionI";
import { SurveyPreview } from "./SurveyPreview";
import { SubmissionSuccess } from "./SubmissionSuccess";
import { Survey, NotificationState } from "@/lib/types";
import { validateSurvey, generateSurveyId } from "@/lib/validation";
import { saveSurvey } from "@/lib/db";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

interface SurveyFormProps {
  onSave?: (survey: Survey) => void;
}

export const SurveyForm: React.FC<SurveyFormProps> = ({ onSave }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<Partial<Survey>>({
    surveyId: generateSurveyId(),
    enumeratorName: "",
    date: new Date().toISOString().split("T")[0],
    location: "",
    consent: "",
    timestamp: new Date().toISOString(),
    syncStatus: "pending",

    // Initialize all sections with default values
    respondentName: "",
    sex: "",
    age: 0,
    maritalStatus: "",
    education: "",
    mainOccupation: "",
    farmingPrimaryIncome: "",
    householdSize: 0,
    dependentsUnder18: 0,

    cultivatesVegetables: "",
    yearsOfCultivation: 0,
    farmLocation: "",
    landOwnership: "",
    landOwnershipOther: "",
    areaUnderCultivation: "",
    farmingPractice: [],
    farmingPracticeOther: "",
    irrigates: "",
    irrigationSource: "",
    irrigationSourceOther: "",
    cultivationFrequency: "",
    leverageTechnology: "",

    vegetables: {},
    vegetablesOther: "",
    seedSource: [],
    seedSourceOther: "",
    avgProductionPerSeason: "",
    usesFertilizers: "",
    fertilizerType: "",
    fertilizerTypeOther: "",
    usesPesticides: "",
    pesticideTypesDetails: "",

    sellsProduce: "",
    mainBuyers: [],
    mainBuyersOther: "",
    sellingMethod: "",
    sellingMethodOther: "",
    monthlyIncome: "",
    hasRegularBuyer: "",
    belongsToGroup: "",
    groupName: "",
    groupRole: "",
    groupRoleOther: "",
    farmManagementPractices: "",
    farmManagementPracticesOther: "",

    hasExtensionAccess: "",
    extensionSource: "",
    extensionSourceOther: "",
    receivedTraining: "",
    trainingTopics: "",
    trainingYear: "",
    hasCredit: "",
    creditSource: "",
    creditSourceOther: "",
    inputAccess: "",
    hasStorage: "",

    challenges: {},
    challengeOther: "",
    mostImportantChallenge: "",
    triedStrategies: "",
    strategies: "",
    strategiesSuccessful: "",

    ownsMobilePhone: "",
    usesInternetForFarming: "",
    platforms: [],
    platformsOther: "",
    wouldUseSMS: "",
    interestedInClimate: "",

    plansToContinue: "",
    encourageExpansion1: "",
    encourageExpansion2: "",
    encourageExpansion3: "",
    supportNeeded1: "",
    supportNeeded2: "",
    supportNeeded3: "",

    improvement1: "",
    improvement2: "",
    improvement3: "",
    additionalComments: "",
    enumeratorComments: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: "success",
    message: "",
  });
  const isOnline = useOnlineStatus();

  const sections = [
    "Survey Information & Consent",
    "Enumerator Instructions",
    "Household & Respondent Biodata",
    "Farm Profile",
    "Vegetables",
    "Marketing",
    "Services",
    "Challenges",
    "Technology",
    "Aspirations",
    "Suggestions",
    "Preview & Submit",
  ];

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateCurrentSection = (): boolean => {
    const currentErrors: { [key: string]: string } = {};

    // Section-specific validation
    switch (currentSection) {
      case 0: // Initial Data Collection (no validation needed)
        break;
      case 1: // Enumerator Instructions (no validation needed)
        break;
      case 2: // Section A
        if (!formData.respondentName) currentErrors.respondentName = "Required";
        if (!formData.sex) currentErrors.sex = "Required";
        if (
          formData.age === undefined ||
          formData.age === null ||
          formData.age < 0
        )
          currentErrors.age = "Required";
        if (!formData.maritalStatus) currentErrors.maritalStatus = "Required";
        if (!formData.education) currentErrors.education = "Required";
        if (!formData.mainOccupation) currentErrors.mainOccupation = "Required";
        if (!formData.farmingPrimaryIncome)
          currentErrors.farmingPrimaryIncome = "Required";
        if (
          formData.householdSize === undefined ||
          formData.householdSize === null ||
          formData.householdSize < 0
        )
          currentErrors.householdSize = "Required";
        if (
          formData.dependentsUnder18 === undefined ||
          formData.dependentsUnder18 === null ||
          formData.dependentsUnder18 < 0
        )
          currentErrors.dependentsUnder18 = "Required";
        break;
      case 3: // Section B
        if (!formData.cultivatesVegetables)
          currentErrors.cultivatesVegetables = "Required";
        if (formData.cultivatesVegetables === "yes") {
          if (
            formData.yearsOfCultivation === undefined ||
            formData.yearsOfCultivation === null ||
            formData.yearsOfCultivation < 0
          )
            currentErrors.yearsOfCultivation = "Required";
          if (!formData.farmLocation) currentErrors.farmLocation = "Required";
          if (!formData.landOwnership) currentErrors.landOwnership = "Required";
          if (!formData.areaUnderCultivation)
            currentErrors.areaUnderCultivation = "Required";
          if (
            !formData.farmingPractice ||
            formData.farmingPractice.length === 0
          )
            currentErrors.farmingPractice = "Required";
          if (!formData.irrigates) currentErrors.irrigates = "Required";
          if (formData.irrigates === "yes" && !formData.irrigationSource)
            currentErrors.irrigationSource = "Required";
          if (!formData.cultivationFrequency)
            currentErrors.cultivationFrequency = "Required";
          if (!formData.leverageTechnology)
            currentErrors.leverageTechnology = "Required";
        }
        break;
      case 4: // Section C
        if (!formData.seedSource || formData.seedSource.length === 0)
          currentErrors.seedSource = "Required";
        if (!formData.avgProductionPerSeason)
          currentErrors.avgProductionPerSeason = "Required";
        if (!formData.usesFertilizers)
          currentErrors.usesFertilizers = "Required";
        if (formData.usesFertilizers === "yes" && !formData.fertilizerType)
          currentErrors.fertilizerType = "Required";
        if (!formData.usesPesticides) currentErrors.usesPesticides = "Required";
        if (
          formData.usesPesticides === "yes" &&
          !formData.pesticideTypesDetails
        )
          currentErrors.pesticideTypesDetails = "Required";
        break;
      case 5: // Section D
        if (!formData.sellsProduce) currentErrors.sellsProduce = "Required";
        if (formData.sellsProduce === "yes") {
          if (!formData.mainBuyers || formData.mainBuyers.length === 0)
            currentErrors.mainBuyers = "Required";
          if (!formData.sellingMethod) currentErrors.sellingMethod = "Required";
          if (!formData.monthlyIncome) currentErrors.monthlyIncome = "Required";
          if (!formData.hasRegularBuyer)
            currentErrors.hasRegularBuyer = "Required";
          if (!formData.belongsToGroup)
            currentErrors.belongsToGroup = "Required";
          if (formData.belongsToGroup === "yes") {
            if (!formData.groupName) currentErrors.groupName = "Required";
            if (!formData.groupRole) currentErrors.groupRole = "Required";
          }
          if (!formData.farmManagementPractices)
            currentErrors.farmManagementPractices = "Required";
        }
        break;
      // Add validation for other sections as needed
    }

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentSection()) {
      let nextSection = currentSection + 1;

      // Skip logic: If in Section B (index 2) and cultivatesVegetables is "no", skip to Section F (index 6)
      if (currentSection === 2 && formData.cultivatesVegetables === "no") {
        nextSection = 6; // Skip to Section F
      }

      // If we're at the last regular section (Section I, index 9), go to preview (index 10)
      if (currentSection === 9) {
        nextSection = 10; // Go to preview
      }

      setCurrentSection(Math.min(nextSection, sections.length - 1));
    }
  };

  const handlePrevious = () => {
    let previousSection = currentSection - 1;

    // Reverse skip logic: If in Section F (index 6) and cultivatesVegetables is "no", go back to Section B (index 2)
    if (currentSection === 6 && formData.cultivatesVegetables === "no") {
      previousSection = 2; // Go back to Section B
    }

    setCurrentSection(Math.max(previousSection, 0));
  };

  const handleSubmit = async () => {
    if (validateCurrentSection()) {
      try {
        await saveSurvey(formData as Survey);

        setNotification({
          show: true,
          type: "success",
          message: "Survey saved successfully!",
        });

        if (onSave) {
          onSave(formData as Survey);
        }

        // Show success page
        setIsSubmitted(true);
      } catch (error) {
        setNotification({
          show: true,
          type: "error",
          message: "Failed to save survey. Please try again.",
        });
      }
    }
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0: // Initial Data Collection
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                Survey Information
              </h3>
              <p className="text-blue-700">
                Please fill in the basic survey information before starting the
                interview.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Survey ID */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Survey ID
                  </label>
                  <Input
                    type="text"
                    value={formData.surveyId || ""}
                    disabled
                    className="bg-gray-100"
                    placeholder="Auto-generated"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This ID is automatically generated
                  </p>
                </div>

                {/* Enumerator Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enumerator Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.enumeratorName || ""}
                    onChange={(e) =>
                      handleFieldChange("enumeratorName", e.target.value)
                    }
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date (YYYY-MM-DD) *
                  </label>
                  <Input
                    type="date"
                    value={formData.date || ""}
                    onChange={(e) => handleFieldChange("date", e.target.value)}
                  />
                </div>

                {/* Location */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location (Region/District/Community) *
                  </label>
                  <Input
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) =>
                      handleFieldChange("location", e.target.value)
                    }
                    placeholder="e.g., Greater Accra Region, Accra Metropolitan, Jamestown"
                  />
                </div>
              </div>
            </div>

            {/* Consent Section */}
            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Consent Process
              </h4>

              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-700">
                  <strong>Consent Script:</strong> "I am conducting a survey
                  about youth vegetable farming. This survey is voluntary and
                  your responses will be kept confidential. The information will
                  be used for research purposes only. Do you consent to
                  participate in this survey?"
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Respondent gave consent? *
                </label>
                <Radio
                  name="consent"
                  value={formData.consent || ""}
                  onChange={(value) => handleFieldChange("consent", value)}
                  options={[
                    { value: "yes", label: "Yes - Proceed with survey" },
                    { value: "no", label: "No - End interview" },
                  ]}
                />
              </div>

              {formData.consent === "no" && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">
                    <strong>Note:</strong> Survey cannot proceed without
                    consent. Please thank the respondent and end the interview.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end">
              <Button
                onClick={() => setCurrentSection(1)}
                variant="primary"
                disabled={formData.consent === "no"}
              >
                {formData.consent === "no" ? "End Interview" : "Start Survey"}
              </Button>
            </div>
          </div>
        );

      case 1: // Enumerator Instructions
        return <EnumeratorInstructions onStart={() => setCurrentSection(2)} />;

      case 2: // Section A
        return (
          <SectionA
            data={{
              respondentName: formData.respondentName || "",
              sex: formData.sex || "",
              age: formData.age || 0,
              maritalStatus: formData.maritalStatus || "",
              education: formData.education || "",
              mainOccupation: formData.mainOccupation || "",
              farmingPrimaryIncome: formData.farmingPrimaryIncome || "",
              householdSize: formData.householdSize || 0,
              dependentsUnder18: formData.dependentsUnder18 || 0,
            }}
            onChange={handleFieldChange}
            errors={errors}
          />
        );

      case 3:
        return (
          <SectionB
            data={{
              cultivatesVegetables: formData.cultivatesVegetables || "",
              yearsOfCultivation: formData.yearsOfCultivation || 0,
              farmLocation: formData.farmLocation || "",
              landOwnership: formData.landOwnership || "",
              landOwnershipOther: formData.landOwnershipOther || "",
              areaUnderCultivation: formData.areaUnderCultivation || "",
              farmingPractice: formData.farmingPractice || [],
              farmingPracticeOther: formData.farmingPracticeOther || "",
              irrigates: formData.irrigates || "",
              irrigationSource: formData.irrigationSource || "",
              irrigationSourceOther: formData.irrigationSourceOther || "",
              cultivationFrequency: formData.cultivationFrequency || "",
              leverageTechnology: formData.leverageTechnology || "",
            }}
            onChange={handleFieldChange}
            errors={errors}
          />
        );

      case 4:
        return (
          <SectionC
            data={{
              vegetables: formData.vegetables || {},
              vegetablesOther: formData.vegetablesOther || "",
              seedSource: formData.seedSource || [],
              seedSourceOther: formData.seedSourceOther || "",
              avgProductionPerSeason: formData.avgProductionPerSeason || "",
              usesFertilizers: formData.usesFertilizers || "",
              fertilizerType: formData.fertilizerType || "",
              fertilizerTypeOther: formData.fertilizerTypeOther || "",
              usesPesticides: formData.usesPesticides || "",
              pesticideTypesDetails: formData.pesticideTypesDetails || "",
            }}
            onChange={handleFieldChange}
            errors={errors}
          />
        );

      case 5:
        return (
          <SectionD
            data={{
              sellsProduce: formData.sellsProduce || "",
              mainBuyers: formData.mainBuyers || [],
              mainBuyersOther: formData.mainBuyersOther || "",
              sellingMethod: formData.sellingMethod || "",
              sellingMethodOther: formData.sellingMethodOther || "",
              monthlyIncome: formData.monthlyIncome || "",
              hasRegularBuyer: formData.hasRegularBuyer || "",
              belongsToGroup: formData.belongsToGroup || "",
              groupName: formData.groupName || "",
              groupRole: formData.groupRole || "",
              groupRoleOther: formData.groupRoleOther || "",
              farmManagementPractices: formData.farmManagementPractices || "",
              farmManagementPracticesOther:
                formData.farmManagementPracticesOther || "",
            }}
            onChange={handleFieldChange}
            errors={errors}
          />
        );

      case 6:
        return (
          <SectionE
            data={{
              hasExtensionAccess: formData.hasExtensionAccess || "",
              extensionSource: formData.extensionSource || "",
              extensionSourceOther: formData.extensionSourceOther || "",
              receivedTraining: formData.receivedTraining || "",
              trainingTopics: formData.trainingTopics || "",
              trainingYear: formData.trainingYear || "",
              hasCredit: formData.hasCredit || "",
              creditSource: formData.creditSource || "",
              creditSourceOther: formData.creditSourceOther || "",
              inputAccess: formData.inputAccess || "",
              hasStorage: formData.hasStorage || "",
            }}
            onChange={handleFieldChange}
            errors={errors}
          />
        );

      case 7:
        return (
          <SectionF
            data={{
              challenges: formData.challenges || {},
              challengeOther: formData.challengeOther || "",
              mostImportantChallenge: formData.mostImportantChallenge || "",
              triedStrategies: formData.triedStrategies || "",
              strategies: formData.strategies || "",
              strategiesSuccessful: formData.strategiesSuccessful || "",
            }}
            onChange={handleFieldChange}
            errors={errors}
          />
        );

      case 8:
        return (
          <SectionG
            data={{
              ownsMobilePhone: formData.ownsMobilePhone || "",
              usesInternetForFarming: formData.usesInternetForFarming || "",
              platforms: formData.platforms || [],
              platformsOther: formData.platformsOther || "",
              wouldUseSMS: formData.wouldUseSMS || "",
              interestedInClimate: formData.interestedInClimate || "",
            }}
            onChange={handleFieldChange}
            errors={errors}
          />
        );

      case 9:
        return (
          <SectionH
            data={{
              plansToContinue: formData.plansToContinue || "",
              encourageExpansion1: formData.encourageExpansion1 || "",
              encourageExpansion2: formData.encourageExpansion2 || "",
              encourageExpansion3: formData.encourageExpansion3 || "",
              supportNeeded1: formData.supportNeeded1 || "",
              supportNeeded2: formData.supportNeeded2 || "",
              supportNeeded3: formData.supportNeeded3 || "",
            }}
            onChange={handleFieldChange}
            errors={errors}
          />
        );

      case 10:
        return (
          <SectionI
            data={{
              improvement1: formData.improvement1 || "",
              improvement2: formData.improvement2 || "",
              improvement3: formData.improvement3 || "",
              additionalComments: formData.additionalComments || "",
              enumeratorComments: formData.enumeratorComments || "",
            }}
            onChange={handleFieldChange}
            errors={errors}
          />
        );

      case 11:
        return (
          <SurveyPreview
            data={formData as Survey}
            onEdit={(section) => setCurrentSection(section)}
          />
        );

      default:
        return null;
    }
  };

  // Show success page after submission
  if (isSubmitted) {
    return (
      <SubmissionSuccess
        survey={formData as Survey}
        onNewSurvey={() => {
          setIsSubmitted(false);
          setCurrentSection(0);
          setFormData({
            surveyId: generateSurveyId(),
            enumeratorName: "",
            date: new Date().toISOString().split("T")[0],
            location: "",
            consent: "",
            timestamp: new Date().toISOString(),
            syncStatus: "pending",
            // Reset all form fields
            respondentName: "",
            sex: "",
            age: 0,
            maritalStatus: "",
            education: "",
            mainOccupation: "",
            farmingPrimaryIncome: "",
            householdSize: 0,
            dependentsUnder18: 0,
            cultivatesVegetables: "",
            yearsOfCultivation: 0,
            areaUnderCultivation: "",
            farmLocation: "",
            landOwnership: "",
            landOwnershipOther: "",
            irrigationSource: "",
            irrigationSourceOther: "",
            farmingPractice: [],
            farmingPracticeOther: "",
            vegetables: {},
            vegetablesOther: "",
            seedSource: [],
            seedSourceOther: "",
            fertilizerType: "",
            fertilizerTypeOther: "",
            usesPesticides: "",
            pesticideTypesDetails: "",
            mainBuyers: [],
            mainBuyersOther: "",
            sellingMethod: "",
            sellingMethodOther: "",
            monthlyIncome: "",
            hasRegularBuyer: "",
            belongsToGroup: "",
            groupName: "",
            groupRole: "",
            groupRoleOther: "",
            farmManagementPractices: "",
            farmManagementPracticesOther: "",
            hasExtensionAccess: "",
            extensionSource: "",
            extensionSourceOther: "",
            receivedTraining: "",
            trainingTopics: "",
            trainingYear: "",
            hasCredit: "",
            creditSource: "",
            creditSourceOther: "",
            inputAccess: "",
            hasStorage: "",
            challenges: {},
            challengeOther: "",
            mostImportantChallenge: "",
            triedStrategies: "",
            strategies: "",
            strategiesSuccessful: "",
            platforms: [],
            platformsOther: "",
            plansToContinue: "",
            encourageExpansion1: "",
            encourageExpansion2: "",
            encourageExpansion3: "",
            supportNeeded1: "",
            supportNeeded2: "",
            supportNeeded3: "",
            improvement1: "",
            improvement2: "",
            improvement3: "",
            additionalComments: "",
            enumeratorComments: "",
          });
        }}
        onViewDashboard={() => {
          window.location.href = "/dashboard";
        }}
        onExportData={() => {
          // This would trigger data export
          console.log("Export data functionality");
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Youth Farming Survey
          </h2>
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isOnline ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm text-gray-600">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Section {currentSection + 1} of {sections.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentSection + 1) / sections.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentSection + 1) / sections.length) * 100}%`,
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {sections[currentSection]}
          </p>
        </div>
      </div>

      {renderCurrentSection()}

      {currentSection !== 0 && (
        <div className="flex justify-between mt-8">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentSection === 1}
          >
            Previous
          </Button>

          <div className="flex space-x-4">
            {currentSection === 11 ? (
              <Button onClick={handleSubmit} variant="primary">
                Submit Survey
              </Button>
            ) : (
              <Button onClick={handleNext} variant="primary">
                Next
              </Button>
            )}
          </div>
        </div>
      )}

      <Notification
        show={notification.show}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ ...notification, show: false })}
        autoClose
      />
    </div>
  );
};
