import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import errorHandler from './middleware/error';
import connectDB from './config/db';
import 'colors'; // merely optional
// Load env config vars from env files if the case
dotenv.config({ path: './src/config/config.env' });

// DB connection
connectDB();
// App init
const app = express();
const PORT = process.env.PORT || 5005;

// some middleware using
app.use(express.json());
// Logging with morgan for dev env only
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Route mounting
app.get('/', () => console.log('Hello world parrot'));

// general error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `Express server running in mode ${process.env.NODE_ENV} on port ${PORT}!`
      .yellow.bold
  );
});
