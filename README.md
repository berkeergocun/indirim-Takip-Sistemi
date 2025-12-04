# 🛍️ Price Tracker

E-ticaret sitelerindeki ürün fiyatlarını takip eden, indirim olduğunda email veya SMS ile bildirim gönderen otomatik fiyat takip uygulaması.

## 🌟 Özellikler

- ✅ Çoklu e-ticaret platformu desteği (Trendyol, Hepsiburada, N11, Amazon, vb.)
- ✅ Otomatik fiyat kontrolü (Cron job ile)
- ✅ Email bildirimleri (Nodemailer)
- ✅ SMS bildirimleri (Twilio entegrasyonu hazır)
- ✅ Fiyat geçmişi takibi
- ✅ Özelleştirilebilir indirim eşiği
- ✅ Modern ve responsive arayüz
- ✅ Docker ile kolay kurulum
- ✅ MongoDB veritabanı

## 🚀 Hızlı Başlangıç (Docker ile)

### Gereksinimler

- Docker
- Docker Compose

### Kurulum

1. **Projeyi klonlayın:**
   ```bash
   git clone <repo-url>
   cd 3--Price-Tracker
   ```

2. **Ortam değişkenlerini ayarlayın:**
   ```bash
   cp .env.example .env
   ```
   
   `.env` dosyasını düzenleyerek email ayarlarınızı yapın:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   EMAIL_FROM=Price Tracker <noreply@pricetracker.com>
   ```

3. **Docker ile başlatın:**
   ```bash
   docker-compose up -d
   ```

4. **Uygulamayı açın:**
   ```
   http://localhost:3000
   ```

## 🔧 Manuel Kurulum

### Gereksinimler

- Node.js 20+
- MongoDB
- npm veya yarn

### Adımlar

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **MongoDB'yi başlatın:**
   ```bash
   # Docker ile
   docker run -d -p 27017:27017 --name mongodb mongo:7
   
   # veya lokal MongoDB kullanın
   ```

3. **Ortam değişkenlerini ayarlayın:**
   ```bash
   cp .env.example .env
   # .env dosyasını düzenleyin
   ```

4. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

5. **Production için build:**
   ```bash
   npm run build
   npm run preview
   ```

## 📖 Kullanım

### Ürün Ekleme

1. Ana sayfada ürün URL'ini girin
2. Email adresinizi girin (bildirimler için)
3. Bildirim tercihini seçin (Email/SMS/Her İkisi)
4. İndirim eşiğini belirleyin (örn: %5)
5. "Ürünü Takibe Al" butonuna tıklayın

### Fiyat Kontrolü

- **Otomatik:** Cron job her 6 saatte bir tüm ürünleri kontrol eder (değiştirilebilir)
- **Manuel:** 
  - Tek ürün için: Ürün kartında "Kontrol Et" butonuna tıklayın
  - Tüm ürünler için: "Tüm Fiyatları Kontrol Et" butonuna tıklayın

### Fiyat Geçmişi

Ürün detay sayfasında:
- Fiyat değişim grafiği
- Tüm fiyat kayıtları tablosu
- Değişim yüzdeleri

## 🛠️ Teknolojiler

- **Frontend:** Nuxt.js 3, Vue 3, Tailwind CSS
- **Backend:** Nuxt Server API (Nitro)
- **Database:** MongoDB, Mongoose
- **Web Scraping:** Axios, Cheerio
- **Scheduler:** node-cron
- **Email:** Nodemailer
- **SMS:** Twilio (opsiyonel)
- **Container:** Docker, Docker Compose

## 📁 Proje Yapısı

```
3--Price-Tracker/
├── app/
│   ├── pages/
│   │   ├── index.vue              # Ana sayfa
│   │   └── products/[id].vue      # Ürün detay sayfası
│   └── app.vue                    # Root component
├── server/
│   ├── api/
│   │   ├── products/              # Product API endpoints
│   │   └── check-all.post.ts      # Tüm ürünleri kontrol et
│   ├── models/
│   │   ├── Product.ts             # Product modeli
│   │   └── PriceHistory.ts        # Fiyat geçmişi modeli
│   ├── services/
│   │   ├── scraper.service.ts     # Web scraping servisi
│   │   ├── notification.service.ts # Bildirim servisi
│   │   ├── price-checker.service.ts # Fiyat kontrol servisi
│   │   └── scheduler.service.ts   # Cron job servisi
│   ├── plugins/
│   │   └── scheduler.ts           # Scheduler plugin
│   └── utils/
│       └── db.ts                  # MongoDB bağlantısı
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── README.md
```

## 🔐 Email Ayarları (Gmail için)

1. Gmail hesabınıza giriş yapın
2. "Hesabınızı Yönetin" > "Güvenlik"
3. "2 Adımlı Doğrulama"yı etkinleştirin
4. "Uygulama şifreleri" oluşturun
5. Oluşturulan şifreyi `.env` dosyasında `SMTP_PASSWORD` olarak kullanın

## 📊 Desteklenen E-ticaret Siteleri

- ✅ Trendyol
- ✅ Hepsiburada
- ✅ N11
- ✅ Amazon
- ✅ Diğer siteler (genel scraping)

## ⚙️ Ortam Değişkenleri

| Değişken | Açıklama | Varsayılan |
|----------|----------|------------|
| `MONGODB_URI` | MongoDB bağlantı URL'i | `mongodb://localhost:27017/price-tracker` |
| `SMTP_HOST` | SMTP sunucu adresi | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP kullanıcı adı | - |
| `SMTP_PASSWORD` | SMTP şifresi | - |
| `EMAIL_FROM` | Gönderen email adresi | `Price Tracker <noreply@pricetracker.com>` |
| `CRON_SCHEDULE` | Cron pattern | `0 */6 * * *` (6 saatte bir) |
| `PRICE_DROP_THRESHOLD` | Varsayılan indirim eşiği (%) | `5` |

## 🔄 Cron Schedule Örnekleri

- Her 6 saatte: `0 */6 * * *`
- Her gün 09:00: `0 9 * * *`
- Her 2 saatte: `0 */2 * * *`
- Her gece 00:00: `0 0 * * *`

## 🐛 Hata Ayıklama

**MongoDB bağlantı hatası:**
```bash
# MongoDB container'ının çalıştığından emin olun
docker ps | grep mongo

# Logları kontrol edin
docker logs price-tracker-mongo
```

**Email gönderilmiyor:**
- SMTP ayarlarını kontrol edin
- Gmail için "Uygulama şifresi" kullandığınızdan emin olun
- Firewall ayarlarını kontrol edin

**Scraping çalışmıyor:**
- Bazı siteler bot koruması kullanabilir
- User-Agent header'ı güncellemeyi deneyin
- Rate limiting olabilir, bekleme sürelerini artırın

## 📝 Lisans

MIT

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📧 İletişim

Sorularınız için issue açabilirsiniz.

## 🎯 Gelecek Özellikler

- [ ] Mobil uygulama (React Native)
- [ ] Daha fazla e-ticaret sitesi desteği
- [ ] Kullanıcı yönetimi ve authentication
- [ ] Dashboard ve istatistikler
- [ ] WhatsApp bildirimleri
- [ ] Telegram bot entegrasyonu
- [ ] Fiyat alarmları ve hedef fiyat belirleme
- [ ] Kategori bazlı filtreleme

---

⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!
