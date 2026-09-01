import mongoose, { Schema, Document, Model } from 'mongoose';

export type CustomerType = 'Individual' | 'Corporate' | 'Enterprise' | 'Partner';
export type CustomerStatus = 'Active' | 'Lead' | 'Inactive' | 'VIP';

export interface ICustomer extends Document {
  businessId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  customerType: CustomerType;
  status: CustomerStatus;
  tags: string[];
  notes?: string;
  totalSpent: number;
  totalTransactions: number;
  assignedStaff?: string;
  lastActivity?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Business ID is required'],
      index: true,
    },
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
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    customerType: {
      type: String,
      enum: ['Individual', 'Corporate', 'Enterprise', 'Partner'],
      default: 'Corporate',
    },
    status: {
      type: String,
      enum: ['Active', 'Lead', 'Inactive', 'VIP'],
      default: 'Active',
    },
    tags: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    totalTransactions: {
      type: Number,
      default: 0,
    },
    assignedStaff: {
      type: String,
      default: '',
      trim: true,
    },
    lastActivity: {
      type: String,
      default: 'Just now',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient search within a business
CustomerSchema.index({ businessId: 1, email: 1 });
CustomerSchema.index({ businessId: 1, firstName: 1, lastName: 1 });

export const Customer: Model<ICustomer> =
  mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
