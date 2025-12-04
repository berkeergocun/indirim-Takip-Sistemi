import { connectDB } from '../../utils/db';
import { Product } from '../../models/Product';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const query = getQuery(event);
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments();

    return {
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    console.error('Error fetching products:', error);
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch products',
    });
  }
});
