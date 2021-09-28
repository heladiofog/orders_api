import dotenv from 'dotenv';
import express from 'express';

// Load env config vars from env files if the case
dotenv.config({ path: './config/config.env' });

const app = express();
const PORT = process.env.PORT || 5005;

app.get('/', () => console.log('Hello world parrot'));

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}...`);
});
