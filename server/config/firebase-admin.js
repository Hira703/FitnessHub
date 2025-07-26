const admin = require("firebase-admin");

let serviceAccount;

if (process.env.FB_SERVICE_KEY) {
  // Directly parse the JSON string from the env variable
  serviceAccount = JSON.parse(process.env.FB_SERVICE_KEY);
} else {
  // Fallback for local development using the JSON file
  serviceAccount = require("../firebase-admin.json");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
