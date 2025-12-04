<template>
  <div>
    <Navbar />
    
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
          <div class="flex items-center gap-6">
            <div class="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl border-4 border-white/30 shadow-lg">
              👤
            </div>
            <div>
              <h1 class="text-4xl font-bold mb-2">Profilim</h1>
              <p class="text-purple-100">Hesap bilgilerinizi ve tercihlerinizi yönetin</p>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="p-8">
          <form @submit.prevent="updateProfile" class="space-y-6">
            <!-- Personal Information -->
            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>👤</span> Kişisel Bilgiler
              </h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    İsim *
                  </label>
                  <input
                    v-model="formData.name"
                    type="text"
                    required
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    E-posta *
                  </label>
                  <input
                    v-model="formData.email"
                    type="email"
                    required
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Telefon
                  </label>
                  <input
                    v-model="formData.phone"
                    type="tel"
                    placeholder="+90 5XX XXX XX XX"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <hr class="border-gray-300 dark:border-gray-600" />

            <!-- Preferences -->
            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>⚙️</span> Tercihler
              </h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Varsayılan Bildirim Tercihi
                  </label>
                  <select
                    v-model="formData.defaultNotificationPreference"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all"
                  >
                    <option value="email">📧 E-posta</option>
                    <option value="sms">📱 SMS</option>
                    <option value="both">📧📱 Her İkisi</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Varsayılan İndirim Eşiği (%)
                  </label>
                  <input
                    v-model.number="formData.defaultPriceDropThreshold"
                    type="number"
                    min="1"
                    max="100"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Tema Tercihi
                  </label>
                  <div class="flex gap-4">
                    <button
                      type="button"
                      @click="formData.theme = 'light'"
                      :class="[
                        'flex-1 px-4 py-3 rounded-lg border-2 font-semibold transition-all',
                        formData.theme === 'light'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      ]"
                    >
                      ☀️ Açık
                    </button>
                    <button
                      type="button"
                      @click="formData.theme = 'dark'"
                      :class="[
                        'flex-1 px-4 py-3 rounded-lg border-2 font-semibold transition-all',
                        formData.theme === 'dark'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      ]"
                    >
                      🌙 Koyu
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <hr class="border-gray-300 dark:border-gray-600" />

            <!-- Password Change -->
            <div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>🔒</span> Şifre Değiştir
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Şifrenizi değiştirmek istemiyorsanız bu alanları boş bırakabilirsiniz.
              </p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Yeni Şifre
                  </label>
                  <input
                    v-model="formData.newPassword"
                    type="password"
                    placeholder="Minimum 6 karakter"
                    minlength="6"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Yeni Şifre (Tekrar)
                  </label>
                  <input
                    v-model="formData.confirmPassword"
                    type="password"
                    placeholder="Minimum 6 karakter"
                    minlength="6"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex gap-4">
              <button
                type="submit"
                :disabled="isUpdating"
                class="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg transform hover:scale-[1.02]"
              >
                {{ isUpdating ? '⏳ Kaydediliyor...' : '💾 Değişiklikleri Kaydet' }}
              </button>
            </div>

            <!-- Message -->
            <div v-if="message" :class="['p-4 rounded-lg', message.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400']">
              {{ message.text }}
            </div>
          </form>

          <!-- Account Stats -->
          <div class="mt-8 pt-8 border-t border-gray-300 dark:border-gray-600">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>📊</span> Hesap İstatistikleri
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                <div class="text-4xl font-bold mb-2">{{ stats.totalProducts }}</div>
                <div class="text-purple-100">Toplam Ürün</div>
              </div>
              
              <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                <div class="text-4xl font-bold mb-2">{{ stats.activeProducts }}</div>
                <div class="text-blue-100">Aktif Takip</div>
              </div>
              
              <div class="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-xl shadow-lg">
                <div class="text-4xl font-bold mb-2">{{ stats.notifications }}</div>
                <div class="text-pink-100">Gönderilen Bildirim</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, token, updateUserData } = useAuth();
const { theme, setTheme } = useTheme();

const isUpdating = ref(false);
const message = ref<{ text: string; type: 'success' | 'error' } | null>(null);

const formData = ref({
  name: '',
  email: '',
  phone: '',
  defaultNotificationPreference: 'email' as 'email' | 'sms' | 'both',
  defaultPriceDropThreshold: 5,
  theme: 'light' as 'light' | 'dark',
  newPassword: '',
  confirmPassword: '',
});

const stats = ref({
  totalProducts: 0,
  activeProducts: 0,
  notifications: 0,
});

// Redirect if not authenticated
if (!token.value) {
  navigateTo('/login');
}

onMounted(async () => {
  if (user.value) {
    formData.value = {
      name: user.value.name || '',
      email: user.value.email || '',
      phone: user.value.phone || '',
      defaultNotificationPreference: user.value.defaultNotificationPreference || 'email',
      defaultPriceDropThreshold: user.value.defaultPriceDropThreshold || 5,
      theme: user.value.theme || 'light',
      newPassword: '',
      confirmPassword: '',
    };
  }

  await loadStats();
});

async function loadStats() {
  try {
    const response: any = await $fetch('/api/products/stats', {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    stats.value = response;
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

async function updateProfile() {
  message.value = null;

  // Validate password if changing
  if (formData.value.newPassword) {
    if (formData.value.newPassword !== formData.value.confirmPassword) {
      message.value = {
        text: 'Şifreler eşleşmiyor!',
        type: 'error',
      };
      return;
    }

    if (formData.value.newPassword.length < 6) {
      message.value = {
        text: 'Şifre en az 6 karakter olmalıdır!',
        type: 'error',
      };
      return;
    }
  }

  isUpdating.value = true;

  try {
    const updateData: any = {
      name: formData.value.name,
      email: formData.value.email,
      phone: formData.value.phone,
      defaultNotificationPreference: formData.value.defaultNotificationPreference,
      defaultPriceDropThreshold: formData.value.defaultPriceDropThreshold,
      theme: formData.value.theme,
    };

    if (formData.value.newPassword) {
      updateData.password = formData.value.newPassword;
    }

    const response: any = await $fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: updateData,
    });

    message.value = {
      text: 'Profil başarıyla güncellendi!',
      type: 'success',
    };

    // Update local user data
    updateUserData(response.user);

    // Update theme
    setTheme(formData.value.theme);

    // Clear password fields
    formData.value.newPassword = '';
    formData.value.confirmPassword = '';
  } catch (error: any) {
    message.value = {
      text: error.data?.message || 'Profil güncellenirken bir hata oluştu.',
      type: 'error',
    };
  } finally {
    isUpdating.value = false;
  }
}
</script>
