import mongoose, { Schema, Document, Model } from 'mongoose';

export type StaffRole = 'Administrator' | 'Manager' | 'Staff' | 'Agent';
export type StaffStatus = 'Active' | 'Inactive' | 'On Leave';

export interface IStaff extends Document {
  businessId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  role: StaffRole;
  department: string;
  status: StaffStatus;
  tasksAssigned: number;
  tasksCompleted: number;
  lastActive?: string;
  joinedDate?: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema = new Schema<IStaff>(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Business ID is required'],
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Staff member name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Staff email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['Administrator', 'Manager', 'Staff', 'Agent'],
      default: 'Staff',
    },
    department: {
      type: String,
      default: 'Operations',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'On Leave'],
      default: 'Active',
    },
    tasksAssigned: {
      type: Number,
      default: 0,
    },
    tasksCompleted: {
      type: Number,
      default: 0,
    },
    lastActive: {
      type: String,
      default: 'Just now',
    },
    joinedDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    permissions: {
      type: [String],
      default: ['VIEW_TASKS', 'EDIT_TASKS'],
    },
  },
  {
    timestamps: true,
  }
);

StaffSchema.index({ businessId: 1, email: 1 }, { unique: true });

export const Staff: Model<IStaff> =
  mongoose.models.Staff || mongoose.model<IStaff>('Staff', StaffSchema);

export default Staff;
