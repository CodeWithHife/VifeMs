import mongoose, { Schema, Document, Model } from 'mongoose';

export type PropertyType = 'Apartment' | 'House' | 'Commercial' | 'Land' | 'Office' | 'Villa' | 'Duplex';
export type PropertyStatus = 'available' | 'reserved' | 'sold' | 'rented' | 'unavailable';

export interface IProperty extends Document {
  businessId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  propertyType: PropertyType;
  location: string;
  price: number;
  currency: string;
  status: PropertyStatus;
  bedrooms?: number;
  bathrooms?: number;
  size?: string;
  images: string[];
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  assignedAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Business ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    propertyType: {
      type: String,
      enum: ['Apartment', 'House', 'Commercial', 'Land', 'Office', 'Villa', 'Duplex'],
      default: 'Apartment',
    },
    location: {
      type: String,
      required: [true, 'Property location is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Property price is required'],
      min: [0, 'Price must be positive'],
    },
    currency: {
      type: String,
      default: 'NGN',
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'sold', 'rented', 'unavailable'],
      default: 'available',
    },
    bedrooms: {
      type: Number,
      default: 0,
    },
    bathrooms: {
      type: Number,
      default: 0,
    },
    size: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    ownerName: {
      type: String,
      default: '',
      trim: true,
    },
    ownerPhone: {
      type: String,
      default: '',
      trim: true,
    },
    ownerEmail: {
      type: String,
      default: '',
      trim: true,
    },
    assignedAgent: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

PropertySchema.index({ businessId: 1, status: 1 });
PropertySchema.index({ businessId: 1, propertyType: 1 });

export const Property: Model<IProperty> =
  mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);

export default Property;
