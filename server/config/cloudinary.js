import { v2 as cloudinary } from "cloudinary";
import env from "./env.js";
cloudinary.config({
  cloud_name: env.cloud.cloud_name,
  api_key: env.cloud.api_key,
  api_secret: env.cloud.api_secret,
});

export default cloudinary;
