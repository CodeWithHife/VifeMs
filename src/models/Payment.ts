import mongoose, { Schema, Document, Model } from 'mongoose';

export type PaymentMethod = 'Bank Transfer' | 'Card' | 'Cash' | 'Cheque' | 'Online' | 'POS';
export type PaymentStatus = 'Completed' | 'Pending' | 'Failed';

export interface IPayment extends Document {
  businessId: mongoose.Types.ObjectId;
  transactionId: mongoose.Types.ObjectId;
  customerId?: mongoose.Types.ObjectId;
  customerName?: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  reference: string;
  notes?: string;
  date: string;
  receivedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Business ID is required'],
      index: true,
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
      required: [true, 'Transaction ID is required'],
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
    },
    customerName: {
      type: String,
      default: '',
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0.01, 'Payment amount must be greater than 0'],
    },
    currency: {
      type: String,
      default: 'NGN',
    },
    paymentMethod: {
      type: String,
      enum: ['Bank Transfer', 'Card', 'Cash', 'Cheque', 'Online', 'POS'],
      default: 'Bank Transfer',
    },
    status: {
      type: String,
      enum: ['Completed', 'Pending', 'Failed'],
      default: 'Completed',
    },
    reference: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    receivedBy: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

PaymentSchema.index({ businessId: 1, transactionId: 1 });

export const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
