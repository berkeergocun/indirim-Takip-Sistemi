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
    if (url.includes('amazon.com') || url.includes('amazon.tr')) return 'amazon';
    if (url.includes('gittigidiyor.com')) return 'gittigidiyor';
    if (url.includes('ciceksepeti.com')) return 'ciceksepeti';
    if (url.includes('morhipo.com')) return 'morhipo';
    if (url.includes('defacto.com.tr')) return 'defacto';
    if (url.includes('lcwaikiki.com')) return 'lcwaikiki';
    return 'other';
  }

  private static cleanPrice(priceText: string): number {
    if (!priceText) return 0;
    
    // Remove all non-numeric characters except comma and dot
    let cleaned = priceText.replace(/[^\d,.-]/g, '').trim();
    
    // Turkish format: 1.300,50 (dot as thousand separator, comma as decimal)
    // English format: 1,300.50 (comma as thousand separator, dot as decimal)
    
    // Count dots and commas to determine format
    const dotCount = (cleaned.match(/\./g) || []).length;
    const commaCount = (cleaned.match(/,/g) || []).length;
    
    // If there are multiple dots and one comma, it's likely Turkish format (1.300,50)
    // If there are multiple commas and one dot, it's likely English format (1,300.50)
    if (dotCount > 1 || (dotCount >= 1 && commaCount === 1 && cleaned.lastIndexOf('.') < cleaned.lastIndexOf(','))) {
      // Turkish format: remove dots (thousand separator) and replace comma with dot
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else if (commaCount > 1) {
      // English format: remove commas (thousand separator)
      cleaned = cleaned.replace(/,/g, '');
    } else if (commaCount === 1 && dotCount === 0) {
      // Single comma, no dots - likely decimal separator
      cleaned = cleaned.replace(',', '.');
    } else if (dotCount === 1 && commaCount === 1) {
      // Both present - check which comes last
      if (cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
        // Turkish: 1.300,50
        cleaned = cleaned.replace(/\./g, '').replace(',', '.');
      } else {
        // English: 1,300.50
        cleaned = cleaned.replace(/,/g, '');
      }
    }
    
    const price = parseFloat(cleaned) || 0;
    return price;
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
          // Trendyol 2024+ selectors
          title = $('h1[class*="product"]').first().text().trim() ||
                  $('.pr-new-br h1').text().trim() || 
                  $('h1').first().text().trim();
          
          // Try multiple price selectors for Trendyol
          const trendyolPriceText = 
            $('span[class*="prc-slg"]').first().text() ||
            $('.prc-slg').first().text() ||
            $('span[class*="prc-dsc"]').first().text() ||
            $('.prc-dsc').first().text() ||
            $('div[class*="price"] span').first().text() ||
            $('[data-price]').attr('data-price') ||
            '';
          
          console.log('Trendyol raw price text:', trendyolPriceText);
          price = this.cleanPrice(trendyolPriceText);
          
          imageUrl = $('img[class*="product-image"]').first().attr('src') ||
                     $('.gallery-modal img').first().attr('src') ||
                     $('img[alt*="product"]').first().attr('src') || 
                     $('img').first().attr('src') || '';
          break;

        case 'hepsiburada':
          // Hepsiburada updated selectors
          title = $('h1[id="product-name"]').text().trim() ||
                  $('h1.product-name').text().trim() ||
                  $('h1').first().text().trim();
          
          const hbPriceText = 
            $('span[data-bind*="currentPrice"]').text() ||
            $('.product-price span').first().text() ||
            $('[itemprop="price"]').attr('content') ||
            '';
          
          console.log('Hepsiburada raw price text:', hbPriceText);
          price = this.cleanPrice(hbPriceText);
          
          imageUrl = $('#ProductImage').attr('src') ||
                     $('img[class*="product"]').first().attr('src') || '';
          break;

        case 'n11':
          // N11 updated selectors
          title = $('h1[class*="productName"]').text().trim() ||
                  $('.proDetail h1').text().trim() || 
                  $('h1').first().text().trim();
          
          const n11PriceText = 
            $('.newPrice .priceValue').text() ||
            $('.newPrice ins').text() ||
            $('[class*="price"]').first().text() ||
            '';
          
          console.log('N11 raw price text:', n11PriceText);
          price = this.cleanPrice(n11PriceText);
          
          imageUrl = $('#imgZoom').attr('src') ||
                     $('.imgZoomArea img').attr('src') || 
                     $('img[class*="product"]').first().attr('src') || '';
          break;

        case 'amazon':
          // Amazon updated selectors
          title = $('#productTitle').text().trim() ||
                  $('h1[id*="title"]').text().trim() ||
                  $('h1.product-title').text().trim();
          
          const amazonPriceText = 
            $('.a-price[data-a-color="price"] .a-offscreen').first().text() ||
            $('.a-price .a-offscreen').first().text() ||
            $('#priceblock_ourprice').text() ||
            $('#priceblock_dealprice').text() ||
            $('.a-price-whole').first().text() ||
            $('[data-a-color="price"]').first().text() ||
            '';
          
          console.log('Amazon raw price text:', amazonPriceText);
          price = this.cleanPrice(amazonPriceText);
          
          imageUrl = $('#landingImage').attr('src') || 
                     $('img[data-a-image-name*="MAIN"]').first().attr('src') || '';
          break;

        case 'gittigidiyor':
          title = $('h1[class*="product"]').first().text().trim() ||
                  $('h1').first().text().trim();
          
          const ggPriceText = 
            $('[class*="price-text"]').first().text() ||
            $('[id*="sp-price"]').text() ||
            '';
          
          console.log('GittiGidiyor raw price text:', ggPriceText);
          price = this.cleanPrice(ggPriceText);
          
          imageUrl = $('img[class*="product"]').first().attr('src') || '';
          break;

        case 'ciceksepeti':
          title = $('h1[class*="product"]').first().text().trim() ||
                  $('h1').first().text().trim();
          
          const csPriceText = 
            $('[class*="price"]').first().text() ||
            $('[data-price]').attr('data-price') ||
            '';
          
          console.log('Çiçeksepeti raw price text:', csPriceText);
          price = this.cleanPrice(csPriceText);
          
          imageUrl = $('img[class*="product"]').first().attr('src') || '';
          break;

        case 'morhipo':
          title = $('h1[class*="product"]').first().text().trim() ||
                  $('h1').first().text().trim();
          
          const mhPriceText = 
            $('[class*="price-new"]').first().text() ||
            $('[class*="price"]').first().text() ||
            '';
          
          console.log('Morhipo raw price text:', mhPriceText);
          price = this.cleanPrice(mhPriceText);
          
          imageUrl = $('img[class*="product"]').first().attr('src') || '';
          break;

        case 'defacto':
          title = $('h1[class*="product"]').first().text().trim() ||
                  $('h1').first().text().trim();
          
          const dfPriceText = 
            $('[class*="price"]').first().text() ||
            $('[data-price]').attr('data-price') ||
            '';
          
          console.log('Defacto raw price text:', dfPriceText);
          price = this.cleanPrice(dfPriceText);
          
          imageUrl = $('img[class*="product"]').first().attr('src') || '';
          break;

        case 'lcwaikiki':
          title = $('h1[class*="product"]').first().text().trim() ||
                  $('h1').first().text().trim();
          
          const lcwPriceText = 
            $('[class*="price"]').first().text() ||
            $('[data-price]').attr('data-price') ||
            '';
          
          console.log('LC Waikiki raw price text:', lcwPriceText);
          price = this.cleanPrice(lcwPriceText);
          
          imageUrl = $('img[class*="product"]').first().attr('src') || '';
          break;

        default:
          // Generic scraping
          title = $('h1').first().text().trim();
          
          const genericPriceText = 
            $('[class*="price"]').first().text() ||
            $('[id*="price"]').first().text() ||
            $('[itemprop="price"]').attr('content') ||
            '';
          
          console.log('Generic raw price text:', genericPriceText);
          price = this.cleanPrice(genericPriceText);
          
          imageUrl = $('img[alt*="product"]').first().attr('src') ||
                     $('img').first().attr('src') || '';
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
