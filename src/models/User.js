import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide a valid email.'],
      unique: true,
      index: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, 'Name of the user is required'],
      unique: 'This user has been already registered',
    },
    password: {
      type: String,
      required: false,
      minlength: [8, 'Password must have at least 8 characters'],
    },
  },
  {
    collection: 'Users',
    timestamps: true,
  }
);

export default mongoose.model('User', UserSchema);
