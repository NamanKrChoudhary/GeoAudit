import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// ---------------------------------------------------------
// 🛠️ CONFIGURATION (Updated from your Error Logs)
// ---------------------------------------------------------

// ⚠️ FIX FOR 405 ERROR:
// You were hitting "https://api-deploy-0ch6.onrender.com/" (the root).
// You usually need a specific "room" in the API, like "/predict" or "/detect".
// ASK YOUR ML TEAMMATE: "What is the endpoint slug? Is it /predict?"
const ML_URL_ENCROACHED =
  process.env.ML_URL_ENCROACHED ||
  "https://api-for-ench-detect.onrender.com/extract-plots"; // <--- CHANGE '/predict' TO REAL ENDPOINT

// This one looked correct in your logs (/analyze-land), but the data was wrong (422)
const ML_URL_USAGE =
  process.env.ML_URL_USAGE ||
  "https://unused-area-deployment.onrender.com/analyze-land";

// (Keep this one if you have a URL for it, otherwise keep localhost default)
const ML_URL_ALL =
  process.env.ML_URL_ALL ||
  "https://api-deploy-0ch6.onrender.com/extract-plots";

// ---------------------------------------------------------
// 🧩 HELPER: BETTER ERROR HANDLING
// ---------------------------------------------------------
const postFileToML = async (url, fileStream) => {
  const form = new FormData();
  form.append("file", fileStream); // Standard key 'file'

  try {
    const response = await axios.post(url, form, {
      headers: { ...form.getHeaders() },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, "postFileToML");
  }
};

// ---------------------------------------------------------
// 🕵️ DETECTIVE FUNCTION (Logs the specific 422 details)
// ---------------------------------------------------------
const handleAxiosError = (error, functionName) => {
  console.error(`\n🚨 Error in ${functionName}:`);

  if (error.response) {
    // The server responded with a status code out of range of 2xx
    console.error(
      `Status: ${error.response.status} (${error.response.statusText})`,
    );
    console.error(`URL: ${error.config.url}`);

    // THIS IS THE GOLD MINE FOR 422 ERRORS 👇
    if (error.response.data && error.response.data.detail) {
      console.error(
        "❌ ML SERVER SAYS:",
        JSON.stringify(error.response.data.detail, null, 2),
      );
    } else {
      console.error("Response Data:", error.response.data);
    }
  } else if (error.request) {
    console.error("❌ No response received from ML server. Is it awake?");
  } else {
    console.error("❌ Request setup error:", error.message);
  }
  throw error; // Re-throw so the main controller knows it failed
};

// ---------------------------------------------------------
// 🚀 EXPORTED SERVICES
// ---------------------------------------------------------

// API 1: Get All Plots (Vectors)
export const getAllPlots = async (filePath) => {
  console.log("📡 Calling API 1 (All Plots)...");
  // Assuming 'file' is the key here too
  return await postFileToML(ML_URL_ALL, fs.createReadStream(filePath));
};

// API 2: Get Encroached Plots (Vectors)
export const getEncroachedPlots = async (filePath) => {
  console.log(`📡 Calling API 2 (Encroached Plots) at ${ML_URL_ENCROACHED}...`);
  return await postFileToML(ML_URL_ENCROACHED, fs.createReadStream(filePath));
};

// API 3: Get Usage Stats (The one giving 422)
export const getUsageStats = async (satellitePath, plotMapPath) => {
  console.log(`📡 Calling API 3 (Usage Stats) at ${ML_URL_USAGE}...`);

  const form = new FormData();

  // ⚠️ POTENTIAL ISSUE:
  // Python FastAPI often defaults to 'file' or 'files'.
  // If the ML guy defined specific names, these must match EXACTLY.
  form.append("satellite_file", fs.createReadStream(satellitePath));
  form.append("layout_file", fs.createReadStream(plotMapPath));

  try {
    const response = await axios.post(ML_URL_USAGE, form, {
      headers: { ...form.getHeaders() },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, "getUsageStats");
  }
};
