import dotenv from 'dotenv';
dotenv.config();

// Ensures env variables are set and performs error handling 

const required = ['MONGO_URI', 'PORT', 'JWT_SECRET'];

// Check if all required env variables are set and exit with an error if not.

for (const name of required) {
  if (!process.env[name]) {
    console.error(` Missing required env var ${name} in .env`);
    process.exit(1);
  }
}

export const MONGO_URI  = process.env.MONGO_URI;
export const PORT       = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET;