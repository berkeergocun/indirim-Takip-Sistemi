import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  url: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  imageUrl?: string;
  platform: string;
  userEmail?: string;
  userPhone?: string;
  notificationPreference: 'email' | 'sms' | 'both';
  priceDropThreshold: number;
  isActive: boolean;
  lastChecked?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    url: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    platform: {
      type: String,
      required: true,
      enum: ['trendyol', 'hepsiburada', 'n11', 'amazon', 'other'],
    },
    userEmail: {
      type: String,
    },
    userPhone: {
      type: String,
    },
    notificationPreference: {
      type: String,
      enum: ['email', 'sms', 'both'],
      default: 'email',
    },
    priceDropThreshold: {
      type: Number,
      default: 5, // %5 indirim
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastChecked: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
