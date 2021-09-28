import { connect } from 'mongoose';

const connectDB = async () => {
  const dbName = process.env.DB_NAME || 'parrot-orders';
  const mongoDBURI = process.env.MONGO_URI || `mongodb://localhost/${dbName}`;
  const mongoDBOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  const conn = await connect(mongoDBURI, mongoDBOptions);
  console.log(
    `MongoDB has been established to: ${conn.connection.host}`.cyan.bold
  );
};

export default connectDB;
