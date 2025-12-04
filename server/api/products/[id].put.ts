import { connectDB } from '../../utils/db';
import { Product } from '../../models/Product';
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
    const body = await readBody(event);
    
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Product ID is required',
      });
    }

    const product = await Product.findOneAndUpdate(
      { _id: id, userId },
      {
        $set: {
          notificationPreference: body.notificationPreference,
          priceDropThreshold: body.priceDropThreshold,
          isActive: body.isActive,
        },
      },
      { new: true }
    );

    if (!product) {
      throw createError({
        statusCode: 404,
        message: 'Product not found',
      });
    }

    return {
      success: true,
      message: 'Product updated successfully',
      data: product,
    };
  } catch (error: any) {
    console.error('Error updating product:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to update product',
    });
  }
});
