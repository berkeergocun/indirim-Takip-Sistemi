import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  userId: mongoose.Types.ObjectId;
  url: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  imageUrl?: string;
  platform: string;
  notificationPreference: 'email' | 'sms' | 'both';
  priceDropThreshold: number;
  isActive: boolean;
  lastChecked?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    url: {
      type: String,
      required: true,
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
      enum: [
        'trendyol', 
        'hepsiburada', 
        'n11', 
        'amazon', 
        'gittigidiyor',
        'ciceksepeti',
        'morhipo',
        'defacto',
        'lcwaikiki',
        'other'
      ],
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
