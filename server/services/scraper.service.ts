import axios from 'axios';
import * as cheerio from 'cheerio';

interface ScrapedData {
  title: string;
  price: number;
  imageUrl?: string;
  platform: string;
}

export class ScraperService {
  private static getPlatform(url: string): string {
    if (url.includes('trendyol.com')) return 'trendyol';
    if (url.includes('hepsiburada.com')) return 'hepsiburada';
    if (url.includes('n11.com')) return 'n11';
    if (url.includes('amazon.com')) return 'amazon';
    return 'other';
  }

  private static cleanPrice(priceText: string): number {
    // Remove currency symbols and convert to number
    const cleaned = priceText
      .replace(/[^\d,.-]/g, '')
      .replace(',', '.')
      .trim();
    return parseFloat(cleaned) || 0;
  }

  static async scrapeProduct(url: string): Promise<ScrapedData> {
    try {
      const platform = this.getPlatform(url);
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);
      
      let title = '';
      let price = 0;
      let imageUrl = '';

      switch (platform) {
        case 'trendyol':
          title = $('.pr-new-br h1').text().trim() || 
                  $('h1.product-name').text().trim() ||
                  $('h1[class*="title"]').first().text().trim();
          
          price = this.cleanPrice(
            $('.prc-dsc').first().text() ||
            $('[class*="price"]').first().text()
          );
          
          imageUrl = $('.product-image img').attr('src') || 
                     $('img[class*="product"]').first().attr('src') || '';
          break;

        case 'hepsiburada':
          title = $('#product-name').text().trim() || 
                  $('h1[id*="product"]').text().trim() ||
                  $('h1').first().text().trim();
          
          price = this.cleanPrice(
            $('[data-bind*="currentPrice"]').text() ||
            $('.price-value').text()
          );
          
          imageUrl = $('.product-image img').attr('src') || 
                     $('img[class*="image"]').first().attr('src') || '';
          break;

        case 'n11':
          title = $('.proDetail h1').text().trim() || 
                  $('h1.title').text().trim() ||
                  $('h1').first().text().trim();
          
          price = this.cleanPrice(
            $('.newPrice ins').text() ||
            $('[class*="price"]').first().text()
          );
          
          imageUrl = $('.imgZoomArea img').attr('src') || 
                     $('img[class*="product"]').first().attr('src') || '';
          break;

        case 'amazon':
          title = $('#productTitle').text().trim() ||
                  $('h1[id*="title"]').text().trim();
          
          price = this.cleanPrice(
            $('.a-price .a-offscreen').first().text() ||
            $('#priceblock_ourprice').text() ||
            $('.a-price-whole').first().text()
          );
          
          imageUrl = $('#landingImage').attr('src') || 
                     $('img[data-a-image-name*="MAIN"]').first().attr('src') || '';
          break;

        default:
          // Generic scraping
          title = $('h1').first().text().trim();
          price = this.cleanPrice(
            $('[class*="price"]').first().text() ||
            $('[id*="price"]').first().text()
          );
          imageUrl = $('img').first().attr('src') || '';
      }

      if (!title || price <= 0) {
        throw new Error('Could not extract product information');
      }

      return {
        title: title.substring(0, 200), // Limit title length
        price,
        imageUrl: imageUrl.startsWith('//') ? 'https:' + imageUrl : imageUrl,
        platform,
      };
    } catch (error) {
      console.error('Scraping error:', error);
      throw new Error(`Failed to scrape product from ${url}`);
    }
  }
}
