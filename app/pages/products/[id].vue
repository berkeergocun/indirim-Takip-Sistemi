<template>
  <div class="container mx-auto px-4 py-8">
    <button
      @click="$router.back()"
      class="mb-6 text-purple-600 hover:text-purple-800 flex items-center gap-2"
    >
      ← Geri Dön
    </button>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      <p class="mt-4 text-gray-600">Yükleniyor...</p>
    </div>

    <div v-else-if="product" class="space-y-6">
      <!-- Product Info -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img
              v-if="product.imageUrl"
              :src="product.imageUrl"
              :alt="product.title"
              class="w-full h-auto rounded-lg"
            />
          </div>

          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ product.title }}</h1>
            
            <div class="space-y-3 mb-6">
              <div class="flex items-center gap-2">
                <span class="text-gray-600">Platform:</span>
                <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-semibold">
                  {{ product.platform.toUpperCase() }}
                </span>
              </div>

              <div class="flex items-center gap-2">
                <span class="text-gray-600">Durum:</span>
                <span :class="['px-3 py-1 rounded-full font-semibold', product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800']">
                  {{ product.isActive ? 'Aktif' : 'Pasif' }}
                </span>
              </div>

              <div>
                <span class="text-gray-600">Güncel Fiyat:</span>
                <div class="text-4xl font-bold text-purple-600 mt-2">
                  {{ product.currentPrice.toFixed(2) }} ₺
                </div>
              </div>

              <div v-if="product.currentPrice < product.originalPrice">
                <span class="text-gray-600">Başlangıç Fiyatı:</span>
                <div class="text-xl text-gray-500 line-through">
                  {{ product.originalPrice.toFixed(2) }} ₺
                </div>
                <div class="text-red-500 font-semibold">
                  %{{ (((product.originalPrice - product.currentPrice) / product.originalPrice) * 100).toFixed(2) }} İndirim
                </div>
              </div>

              <div class="pt-4 border-t">
                <div class="text-sm text-gray-600 space-y-1">
                  <div>📧 {{ product.userEmail || 'Belirtilmemiş' }}</div>
                  <div>📱 {{ product.userPhone || 'Belirtilmemiş' }}</div>
                  <div>🔔 Bildirim: {{ getNotificationText(product.notificationPreference) }}</div>
                  <div>📊 İndirim Eşiği: %{{ product.priceDropThreshold }}</div>
                  <div v-if="product.lastChecked">⏰ Son Kontrol: {{ formatDate(product.lastChecked) }}</div>
                </div>
              </div>
            </div>

            <div class="flex gap-3">
              <a
                :href="product.url"
                target="_blank"
                class="flex-1 bg-purple-600 text-white text-center px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                🛒 Ürünü Görüntüle
              </a>
              <button
                @click="checkPrice"
                class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                🔍 Fiyatı Kontrol Et
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Price History Chart -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">📈 Fiyat Geçmişi</h2>
        
        <div v-if="priceHistory.length === 0" class="text-center py-12 text-gray-500">
          Henüz fiyat geçmişi bulunmuyor.
        </div>

        <div v-else>
          <!-- Simple price history table -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-3 px-4">Tarih</th>
                  <th class="text-right py-3 px-4">Fiyat</th>
                  <th class="text-right py-3 px-4">Değişim</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(history, index) in priceHistory"
                  :key="history._id"
                  class="border-b hover:bg-gray-50"
                >
                  <td class="py-3 px-4">{{ formatDate(history.checkedAt) }}</td>
                  <td class="py-3 px-4 text-right font-semibold">{{ history.price.toFixed(2) }} ₺</td>
                  <td class="py-3 px-4 text-right">
                    <span
                      v-if="index < priceHistory.length - 1"
                      :class="getPriceChangeClass(history.price, priceHistory[index + 1].price)"
                    >
                      {{ getPriceChange(history.price, priceHistory[index + 1].price) }}
                    </span>
                    <span v-else class="text-gray-400">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Visual Price Chart -->
          <div class="mt-6">
            <div class="relative h-64 border rounded-lg p-4">
              <svg class="w-full h-full">
                <polyline
                  :points="getChartPoints()"
                  fill="none"
                  stroke="#9333ea"
                  stroke-width="2"
                />
                <circle
                  v-for="(point, index) in getChartCircles()"
                  :key="index"
                  :cx="point.x"
                  :cy="point.y"
                  r="4"
                  fill="#9333ea"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12 text-gray-500">
      Ürün bulunamadı.
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const productId = route.params.id as string;

const product = ref<any>(null);
const priceHistory = ref<any[]>([]);
const loading = ref(true);

onMounted(() => {
  loadProduct();
});

async function loadProduct() {
  loading.value = true;
  try {
    const response: any = await $fetch(`/api/products/${productId}`);
    product.value = response.data.product;
    priceHistory.value = response.data.priceHistory;
  } catch (error) {
    console.error('Error loading product:', error);
  } finally {
    loading.value = false;
  }
}

async function checkPrice() {
  try {
    await $fetch(`/api/products/${productId}/check-price`, {
      method: 'POST',
    });
    
    await loadProduct();
    alert('Fiyat kontrolü tamamlandı!');
  } catch (error) {
    alert('Fiyat kontrolü sırasında bir hata oluştu.');
  }
}

function getNotificationText(pref: string): string {
  switch (pref) {
    case 'email': return 'E-posta';
    case 'sms': return 'SMS';
    case 'both': return 'E-posta & SMS';
    default: return pref;
  }
}

function formatDate(date: string): string {
  return new Date(date).toLocaleString('tr-TR');
}

function getPriceChange(current: number, previous: number): string {
  const diff = current - previous;
  const percentage = ((diff / previous) * 100).toFixed(2);
  return diff > 0 ? `+${diff.toFixed(2)} ₺ (+${percentage}%)` : `${diff.toFixed(2)} ₺ (${percentage}%)`;
}

function getPriceChangeClass(current: number, previous: number): string {
  if (current < previous) return 'text-green-600 font-semibold';
  if (current > previous) return 'text-red-600 font-semibold';
  return 'text-gray-600';
}

function getChartPoints(): string {
  if (priceHistory.value.length === 0) return '';
  
  const reversed = [...priceHistory.value].reverse();
  const prices = reversed.map(h => h.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 1;
  
  const width = 800;
  const height = 200;
  const padding = 20;
  
  return reversed.map((history, index) => {
    const x = padding + (index / (reversed.length - 1 || 1)) * (width - 2 * padding);
    const y = height - padding - ((history.price - minPrice) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');
}

function getChartCircles(): Array<{x: number, y: number}> {
  if (priceHistory.value.length === 0) return [];
  
  const reversed = [...priceHistory.value].reverse();
  const prices = reversed.map(h => h.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 1;
  
  const width = 800;
  const height = 200;
  const padding = 20;
  
  return reversed.map((history, index) => {
    const x = padding + (index / (reversed.length - 1 || 1)) * (width - 2 * padding);
    const y = height - padding - ((history.price - minPrice) / range) * (height - 2 * padding);
    return { x, y };
  });
}
</script>
