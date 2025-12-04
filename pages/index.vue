<template>
  <div>
    <Navbar />
    
    <div class="container mx-auto px-4 py-8">
      <!-- Welcome Section -->
      <div v-if="!isAuthenticated" class="text-center mb-12 py-12">
        <h1 class="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 dark:from-purple-400 dark:via-blue-400 dark:to-pink-400 bg-clip-text text-transparent mb-4 animate-gradient">
          Fiyat Takibi Artık Çok Kolay!
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
          E-ticaret sitelerindeki ürün fiyatlarını takip edin, indirimlerden haberdar olun!
        </p>
        <div class="flex gap-4 justify-center">
          <NuxtLink
            to="/register"
            class="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow-2xl transform hover:scale-105 transition-all"
          >
            🚀 Hemen Başla
          </NuxtLink>
          <NuxtLink
            to="/login"
            class="px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all border border-gray-200 dark:border-gray-700"
          >
            Giriş Yap
          </NuxtLink>
        </div>
      </div>

      <div v-else>
        <!-- Add Product Form -->
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
            <span>➕</span> Yeni Ürün Ekle
          </h2>
          
          <form @submit.prevent="addProduct" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ürün URL'i *
                </label>
                <input
                  v-model="newProduct.url"
                  type="url"
                  required
                  placeholder="https://www.trendyol.com/..."
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  İndirim Eşiği (%)
                </label>
                <input
                  v-model.number="newProduct.priceDropThreshold"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="5"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bildirim Tercihi
                </label>
                <select
                  v-model="newProduct.notificationPreference"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all"
                >
                  <option value="email">E-posta</option>
                  <option value="sms">SMS</option>
                  <option value="both">Her İkisi</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              :disabled="isAdding"
              class="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg transform hover:scale-[1.02]"
            >
              {{ isAdding ? '⏳ Ekleniyor...' : '➕ Ürünü Takibe Al' }}
            </button>
          </form>

          <div v-if="addMessage" :class="['mt-4 p-4 rounded-lg', addMessage.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400']">
            {{ addMessage.text }}
          </div>
        </div>

        <!-- Products List Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📦</span> Takip Edilen Ürünler
          </h2>
          <button
            @click="checkAllPrices"
            :disabled="isCheckingAll"
            class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center gap-2"
          >
            <span>{{ isCheckingAll ? '⏳' : '🔄' }}</span>
            {{ isCheckingAll ? 'Kontrol Ediliyor...' : 'Tüm Fiyatları Kontrol Et' }}
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 dark:border-purple-400"></div>
          <p class="mt-4 text-gray-600 dark:text-gray-400 text-lg">Yükleniyor...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="products.length === 0" class="text-center py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div class="text-6xl mb-4">🛒</div>
          <p class="text-xl text-gray-600 dark:text-gray-400 mb-2">Henüz takip edilen ürün yok</p>
          <p class="text-gray-500 dark:text-gray-500">Yukarıdaki formu kullanarak yeni bir ürün ekleyin!</p>
        </div>

        <!-- Products Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="product in products"
            :key="product._id"
            class="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 transform hover:scale-[1.02]"
          >
            <!-- Product Image -->
            <div v-if="product.imageUrl" class="h-56 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden relative">
              <img
                :src="product.imageUrl"
                :alt="product.title"
                class="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
              />
              <!-- Platform Badge -->
              <div class="absolute top-3 left-3">
                <span class="px-3 py-1 text-xs font-bold rounded-full bg-purple-500 text-white shadow-lg">
                  {{ product.platform.toUpperCase() }}
                </span>
              </div>
              <!-- Status Badge -->
              <div class="absolute top-3 right-3">
                <span :class="['px-3 py-1 text-xs font-bold rounded-full shadow-lg', product.isActive ? 'bg-green-500 text-white' : 'bg-gray-400 text-white']">
                  {{ product.isActive ? '✓ Aktif' : '○ Pasif' }}
                </span>
              </div>
            </div>

            <!-- Product Info -->
            <div class="p-5">
              <h3 class="font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" :title="product.title">
                {{ product.title }}
              </h3>

              <!-- Price Info -->
              <div class="mb-4">
                <div class="flex items-baseline justify-between mb-1">
                  <span class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                    {{ product.currentPrice.toFixed(2) }} ₺
                  </span>
                  <span v-if="product.currentPrice < product.originalPrice" class="text-sm font-bold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-full">
                    -{{ (((product.originalPrice - product.currentPrice) / product.originalPrice) * 100).toFixed(1) }}%
                  </span>
                </div>
                <div v-if="product.currentPrice < product.originalPrice" class="text-sm text-gray-500 dark:text-gray-400 line-through">
                  {{ product.originalPrice.toFixed(2) }} ₺
                </div>
              </div>

              <!-- Product Details -->
              <div class="text-xs text-gray-600 dark:text-gray-400 space-y-1 mb-4">
                <div class="flex items-center gap-1">
                  <span>🔔</span>
                  <span>{{ getNotificationText(product.notificationPreference) }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <span>📊</span>
                  <span>Eşik: %{{ product.priceDropThreshold }}</span>
                </div>
                <div v-if="product.lastChecked" class="flex items-center gap-1">
                  <span>⏰</span>
                  <span>{{ formatDate(product.lastChecked) }}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-2">
                <button
                  @click="checkPrice(product._id)"
                  class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  🔍 Kontrol
                </button>
                <button
                  @click="viewDetails(product._id)"
                  class="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  📊 Detay
                </button>
                <button
                  @click="deleteProduct(product._id)"
                  class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.pages > 1" class="mt-8 flex justify-center gap-2">
          <button
            v-for="page in pagination.pages"
            :key="page"
            @click="loadProducts(page)"
            :class="[
              'px-4 py-2 rounded-lg font-semibold transition-all',
              page === pagination.page
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, token, isAuthenticated } = useAuth();
const products = ref<any[]>([]);
const loading = ref(true);
const isAdding = ref(false);
const isCheckingAll = ref(false);
const addMessage = ref<{ text: string; type: 'success' | 'error' } | null>(null);

const pagination = ref({
  page: 1,
  limit: 9,
  total: 0,
  pages: 0,
});

const newProduct = ref({
  url: '',
  notificationPreference: 'email',
  priceDropThreshold: user.value?.defaultPriceDropThreshold || 5,
});

// Redirect to login if not authenticated
if (!isAuthenticated.value) {
  // Just show welcome page, don't redirect
}

onMounted(() => {
  if (isAuthenticated.value) {
    loadProducts();
  } else {
    loading.value = false;
  }
});

async function loadProducts(page = 1) {
  if (!token.value) return;
  
  loading.value = true;
  try {
    const response: any = await $fetch(`/api/products?page=${page}&limit=${pagination.value.limit}`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    products.value = response.data;
    pagination.value = response.pagination;
  } catch (error) {
    console.error('Error loading products:', error);
  } finally {
    loading.value = false;
  }
}

async function addProduct() {
  isAdding.value = true;
  addMessage.value = null;

  try {
    const response: any = await $fetch('/api/products', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: newProduct.value,
    });

    addMessage.value = {
      text: response.message || 'Ürün başarıyla eklendi!',
      type: 'success',
    };

    // Reset form
    newProduct.value = {
      url: '',
      notificationPreference: 'email',
      priceDropThreshold: user.value?.defaultPriceDropThreshold || 5,
    };

    // Reload products
    await loadProducts();
  } catch (error: any) {
    addMessage.value = {
      text: error.data?.message || 'Ürün eklenirken bir hata oluştu.',
      type: 'error',
    };
  } finally {
    isAdding.value = false;
  }
}

async function checkPrice(productId: string) {
  try {
    await $fetch(`/api/products/${productId}/check-price`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    
    await loadProducts(pagination.value.page);
    alert('Fiyat kontrolü tamamlandı!');
  } catch (error) {
    alert('Fiyat kontrolü sırasında bir hata oluştu.');
  }
}

async function checkAllPrices() {
  if (!confirm('Tüm ürünlerin fiyatları kontrol edilecek. Bu işlem birkaç dakika sürebilir. Devam edilsin mi?')) {
    return;
  }

  isCheckingAll.value = true;
  try {
    await $fetch('/api/check-all', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    
    await loadProducts(pagination.value.page);
    alert('Tüm fiyatlar kontrol edildi!');
  } catch (error) {
    alert('Fiyat kontrolü sırasında bir hata oluştu.');
  } finally {
    isCheckingAll.value = false;
  }
}

async function deleteProduct(productId: string) {
  if (!confirm('Bu ürünü takipten çıkarmak istediğinize emin misiniz?')) {
    return;
  }

  try {
    await $fetch(`/api/products/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    
    await loadProducts(pagination.value.page);
  } catch (error) {
    alert('Ürün silinirken bir hata oluştu.');
  }
}

function viewDetails(productId: string) {
  navigateTo(`/products/${productId}`);
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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes gradient {
  0%, 100% {
    background-size: 200% 200%;
    background-position: left center;
  }
  50% {
    background-size: 200% 200%;
    background-position: right center;
  }
}

.animate-gradient {
  animation: gradient 3s ease infinite;
}
</style>
