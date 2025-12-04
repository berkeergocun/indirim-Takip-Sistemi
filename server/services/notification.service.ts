import nodemailer from 'nodemailer';
import type { IProduct } from '../models/Product';

export class NotificationService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  static async sendEmailNotification(
    product: IProduct,
    oldPrice: number,
    newPrice: number
  ): Promise<void> {
    if (!product.userEmail) {
      console.log('No email address provided for product:', product._id);
      return;
    }

    const discountPercentage = ((oldPrice - newPrice) / oldPrice * 100).toFixed(2);

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Price Tracker <noreply@pricetracker.com>',
      to: product.userEmail,
      subject: `🎉 Fiyat Düştü: ${product.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .product-image { max-width: 200px; margin: 20px auto; display: block; border-radius: 8px; }
            .price-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
            .old-price { text-decoration: line-through; color: #999; font-size: 18px; }
            .new-price { color: #27ae60; font-size: 32px; font-weight: bold; margin: 10px 0; }
            .discount { background: #e74c3c; color: white; padding: 10px 20px; border-radius: 20px; display: inline-block; font-weight: bold; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Harika Haber!</h1>
              <p>Takip ettiğiniz üründe fiyat düşüşü var!</p>
            </div>
            <div class="content">
              <h2>${product.title}</h2>
              ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.title}" class="product-image" />` : ''}
              
              <div class="price-box">
                <div class="old-price">Eski Fiyat: ${oldPrice.toFixed(2)} ₺</div>
                <div class="new-price">${newPrice.toFixed(2)} ₺</div>
                <div class="discount">%${discountPercentage} İNDİRİM</div>
              </div>

              <p style="text-align: center;">
                <a href="${product.url}" class="button">Ürünü Görüntüle</a>
              </p>

              <p style="font-size: 12px; color: #666;">
                Bu ürünü ${new Date(product.createdAt).toLocaleDateString('tr-TR')} tarihinde takibe aldınız.
                Platform: <strong>${product.platform.toUpperCase()}</strong>
              </p>
            </div>
            <div class="footer">
              <p>Bu bildirimi aldığınız için Price Tracker'ı kullanıyorsunuz.</p>
              <p>Bildirimleri durdurmak için ürünü takipten çıkarabilirsiniz.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Fiyat Düştü!

${product.title}

Eski Fiyat: ${oldPrice.toFixed(2)} ₺
Yeni Fiyat: ${newPrice.toFixed(2)} ₺
İndirim: %${discountPercentage}

Ürüne git: ${product.url}

Platform: ${product.platform.toUpperCase()}
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${product.userEmail} for product ${product._id}`);
    } catch (error) {
      console.error('Email sending error:', error);
      throw error;
    }
  }

  static async sendSMSNotification(
    product: IProduct,
    oldPrice: number,
    newPrice: number
  ): Promise<void> {
    if (!product.userPhone) {
      console.log('No phone number provided for product:', product._id);
      return;
    }

    // Twilio integration example
    // You can replace this with any SMS provider
    const discountPercentage = ((oldPrice - newPrice) / oldPrice * 100).toFixed(2);
    
    const message = `🎉 Fiyat Düştü! ${product.title.substring(0, 50)}... | Eski: ${oldPrice}₺ → Yeni: ${newPrice}₺ (%${discountPercentage} indirim) | ${product.url}`;

    try {
      // TODO: Implement actual SMS sending with Twilio or another provider
      // Example with Twilio:
      /*
      const client = require('twilio')(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: product.userPhone,
      });
      */
      
      console.log(`📱 SMS notification (simulated) sent to ${product.userPhone}:`, message);
    } catch (error) {
      console.error('SMS sending error:', error);
      throw error;
    }
  }

  static async notify(
    product: IProduct,
    oldPrice: number,
    newPrice: number
  ): Promise<void> {
    const promises: Promise<void>[] = [];

    if (product.notificationPreference === 'email' || product.notificationPreference === 'both') {
      promises.push(this.sendEmailNotification(product, oldPrice, newPrice));
    }

    if (product.notificationPreference === 'sms' || product.notificationPreference === 'both') {
      promises.push(this.sendSMSNotification(product, oldPrice, newPrice));
    }

    await Promise.allSettled(promises);
  }
}
