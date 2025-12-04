import { Product } from '../models/Product';
import { PriceHistory } from '../models/PriceHistory';
import { ScraperService } from './scraper.service';
import { NotificationService } from './notification.service';

export class PriceCheckerService {
  static async checkProduct(productId: string): Promise<void> {
    try {
      const product = await Product.findById(productId);
      
      if (!product || !product.isActive) {
        console.log(`Product ${productId} not found or inactive`);
        return;
      }

      console.log(`Checking price for: ${product.title}`);

      // Scrape current price
      const scrapedData = await ScraperService.scrapeProduct(product.url);
      
      const oldPrice = product.currentPrice;
      const newPrice = scrapedData.price;

      // Update product
      product.currentPrice = newPrice;
      product.lastChecked = new Date();
      
      // Update title and image if changed
      if (scrapedData.title) product.title = scrapedData.title;
      if (scrapedData.imageUrl) product.imageUrl = scrapedData.imageUrl;
      
      await product.save();

      // Save price history
      await PriceHistory.create({
        productId: product._id,
        price: newPrice,
        checkedAt: new Date(),
      });

      // Check if price dropped significantly
      const priceDropPercentage = ((oldPrice - newPrice) / oldPrice) * 100;
      
      if (priceDropPercentage >= product.priceDropThreshold) {
        console.log(`🎉 Price drop detected: ${oldPrice} → ${newPrice} (${priceDropPercentage.toFixed(2)}%)`);
        await NotificationService.notify(product, oldPrice, newPrice);
      } else {
        console.log(`No significant price drop: ${oldPrice} → ${newPrice} (${priceDropPercentage.toFixed(2)}%)`);
      }

    } catch (error) {
      console.error(`Error checking product ${productId}:`, error);
      throw error;
    }
  }

  static async checkAllProducts(): Promise<void> {
    console.log('🔄 Starting price check for all active products...');
    
    try {
      const products = await Product.find({ isActive: true });
      console.log(`Found ${products.length} active products to check`);

      for (const product of products) {
        try {
          await this.checkProduct(product._id.toString());
          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`Failed to check product ${product._id}:`, error);
          // Continue with other products
          continue;
        }
      }

      console.log('✅ Finished checking all products');
    } catch (error) {
      console.error('Error in checkAllProducts:', error);
      throw error;
    }
  }
}
