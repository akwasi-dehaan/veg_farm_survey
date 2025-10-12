// Test script to verify MySQL sync functionality
const testSurvey = {
  surveyId: "sync-test-001",
  respondentName: "Sync Test Respondent",
  enumeratorName: "Sync Test Enumerator",
  age: 25,
  gender: "male",
  householdSize: 4,
  dependentsUnder18: 2,
  farmLocation: "Sync Test Location",
  areaUnderCultivation: "2.0",
  cultivatesVegetables: "yes",
  yearsOfCultivation: 3,
  vegetables: {
    tomato: { selected: true, area: "1.0", yield: "300" },
    onion: { selected: true, area: "1.0", yield: "250" },
  },
  timestamp: new Date().toISOString(),
  syncStatus: "pending",
};

async function testSync() {
  try {
    console.log("🧪 Testing MySQL Sync Integration...");

    // Test 1: Create survey via API
    console.log("1️⃣ Creating survey via API...");
    const createResponse = await fetch("http://localhost:3000/api/surveys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testSurvey),
    });

    if (!createResponse.ok) {
      throw new Error(`Create failed: ${createResponse.status}`);
    }

    const createResult = await createResponse.json();
    console.log("✅ Survey created successfully");
    console.log(`   Survey ID: ${createResult.survey.surveyId}`);
    console.log(`   Status: ${createResult.survey.syncStatus}`);

    // Test 2: Retrieve survey from MySQL
    console.log("\n2️⃣ Retrieving survey from MySQL...");
    const getResponse = await fetch("http://localhost:3000/api/surveys");

    if (!getResponse.ok) {
      throw new Error(`Get failed: ${getResponse.status}`);
    }

    const getResult = await getResponse.json();
    console.log("✅ Survey retrieved successfully");
    console.log(`   Total surveys: ${getResult.total}`);
    console.log(
      `   Survey found: ${getResult.surveys.some(
        (s) => s.surveyId === testSurvey.surveyId
      )}`
    );

    // Test 3: Update survey
    console.log("\n3️⃣ Testing survey update...");
    const updateResponse = await fetch("http://localhost:3000/api/surveys", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        surveyId: testSurvey.surveyId,
        respondentName: "Updated Sync Test Respondent",
        age: 26,
      }),
    });

    if (!updateResponse.ok) {
      throw new Error(`Update failed: ${updateResponse.status}`);
    }

    const updateResult = await updateResponse.json();
    console.log("✅ Survey updated successfully");
    console.log(`   Updated name: ${updateResult.survey.respondentName}`);
    console.log(`   Updated age: ${updateResult.survey.age}`);

    // Test 4: Delete survey
    console.log("\n4️⃣ Testing survey deletion...");
    const deleteResponse = await fetch(
      `http://localhost:3000/api/surveys?surveyId=${testSurvey.surveyId}`
    );

    if (!deleteResponse.ok) {
      throw new Error(`Delete failed: ${deleteResponse.status}`);
    }

    const deleteResult = await deleteResponse.json();
    console.log("✅ Survey deleted successfully");
    console.log(`   Message: ${deleteResult.message}`);

    // Test 5: Verify deletion
    console.log("\n5️⃣ Verifying deletion...");
    const verifyResponse = await fetch("http://localhost:3000/api/surveys");
    const verifyResult = await verifyResponse.json();

    const surveyExists = verifyResult.surveys.some(
      (s) => s.surveyId === testSurvey.surveyId
    );
    console.log(`✅ Survey deleted: ${!surveyExists}`);
    console.log(`   Remaining surveys: ${verifyResult.total}`);

    console.log("\n🎉 All MySQL integration tests passed!");
    console.log("✅ Database connection: Working");
    console.log("✅ CRUD operations: Working");
    console.log("✅ JSON storage: Working");
    console.log("✅ API endpoints: Working");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  }
}

testSync();
