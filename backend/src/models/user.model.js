import { mongoose } from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required '],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    avatar: {
      type: String,
      default: '',
    },
    mobileNumber: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: '',
    },
    verify_email: {
      type: Boolean,
      default: false,
    },
    last_login_date: {
      type: Date,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Suspended'],
      default: 'Active',
    },
    address_details: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
    },
    shopping_cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CartProduct',
    },
    orderHistory: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Order',
    },
    forgot_password_otp: {
      type: String,
      default: null,
    },
    forgot_password_expiry: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model('User', userSchema);
