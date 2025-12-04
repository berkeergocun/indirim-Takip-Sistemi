import { connectDB } from '../../utils/db';
import { Product } from '../../models/Product';
import { PriceHistory } from '../../models/PriceHistory';

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

    // Delete product
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      throw createError({
        statusCode: 404,
        message: 'Product not found',
      });
    }

    // Delete associated price history
    await PriceHistory.deleteMany({ productId: id });

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to delete product',
    });
  }
});
