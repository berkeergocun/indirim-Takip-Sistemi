import { connectDB } from '../../utils/db';
import { Product } from '../../models/Product';
import { PriceHistory } from '../../models/PriceHistory';
import { ScraperService } from '../../services/scraper.service';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    
    const body = await readBody(event);
    
    if (!body.url) {
      throw createError({
        statusCode: 400,
        message: 'URL is required',
      });
    }

    // Check if product already exists
    const existingProduct = await Product.findOne({ url: body.url });
    if (existingProduct) {
      return {
        success: true,
        message: 'Product already tracked',
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
      userEmail: body.userEmail,
      userPhone: body.userPhone,
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
