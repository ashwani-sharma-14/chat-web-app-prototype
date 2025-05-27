import mongoose from "mongoose";
import env from "./env.js";

export const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(env.dbUri);
    console.log(`Connected to DB`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
