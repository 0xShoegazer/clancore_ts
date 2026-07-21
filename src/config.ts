import * as dotenv from 'dotenv';

// Load env vars if env is not production
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './server/config/local.env' });
}

export const config = {
  PORT: process.env.PORT || 7777,
  JWT_SECRET: process.env.JWT_SECRET,
  // They read JWT_TOKEN_EXPIRES_IN in auth but it is not actually added to their config yet
  JWT_TOKEN_EXPIRES_IN: 999999999,
  MONGO_URI: process.env.MONGO_URI,
  NODE_ENV: process.env.NODE_ENV,
  INITIAL_CHIPS_AMOUNT: 100000,
};
