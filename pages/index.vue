<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <header class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold text-gray-800 mb-2">
            🛍️ Price Tracker
          </h1>
          <p class="text-gray-600">
            E-ticaret sitelerindeki ürün fiyatlarını takip edin, indirimlerden haberdar olun!
          </p>
        </div>
        <button
          @click="checkAllPrices"
          :disabled="isCheckingAll"
          class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {{ isCheckingAll ? '⏳ Kontrol Ediliyor...' : '🔄 Tüm Fiyatları Kontrol Et' }}
        </button>
      </div>
    </header>

    <!-- Add Product Form -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">➕ Yeni Ürün Ekle</h2>
      
      <form @submit.prevent="addProduct" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ürün URL'i *
            </label>
            <input
              v-model="newProduct.url"
              type="url"
              required
              placeholder="https://www.trendyol.com/..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              E-posta
            </label>
            <input
              v-model="newProduct.userEmail"
              type="email"
              placeholder="email@example.com"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Telefon (SMS için)
            </label>
            <input
              v-model="newProduct.userPhone"
              type="tel"
              placeholder="+90 555 123 4567"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Bildirim Tercihi
            </label>
            <select
              v-model="newProduct.notificationPreference"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="email">E-posta</option>
              <option value="sms">SMS</option>
              <option value="both">Her İkisi</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              İndirim Eşiği (%)
            </label>
            <input
              v-model.number="newProduct.priceDropThreshold"
              type="number"
              min="1"
              max="100"
              placeholder="5"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="isAdding"
          class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
        >
          {{ isAdding ? '⏳ Ekleniyor...' : '➕ Ürünü Takibe Al' }}
        </button>
      </form>

      <div v-if="addMessage" :class="['mt-4 p-4 rounded-lg', addMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
        {{ addMessage.text }}
      </div>
    </div>

    <!-- Products List -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <h2 class="text-2xl font-semibold mb-6 text-gray-800">📦 Takip Edilen Ürünler</h2>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p class="mt-4 text-gray-600">Yükleniyor...</p>
      </div>

      <div v-else-if="products.length === 0" class="text-center py-12 text-gray-500">
        <p class="text-xl">Henüz takip edilen ürün yok.</p>
        <p class="mt-2">Yukarıdaki formu kullanarak yeni bir ürün ekleyin!</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="product in products"
          :key="product._id"
          class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div v-if="product.imageUrl" class="h-48 bg-gray-100">
            <img
              :src="product.imageUrl"
              :alt="product.title"
              class="w-full h-full object-contain"
            />
          </div>
          
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                {{ product.platform.toUpperCase() }}
              </span>
              <span :class="['px-2 py-1 text-xs font-semibold rounded-full', product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800']">
                {{ product.isActive ? 'Aktif' : 'Pasif' }}
              </span>
            </div>

            <h3 class="font-semibold text-gray-800 mb-2 line-clamp-2" :title="product.title">
              {{ product.title }}
            </h3>

            <div class="mb-3">
              <div class="flex items-baseline justify-between mb-1">
                <span class="text-2xl font-bold text-purple-600">
                  {{ product.currentPrice.toFixed(2) }} ₺
                </span>
                <span v-if="product.currentPrice < product.originalPrice" class="text-sm text-red-500 font-semibold">
                  -{{ (((product.originalPrice - product.currentPrice) / product.originalPrice) * 100).toFixed(1) }}%
                </span>
              </div>
              <div v-if="product.currentPrice < product.originalPrice" class="text-sm text-gray-500 line-through">
                {{ product.originalPrice.toFixed(2) }} ₺
              </div>
            </div>

            <div class="text-xs text-gray-500 mb-3 space-y-1">
              <div>📧 {{ product.userEmail || 'Belirtilmemiş' }}</div>
              <div>🔔 {{ getNotificationText(product.notificationPreference) }}</div>
              <div>📊 Eşik: %{{ product.priceDropThreshold }}</div>
              <div v-if="product.lastChecked">
                ⏰ Son kontrol: {{ formatDate(product.lastChecked) }}
              </div>
            </div>

            <div class="flex gap-2">
              <button
                @click="checkPrice(product._id)"
                class="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
              >
                🔍 Kontrol Et
              </button>
              <button
                @click="viewDetails(product._id)"
                class="flex-1 bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600 transition-colors"
              >
                📊 Detay
              </button>
              <button
                @click="deleteProduct(product._id)"
                class="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors"
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
            'px-4 py-2 rounded',
            page === pagination.page
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  userEmail: '',
  userPhone: '',
  notificationPreference: 'email',
  priceDropThreshold: 5,
});

// Load products on mount
onMounted(() => {
  loadProducts();
});

async function loadProducts(page = 1) {
  loading.value = true;
  try {
    const response = await $fetch(`/api/products?page=${page}&limit=${pagination.value.limit}`);
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
    const response = await $fetch('/api/products', {
      method: 'POST',
      body: newProduct.value,
    });

    addMessage.value = {
      text: response.message || 'Ürün başarıyla eklendi!',
      type: 'success',
    };

    // Reset form
    newProduct.value = {
      url: '',
      userEmail: '',
      userPhone: '',
      notificationPreference: 'email',
      priceDropThreshold: 5,
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
    });
    
    // Reload to see updated price
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
    });
    
    await loadProducts(pagination.value.page);
  } catch (error) {
    alert('Ürün silinirken bir hata oluştu.');
  }
}

function viewDetails(productId: string) {
  // Navigate to product details page (to be implemented)
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
  return new Date(date).toLocaleString('tr-TR');
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
