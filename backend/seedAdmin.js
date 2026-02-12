import dotenv from "dotenv";
dotenv.config();

import connectDB from "./src/config/db.js";
import User from "./src/models/User.model.js";

const seedAdmin = async () => {
  try {
    await connectDB();

    const existing = await User.findOne({ email: "admin@geoai.com" });
    if (existing) {
      console.log("⚠️ Admin already exists");
      process.exit(0);
    }

    await User.create({
      name: "Admin",
      email: "admin@geoai.com",
      password: "admin123"
    });

    console.log("✅ Admin created successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
    process.exit(1);
  }
};

seedAdmin();
