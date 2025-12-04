// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  
  modules: ['@nuxtjs/tailwindcss'],
  
  // Reduce console logs
  logLevel: 'silent',
  
  app: {
    head: {
      title: 'Price Tracker - Fiyat Takip Uygulaması',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'E-ticaret sitelerindeki ürün fiyatlarını takip edin, indirimlerden haberdar olun!' }
      ],
    }
  },

  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/price-tracker',
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPassword: process.env.SMTP_PASSWORD,
    emailFrom: process.env.EMAIL_FROM,
    cronSchedule: process.env.CRON_SCHEDULE,
    priceDropThreshold: process.env.PRICE_DROP_THRESHOLD,
  },

  // Minimize build logs
  build: {
    transpile: [],
  },

  vite: {
    logLevel: 'error',
  },
})
