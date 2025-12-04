import { connectDB } from '../../utils/db';
import { Product } from '../../models/Product';
import { PriceHistory } from '../../models/PriceHistory';
import { verifyToken } from '../../utils/jwt';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    // Verify JWT token
    const authHeader = getHeader(event, 'authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      throw createError({
        statusCode: 401,
        message: 'Invalid token',
      });
    }
    const userId = decoded.userId;
    
    const id = getRouterParam(event, 'id');
    
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Product ID is required',
      });
    }

    // Only fetch product if it belongs to the authenticated user
    const product = await Product.findOne({ _id: id, userId });
    
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
