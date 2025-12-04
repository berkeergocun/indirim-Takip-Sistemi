<template>
  <div>
    <Navbar />
    
    <div class="container mx-auto px-4 py-8">
      <!-- Back Button -->
      <button
        @click="$router.back()"
        class="mb-6 flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
      >
        <span>←</span> Geri Dön
      </button>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 dark:border-purple-400"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400 text-lg">Yükleniyor...</p>
      </div>

      <!-- Product Details -->
      <div v-else-if="product" class="space-y-6">
        <!-- Product Info Card -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <!-- Product Image -->
            <div>
              <div v-if="product.imageUrl" class="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl overflow-hidden aspect-square flex items-center justify-center">
                <img
                  :src="product.imageUrl"
                  :alt="product.title"
                  class="w-full h-full object-contain p-8"
                />
              </div>
            </div>

            <!-- Product Details -->
            <div>
              <div class="flex items-start justify-between mb-4">
                <span class="px-3 py-1 text-xs font-bold rounded-full bg-purple-500 text-white shadow-lg">
                  {{ product.platform.toUpperCase() }}
                </span>
                <span :class="['px-3 py-1 text-xs font-bold rounded-full shadow-lg', product.isActive ? 'bg-green-500 text-white' : 'bg-gray-400 text-white']">
                  {{ product.isActive ? '✓ Aktif' : '○ Pasif' }}
                </span>
              </div>

              <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {{ product.title }}
              </h1>

              <!-- Price Info -->
              <div class="mb-6">
                <div class="flex items-baseline gap-4 mb-2">
                  <span class="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                    {{ product.currentPrice.toFixed(2) }} ₺
                  </span>
                  <span v-if="product.currentPrice < product.originalPrice" class="text-xl font-bold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-full">
                    -{{ (((product.originalPrice - product.currentPrice) / product.originalPrice) * 100).toFixed(1) }}%
                  </span>
                </div>
                <div v-if="product.currentPrice < product.originalPrice" class="text-lg text-gray-500 dark:text-gray-400 line-through">
                  Orijinal Fiyat: {{ product.originalPrice.toFixed(2) }} ₺
                </div>
              </div>

              <!-- Product Settings -->
              <div class="space-y-4 mb-6">
                <div class="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <span class="text-xl">🔔</span>
                  <span>Bildirim: {{ getNotificationText(product.notificationPreference) }}</span>
                </div>
                <div class="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <span class="text-xl">📊</span>
                  <span>İndirim Eşiği: %{{ product.priceDropThreshold }}</span>
                </div>
                <div class="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <span class="text-xl">⏰</span>
                  <span>Son Kontrol: {{ formatDate(product.lastChecked) }}</span>
                </div>
                <div class="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <span class="text-xl">📅</span>
                  <span>Eklenme: {{ formatDate(product.createdAt) }}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-3">
                <a
                  :href="product.url"
                  target="_blank"
                  class="flex-1 min-w-[200px] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg transform hover:scale-[1.02] text-center"
                >
                  🛒 Ürünü Görüntüle
                </a>
                <button
                  @click="checkPrice"
                  class="flex-1 min-w-[200px] bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
                >
                  🔍 Fiyatı Kontrol Et
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Price History -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span>📈</span> Fiyat Geçmişi
          </h2>

          <div v-if="priceHistory.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
            Henüz fiyat geçmişi yok
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="(history, index) in priceHistory"
              :key="index"
              class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div class="flex items-center gap-4">
                <div class="text-2xl">
                  <span v-if="index < priceHistory.length - 1">
                    {{ history.price < priceHistory[index + 1].price ? '📉' : history.price > priceHistory[index + 1].price ? '📈' : '➖' }}
                  </span>
                  <span v-else>📍</span>
                </div>
                <div>
                  <div class="font-bold text-gray-900 dark:text-white">
                    {{ history.price.toFixed(2) }} ₺
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(history.checkedAt) }}
                  </div>
                </div>
              </div>
              <div v-if="index < priceHistory.length - 1" class="text-right">
                <div
                  v-if="history.price !== priceHistory[index + 1].price"
                  :class="[
                    'font-bold',
                    history.price < priceHistory[index + 1].price ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  ]"
                >
                  {{ history.price < priceHistory[index + 1].price ? '-' : '+' }}{{ Math.abs(history.price - priceHistory[index + 1].price).toFixed(2) }} ₺
                </div>
                <div
                  v-if="history.price !== priceHistory[index + 1].price"
                  :class="[
                    'text-sm',
                    history.price < priceHistory[index + 1].price ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  ]"
                >
                  {{ ((Math.abs(history.price - priceHistory[index + 1].price) / priceHistory[index + 1].price) * 100).toFixed(1) }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { token } = useAuth();

const product = ref<any>(null);
const priceHistory = ref<any[]>([]);
const loading = ref(true);

const productId = route.params.id as string;

onMounted(() => {
  loadProduct();
});

async function loadProduct() {
  if (!token.value) {
    router.push('/login');
    return;
  }

  loading.value = true;
  try {
    const response: any = await $fetch(`/api/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    product.value = response.data.product;
    priceHistory.value = response.data.priceHistory;
  } catch (error) {
    console.error('Error loading product:', error);
    router.push('/');
  } finally {
    loading.value = false;
  }
}

async function checkPrice() {
  try {
    await $fetch(`/api/products/${productId}/check-price`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
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
  return new Date(date).toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
</script>
