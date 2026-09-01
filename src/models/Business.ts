import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBusinessModule {
  key: string;
  enabled: boolean;
  name?: string;
  description?: string;
  icon?: string;
}

export interface IBusiness extends Document {
  name: string;
  businessType: string;
  email: string;
  phone?: string;
  address?: string;
  country?: string;
  state?: string;
  website?: string;
  currency: string;
  timeZone: string;
  logo?: string;
  ownerId?: mongoose.Types.ObjectId;
  modules: IBusinessModule[];
  onboardingStatus: 'NOT_STARTED' | 'BUSINESS_INFO_ADDED' | 'BUSINESS_TYPE_SET' | 'TEAM_INVITED' | 'MODULES_CONFIGURED' | 'COMPLETED';
  createdAt: Date;
  updatedAt: Date;
}

const BusinessSchema = new Schema<IBusiness>(
  {
    name: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: [100, 'Business name cannot exceed 100 characters'],
    },
    businessType: {
      type: String,
      default: 'General Business',
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Business email is required'],
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
    country: {
      type: String,
      trim: true,
      default: 'Nigeria',
    },
    state: {
      type: String,
      trim: true,
      default: 'Lagos',
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    currency: {
      type: String,
      default: 'NGN',
      trim: true,
    },
    timeZone: {
      type: String,
      default: 'Africa/Lagos',
      trim: true,
    },
    logo: {
      type: String,
      default: '/logo/logo.png',
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    modules: [
      {
        key: { type: String, required: true },
        enabled: { type: Boolean, default: true },
        name: { type: String },
        description: { type: String },
        icon: { type: String },
      },
    ],
    onboardingStatus: {
      type: String,
      enum: ['NOT_STARTED', 'BUSINESS_INFO_ADDED', 'BUSINESS_TYPE_SET', 'TEAM_INVITED', 'MODULES_CONFIGURED', 'COMPLETED'],
      default: 'NOT_STARTED',
    },
  },
  {
    timestamps: true,
  }
);

export const Business: Model<IBusiness> =
  mongoose.models.Business || mongoose.model<IBusiness>('Business', BusinessSchema);

export default Business;
