import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Verify Cloudinary credentials are available
const requiredEnvVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error(`Warning: Missing Cloudinary environment variables: ${missingVars.join(', ')}`);
  console.error('File uploads may not work correctly without these variables set');
}

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Add a testing function to validate the connection
export const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    return result.status === 'ok';
  } catch (error) {
    console.error('Cloudinary connection test failed:', error.message);
    return false;
  }
};

export default cloudinary;
