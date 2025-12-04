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

    // Get user's product statistics
    const totalProducts = await Product.countDocuments({ userId });
    const activeProducts = await Product.countDocuments({ userId, isActive: true });

    // For notifications, we'll count products that have had a price drop
    // This is a simplified version - in a real app, you'd track notifications separately
    const products = await Product.find({ userId });
    const notifications = products.filter(
      (p) => p.currentPrice < p.originalPrice
    ).length;

    return {
      totalProducts,
      activeProducts,
      notifications,
    };
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch stats',
    });
  }
});
