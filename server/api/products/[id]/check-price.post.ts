import { connectDB } from '~/server/utils/db';
import { PriceCheckerService } from '~/server/services/price-checker.service';

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

    await PriceCheckerService.checkProduct(id);

    return {
      success: true,
      message: 'Price check completed successfully',
    };
  } catch (error: any) {
    console.error('Error checking price:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to check price',
    });
  }
});
