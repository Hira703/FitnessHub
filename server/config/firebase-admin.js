const admin = require("firebase-admin");

let serviceAccount;

if (process.env.FB_SERVICE_KEY) {
  try {
    serviceAccount = JSON.parse(
      Buffer.from(process.env.FB_SERVICE_KEY, "base64").toString("utf-8")
    );
  } catch (error) {
    console.error("❌ Failed to parse FB_SERVICE_KEY:", error.message);
    process.exit(1); // exit early if the env var is invalid
  }
} else {
  try {
    serviceAccount = require("../firebase-admin.json");
  } catch (error) {
    console.error("❌ firebase-admin.json not found for local dev:", error.message);
    process.exit(1); // exit early if local fallback also fails
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
