# 🛒 E-Commerce Price Tracker

A modern, full-stack price tracking application that monitors product prices across multiple e-commerce platforms and sends notifications when prices drop.

<div align="center">

![Nuxt.js](https://img.shields.io/badge/Nuxt.js-4.2-00DC82?logo=nuxt.js&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?logo=vue.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

[🇹🇷 Türkçe](#tr) | [🇬🇧 English](#en)

</div>

---

<a name="en"></a>

## 🌟 Features

- 🔍 **Multi-Platform Support** - Track prices from Trendyol, Hepsiburada, N11, Amazon, GittiGidiyor, Çiçeksepeti, Morhipo, Defacto, LC Waikiki and more
- 📧 **Smart Notifications** - Get email/SMS alerts when prices drop below your threshold
- 🌓 **Dark/Light Mode** - Beautiful UI with seamless theme switching
- 👤 **User Authentication** - Secure JWT-based authentication system
- 📊 **Price History** - Visual price tracking with detailed historical data
- ⚙️ **Customizable Settings** - Set individual price drop thresholds for each product
- 🐳 **Docker Support** - Easy deployment with Docker and Docker Compose
- 🔄 **Automated Checks** - Scheduled price checks every 6 hours
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile

## 🚀 Tech Stack

### Frontend
- **Nuxt.js 4** - The Intuitive Vue Framework
- **Vue 3** - Progressive JavaScript Framework
- **Tailwind CSS** - Utility-first CSS Framework
- **Composition API** - Modern Vue development

### Backend
- **Nitro** - Next Generation Server Toolkit
- **Node.js** - JavaScript Runtime
- **MongoDB** - NoSQL Database
- **Mongoose** - Elegant MongoDB ODM

### Libraries & Tools
- **JWT** - Secure authentication
- **bcrypt** - Password hashing
- **Axios + Cheerio** - Web scraping
- **node-schedule** - Cron job scheduler
- **Nodemailer** - Email notifications
- **Docker** - Containerization

## 📦 Quick Start

### Prerequisites

- **Node.js 18+** or **Docker**
- **MongoDB** (or use Docker Compose)

### Option 1: Docker (Recommended) 🐳

```bash
# Clone the repository
git clone https://github.com/yourusername/price-tracker.git
cd price-tracker

# Start with Docker Compose
docker-compose up -d

# Application will be available at http://localhost:3000
```

### Option 2: Manual Setup 💻

```bash
# Clone the repository
git clone https://github.com/yourusername/price-tracker.git
cd price-tracker

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
# Make sure MongoDB is running

# Start development server
npm run dev

# Application will be available at http://localhost:3000
```

## 🔧 Environment Configuration

Create a `.env` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/price-tracker

# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Optional - for email notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# SMS Configuration (Optional - for SMS notifications)
SMS_API_KEY=your-sms-api-key

# Application Settings
PRICE_DROP_THRESHOLD=5
CRON_SCHEDULE=0 */6 * * *
```

### Gmail Setup for Email Notifications

1. Enable 2-Factor Authentication in your Google Account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the generated password in `EMAIL_PASS`

## 📱 Usage Guide

1. **📝 Register/Login**
   - Create a new account or login with existing credentials
   - All passwords are securely hashed with bcrypt

2. **➕ Add Products**
   - Paste the product URL from supported e-commerce platforms
   - System automatically extracts product information
   - Set custom notification preferences

3. **⚙️ Configure Settings**
   - Set individual price drop thresholds
   - Choose notification method (Email, SMS, or Both)
   - Customize default preferences in profile

4. **📊 Track Prices**
   - View real-time price updates
   - Analyze price history with interactive charts
   - Get instant notifications on price drops

5. **👤 Manage Profile**
   - Update personal information
   - Change theme preference
   - Configure default settings

## 🎨 Features in Detail

### User Authentication
- Secure JWT-based authentication
- Password hashing with bcrypt
- Protected routes and API endpoints
- User session management

### Price Tracking
- Automatic scraping from multiple platforms
- Intelligent Turkish price format parsing (1.300,50 TL)
- Historical price tracking
- Price change detection

### Notifications
- Email notifications via Nodemailer
- SMS support (configurable)
- Custom notification preferences per product
- Threshold-based alerts

### Modern UI/UX
- Glassmorphism design
- Smooth animations and transitions
- Responsive layout for all devices
- Dark/Light theme with system preference support

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm run preview

# Run with Docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## 📂 Project Structure

```
3--Price-Tracker/
├── components/          # Vue components
│   ├── Navbar.vue
│   └── ThemeToggle.vue
├── composables/         # Composition API composables
│   ├── useAuth.ts
│   └── useTheme.ts
├── pages/              # Application pages
│   ├── index.vue
│   ├── login.vue
│   ├── register.vue
│   ├── profile.vue
│   └── products/
│       └── [id].vue
├── server/             # Backend API
│   ├── api/           # API endpoints
│   ├── models/        # MongoDB models
│   ├── services/      # Business logic
│   ├── utils/         # Utilities
│   └── plugins/       # Server plugins
├── docker-compose.yml  # Docker configuration
├── Dockerfile         # Container definition
└── nuxt.config.ts     # Nuxt configuration
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - List user's products
- `POST /api/products` - Add new product
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/:id/check-price` - Manual price check
- `GET /api/products/stats` - User statistics

### Utilities
- `POST /api/check-all` - Check all user's products

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with ❤️ using [Nuxt.js](https://nuxt.com/) and [Vue 3](https://vuejs.org/)
- UI inspired by modern design trends
- Thanks to all open-source contributors

## 📞 Support

For support, please open an issue on GitHub or contact the maintainers.

---

<a name="tr"></a>

## 🌟 Özellikler

- 🔍 **Çoklu Platform Desteği** - Trendyol, Hepsiburada, N11, Amazon, GittiGidiyor, Çiçeksepeti, Morhipo, Defacto, LC Waikiki ve daha fazlası
- 📧 **Akıllı Bildirimler** - Fiyat düştüğünde e-posta/SMS bildirimi alın
- 🌓 **Karanlık/Aydınlık Mod** - Kusursuz tema geçişli güzel arayüz
- 👤 **Kullanıcı Kimlik Doğrulama** - Güvenli JWT tabanlı kimlik doğrulama sistemi
- 📊 **Fiyat Geçmişi** - Detaylı geçmiş verilerle görsel fiyat takibi
- ⚙️ **Özelleştirilebilir Ayarlar** - Her ürün için ayrı fiyat düşüş eşikleri
- 🐳 **Docker Desteği** - Docker ve Docker Compose ile kolay kurulum
- 🔄 **Otomatik Kontroller** - Her 6 saatte bir zamanlanmış fiyat kontrolleri
- 📱 **Responsive Tasarım** - Masaüstü, tablet ve mobilde mükemmel çalışır

## 🚀 Teknoloji Yığını

### Frontend
- **Nuxt.js 4** - Sezgisel Vue Framework'ü
- **Vue 3** - Progressive JavaScript Framework
- **Tailwind CSS** - Utility-first CSS Framework
- **Composition API** - Modern Vue geliştirme

### Backend
- **Nitro** - Yeni Nesil Sunucu Araç Seti
- **Node.js** - JavaScript Runtime
- **MongoDB** - NoSQL Veritabanı
- **Mongoose** - Şık MongoDB ODM

### Kütüphaneler & Araçlar
- **JWT** - Güvenli kimlik doğrulama
- **bcrypt** - Şifre hashleme
- **Axios + Cheerio** - Web kazıma
- **node-schedule** - Cron job zamanlayıcı
- **Nodemailer** - E-posta bildirimleri
- **Docker** - Konteynerizasyon

## 📦 Hızlı Başlangıç

### Gereksinimler

- **Node.js 18+** veya **Docker**
- **MongoDB** (veya Docker Compose kullanın)

### Seçenek 1: Docker (Önerilen) 🐳

```bash
# Depoyu klonlayın
git clone https://github.com/kullaniciadi/price-tracker.git
cd price-tracker

# Docker Compose ile başlatın
docker-compose up -d

# Uygulama http://localhost:3000 adresinde çalışacak
```

### Seçenek 2: Manuel Kurulum 💻

```bash
# Depoyu klonlayın
git clone https://github.com/kullaniciadi/price-tracker.git
cd price-tracker

# Bağımlılıkları yükleyin
npm install

# Ortam değişkenlerini kopyalayın
cp .env.example .env

# .env dosyasını yapılandırmanızla düzenleyin
# MongoDB'nin çalıştığından emin olun

# Geliştirme sunucusunu başlatın
npm run dev

# Uygulama http://localhost:3000 adresinde çalışacak
```

## 🔧 Ortam Yapılandırması

Kök dizinde bir `.env` dosyası oluşturun:

```env
# MongoDB Yapılandırması
MONGODB_URI=mongodb://localhost:27017/price-tracker

# JWT Gizli Anahtarı (ÜRETİMDE BUNU DEĞİŞTİRİN!)
JWT_SECRET=super-gizli-jwt-anahtariniz-bunu-degistirin

# E-posta Yapılandırması (İsteğe bağlı - e-posta bildirimleri için)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=eposta-adresiniz@gmail.com
EMAIL_PASS=gmail-uygulama-sifreniz

# SMS Yapılandırması (İsteğe bağlı - SMS bildirimleri için)
SMS_API_KEY=sms-api-anahtariniz

# Uygulama Ayarları
PRICE_DROP_THRESHOLD=5
CRON_SCHEDULE=0 */6 * * *
```

### Gmail E-posta Bildirimleri Kurulumu

1. Google Hesabınızda 2 Faktörlü Kimlik Doğrulama'yı etkinleştirin
2. Uygulama Şifresi oluşturun: https://myaccount.google.com/apppasswords
3. Oluşturulan şifreyi `EMAIL_PASS` içinde kullanın

## 📱 Kullanım Kılavuzu

1. **📝 Kayıt Ol/Giriş Yap**
   - Yeni bir hesap oluşturun veya mevcut kimlik bilgilerinizle giriş yapın
   - Tüm şifreler bcrypt ile güvenli şekilde hashlenir

2. **➕ Ürün Ekle**
   - Desteklenen e-ticaret platformlarından ürün URL'sini yapıştırın
   - Sistem otomatik olarak ürün bilgilerini çıkarır
   - Özel bildirim tercihlerini ayarlayın

3. **⚙️ Ayarları Yapılandır**
   - Bireysel fiyat düşüş eşiklerini ayarlayın
   - Bildirim yöntemini seçin (E-posta, SMS veya Her İkisi)
   - Profilde varsayılan tercihleri özelleştirin

4. **📊 Fiyatları Takip Et**
   - Gerçek zamanlı fiyat güncellemelerini görüntüleyin
   - Etkileşimli grafiklerle fiyat geçmişini analiz edin
   - Fiyat düşüşlerinde anında bildirim alın

5. **👤 Profili Yönet**
   - Kişisel bilgileri güncelleyin
   - Tema tercihini değiştirin
   - Varsayılan ayarları yapılandırın

## 🎨 Detaylı Özellikler

### Kullanıcı Kimlik Doğrulama
- Güvenli JWT tabanlı kimlik doğrulama
- bcrypt ile şifre hashleme
- Korumalı rotalar ve API endpoint'leri
- Kullanıcı oturum yönetimi

### Fiyat Takibi
- Birden fazla platformdan otomatik kazıma
- Akıllı Türkçe fiyat formatı ayrıştırma (1.300,50 TL)
- Geçmiş fiyat takibi
- Fiyat değişikliği algılama

### Bildirimler
- Nodemailer ile e-posta bildirimleri
- SMS desteği (yapılandırılabilir)
- Ürün başına özel bildirim tercihleri
- Eşik tabanlı uyarılar

### Modern UI/UX
- Glassmorphism tasarım
- Yumuşak animasyonlar ve geçişler
- Tüm cihazlar için responsive layout
- Sistem tercihi desteğiyle Karanlık/Aydınlık tema

## 🛠️ Geliştirme

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat (hot reload ile)
npm run dev

# Üretim için derle
npm run build

# Üretim sunucusunu başlat
npm run preview

# Docker ile çalıştır
docker-compose up -d

# Logları görüntüle
docker-compose logs -f

# Container'ları durdur
docker-compose down
```

## 📂 Proje Yapısı

```
3--Price-Tracker/
├── components/          # Vue bileşenleri
│   ├── Navbar.vue
│   └── ThemeToggle.vue
├── composables/         # Composition API composables
│   ├── useAuth.ts
│   └── useTheme.ts
├── pages/              # Uygulama sayfaları
│   ├── index.vue
│   ├── login.vue
│   ├── register.vue
│   ├── profile.vue
│   └── products/
│       └── [id].vue
├── server/             # Backend API
│   ├── api/           # API endpoint'leri
│   ├── models/        # MongoDB modelleri
│   ├── services/      # İş mantığı
│   ├── utils/         # Yardımcı araçlar
│   └── plugins/       # Sunucu eklentileri
├── docker-compose.yml  # Docker yapılandırması
├── Dockerfile         # Container tanımı
└── nuxt.config.ts     # Nuxt yapılandırması
```

## 🔌 API Endpoint'leri

### Kimlik Doğrulama
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Mevcut kullanıcıyı getir
- `PUT /api/auth/profile` - Profili güncelle

### Ürünler
- `GET /api/products` - Kullanıcının ürünlerini listele
- `POST /api/products` - Yeni ürün ekle
- `GET /api/products/:id` - Ürün detaylarını getir
- `PUT /api/products/:id` - Ürünü güncelle
- `DELETE /api/products/:id` - Ürünü sil
- `POST /api/products/:id/check-price` - Manuel fiyat kontrolü
- `GET /api/products/stats` - Kullanıcı istatistikleri

### Yardımcı
- `POST /api/check-all` - Kullanıcının tüm ürünlerini kontrol et

## 🤝 Katkıda Bulunma

Katkılar memnuniyetle karşılanır! Lütfen çekinmeden Pull Request gönderin.

1. Depoyu fork edin
2. Feature branch'inizi oluşturun (`git checkout -b feature/HarikaBirOzellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Harika bir özellik eklendi'`)
4. Branch'e push edin (`git push origin feature/HarikaBirOzellik`)
5. Pull Request açın

## 📄 Lisans

Bu proje açık kaynaklıdır ve [MIT Lisansı](LICENSE) altında kullanılabilir.

## 🙏 Teşekkürler

- [Nuxt.js](https://nuxt.com/) ve [Vue 3](https://vuejs.org/) kullanılarak ❤️ ile yapılmıştır
- UI modern tasarım trendlerinden ilham alınmıştır
- Tüm açık kaynak katkıda bulunanlara teşekkürler

## 📞 Destek

Destek için lütfen GitHub'da bir issue açın veya geliştiricilerle iletişime geçin.

---

<div align="center">

**⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın! ⭐**

Made with ❤️ by developers, for developers

</div>
