import mongoose, { Schema, Document, Model } from 'mongoose';

export type TransactionType = 'Income' | 'Expense' | 'Refund' | 'Transfer';
export type TransactionStatus = 'Completed' | 'Pending' | 'Partially Paid' | 'Overdue' | 'Failed' | 'Cancelled';

export interface IInvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ITransaction extends Document {
  businessId: mongoose.Types.ObjectId;
  customerId?: mongoose.Types.ObjectId;
  customerName?: string;
  customerEmail?: string;
  propertyId?: mongoose.Types.ObjectId;
  title: string;
  type: TransactionType;
  category: string;
  amount: number;
  amountPaid: number;
  currency: string;
  status: TransactionStatus;
  reference: string;
  dueDate?: string;
  assignedStaff?: string;
  invoiceNumber?: string;
  items?: IInvoiceItem[];
  subtotal?: number;
  tax?: number;
  discount?: number;
  notes?: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Business ID is required'],
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
    customerEmail: {
      type: String,
      default: '',
      trim: true,
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
    },
    title: {
      type: String,
      required: [true, 'Transaction title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Income', 'Expense', 'Refund', 'Transfer'],
      default: 'Income',
    },
    category: {
      type: String,
      default: 'Sales Revenue',
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: [0, 'Amount paid cannot be negative'],
    },
    currency: {
      type: String,
      default: 'NGN',
    },
    status: {
      type: String,
      enum: ['Completed', 'Pending', 'Partially Paid', 'Overdue', 'Failed', 'Cancelled'],
      default: 'Pending',
    },
    reference: {
      type: String,
      required: true,
      trim: true,
    },
    dueDate: {
      type: String,
      default: '',
    },
    assignedStaff: {
      type: String,
      default: '',
      trim: true,
    },
    invoiceNumber: {
      type: String,
      default: '',
      trim: true,
    },
    items: [
      {
        id: { type: String },
        description: { type: String },
        quantity: { type: Number, default: 1 },
        unitPrice: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
    ],
    subtotal: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
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
  },
  {
    timestamps: true,
  }
);

TransactionSchema.index({ businessId: 1, type: 1, status: 1 });
TransactionSchema.index({ businessId: 1, reference: 1 });

export const Transaction: Model<ITransaction> =
  mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
