import { configDotenv } from "dotenv";

configDotenv();
const env = {
  port: process.env.PORT,
  dbUri: process.env.MONGODB_URL,
  cloud:{
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  }
};

export default env;
