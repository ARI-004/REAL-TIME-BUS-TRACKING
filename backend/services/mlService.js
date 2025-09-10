import axios from "axios";

// Call FastAPI ML service for prediction
export async function getPrediction({ stopA, stopB, distance, traffic, hour, dayOfWeek }) {
  try {
    const payload = { stopA, stopB, distance, traffic, hour, dayOfWeek };
    const res = await axios.post("http://localhost:8000/predict", payload);
    return res.data;
  } catch (err) {
    console.error("❌ Error calling ML service:", err.message);
    throw new Error("Prediction service unavailable");
  }
}
