import { connectDB } from '~/server/utils/db';
import { Product } from '~/server/models/Product';
import { PriceHistory } from '~/server/models/PriceHistory';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const id = getRouterParam(event, 'id');
    
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Product ID is required',
      });
    }

    const product = await Product.findById(id);
    
    if (!product) {
      throw createError({
        statusCode: 404,
        message: 'Product not found',
      });
    }

    // Get price history
    const priceHistory = await PriceHistory.find({ productId: id })
      .sort({ checkedAt: -1 })
      .limit(30);

    return {
      success: true,
      data: {
        product,
        priceHistory,
      },
    };
  } catch (error: any) {
    console.error('Error fetching product:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch product',
    });
  }
});
