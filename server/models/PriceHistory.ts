import mongoose, { Schema, Document } from 'mongoose';

export interface IPriceHistory extends Document {
  productId: mongoose.Types.ObjectId;
  price: number;
  checkedAt: Date;
}

const PriceHistorySchema = new Schema<IPriceHistory>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  checkedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
PriceHistorySchema.index({ productId: 1, checkedAt: -1 });

export const PriceHistory = mongoose.models.PriceHistory || mongoose.model<IPriceHistory>('PriceHistory', PriceHistorySchema);
