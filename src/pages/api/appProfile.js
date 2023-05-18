// pages/api/appProfile.js

export default function handler(req, res) {
  // Assuming you have the JSON data stored in a separate file
  const appProfileData = require("../../data/Application_Profile.json");

  if (req.method === "GET") {
    res.status(200).json(appProfileData);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
