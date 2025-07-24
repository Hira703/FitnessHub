const admin = require("firebase-admin");

let serviceAccount;

if (process.env.FB_SERVICE_KEY) {
  // Decode base64 environment variable into JSON
  serviceAccount = JSON.parse(
    Buffer.from(process.env.FB_SERVICE_KEY, "base64").toString("utf-8")
  );
} else {
  // fallback for local dev
  serviceAccount = require("../firebase-admin.json");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;