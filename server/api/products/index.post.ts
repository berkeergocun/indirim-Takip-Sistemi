import { connectDB } from '../../utils/db';
import { Product } from '../../models/Product';
import { PriceHistory } from '../../models/PriceHistory';
import { ScraperService } from '../../services/scraper.service';
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
    
    const body = await readBody(event);
    
    if (!body.url) {
      throw createError({
        statusCode: 400,
        message: 'URL is required',
      });
    }

    // Check if product already exists for this user
    const existingProduct = await Product.findOne({ url: body.url, userId });
    if (existingProduct) {
      return {
        success: true,
        message: 'Bu ürünü zaten takip ediyorsunuz',
        data: existingProduct,
      };
    }

    // Scrape product data
    console.log('Scraping product from URL:', body.url);
    const scrapedData = await ScraperService.scrapeProduct(body.url);

    // Create new product
    const product = await Product.create({
      url: body.url,
      title: scrapedData.title,
      currentPrice: scrapedData.price,
      originalPrice: scrapedData.price,
      imageUrl: scrapedData.imageUrl,
      platform: scrapedData.platform,
      userId,
      notificationPreference: body.notificationPreference || 'email',
      priceDropThreshold: body.priceDropThreshold || parseFloat(process.env.PRICE_DROP_THRESHOLD || '5'),
      isActive: true,
      lastChecked: new Date(),
    });

    // Create initial price history
    await PriceHistory.create({
      productId: product._id,
      price: scrapedData.price,
      checkedAt: new Date(),
    });

    return {
      success: true,
      message: 'Product added successfully',
      data: product,
    };
  } catch (error: any) {
    console.error('Error adding product:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to add product',
    });
  }
});
