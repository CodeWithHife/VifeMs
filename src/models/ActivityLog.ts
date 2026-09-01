import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivityLog extends Document {
  businessId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  userName: string;
  userRole: string;
  action: string;
  recordAffected: string;
  module: string;
  ipAddress?: string;
  timestamp: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
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
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userRole: {
      type: String,
      default: 'Administrator',
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    recordAffected: {
      type: String,
      default: '',
    },
    module: {
      type: String,
      default: 'General',
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
    timestamp: {
      type: String,
      default: 'Just now',
    },
  },
  {
    timestamps: true,
  }
);

ActivityLogSchema.index({ businessId: 1, createdAt: -1 });

export const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);

export default ActivityLog;
