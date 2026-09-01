import mongoose, { Schema, Document, Model } from 'mongoose';

export type NotificationCategory = 'Tasks' | 'Customers' | 'Payments' | 'Staff' | 'System' | 'Alerts';

export interface INotification extends Document {
  businessId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  category: NotificationCategory;
  title: string;
  description: string;
  read: boolean;
  relatedId?: string;
  relatedType?: string;
  time?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
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
      index: true,
    },
    category: {
      type: String,
      enum: ['Tasks', 'Customers', 'Payments', 'Staff', 'System', 'Alerts'],
      default: 'System',
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    relatedId: {
      type: String,
      default: '',
    },
    relatedType: {
      type: String,
      default: '',
    },
    time: {
      type: String,
      default: 'Just now',
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ businessId: 1, read: 1 });

export const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
