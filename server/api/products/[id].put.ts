import { connectDB } from '~/server/utils/db';
import { Product } from '~/server/models/Product';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Product ID is required',
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          userEmail: body.userEmail,
          userPhone: body.userPhone,
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
