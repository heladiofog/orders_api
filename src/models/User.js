import mongoose from 'mongoose';
import bcrypt, { hashSync } from 'bcrypt';
const saltRounds = 10;

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide a valid email.'],
      unique: [true, 'Please use another email or request a password reset.'],
      index: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email.',
      ],
    },
    name: {
      type: String,
      required: [true, 'Name of the user is required'],
      unique: 'This user has been already registered',
      maxlength: [70, 'Name can not be longer than 70 characters'],
    },
    // hashed Password
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

// Hashing the plain password sent by the user
UserSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.password = hashSync(this.password, saltRounds);
  }
  next();
});

// Password compare function
UserSchema.methods.comparePassword = (password, hashedPassword) => {
  // console.log(password, hashedPassword);
  return bcrypt.compareSync(password, hashedPassword);
};

export default mongoose.model('User', UserSchema);
