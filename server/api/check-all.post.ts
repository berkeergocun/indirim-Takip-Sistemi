import { connectDB } from '../utils/db';
import { Product } from '../models/Product';
import { PriceCheckerService } from '../services/price-checker.service';
import { verifyToken } from '../utils/jwt';

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

    // Get all active products for this user
    const products = await Product.find({ userId, isActive: true });

    console.log(`Checking prices for ${products.length} products...`);

    // Check prices for all products
    const promises = products.map((product) =>
      PriceCheckerService.checkProduct(product._id.toString())
    );

    await Promise.all(promises);

    return {
      success: true,
      message: `${products.length} ürünün fiyatı kontrol edildi`,
      checked: products.length,
    };
  } catch (error: any) {
    console.error('Error checking all prices:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to check prices',
    });
  }
});
