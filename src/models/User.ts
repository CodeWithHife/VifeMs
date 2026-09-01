import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'owner' | 'admin' | 'manager' | 'staff' | 'agent';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  businessId?: mongoose.Types.ObjectId;
  department?: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'invited';
  isEmailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'manager', 'staff', 'agent'],
      default: 'owner',
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      index: true,
    },
    department: {
      type: String,
      default: 'Management',
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'invited'],
      default: 'active',
    },
    isEmailVerified: {
      type: Boolean,
      default: true,
    },
    verificationToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
