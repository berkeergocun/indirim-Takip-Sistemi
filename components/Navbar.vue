<template>
  <nav class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2 group">
          <span class="text-2xl">🛍️</span>
          <span class="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
            Price Tracker
          </span>
        </NuxtLink>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-6">
          <NuxtLink
            v-if="isAuthenticated"
            to="/"
            class="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
          >
            Ürünlerim
          </NuxtLink>
          
          <ThemeToggle />

          <div v-if="isAuthenticated" class="relative">
            <button
              @click="showMenu = !showMenu"
              class="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <div class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                {{ user?.name?.charAt(0).toUpperCase() }}
              </div>
              <span class="font-medium">{{ user?.name }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="showMenu"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2"
            >
              <NuxtLink
                to="/profile"
                class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors"
                @click="showMenu = false"
              >
                👤 Profilim
              </NuxtLink>
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                🚪 Çıkış Yap
              </button>
            </div>
          </div>

          <div v-else class="flex items-center space-x-3">
            <NuxtLink
              to="/login"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
            >
              Giriş Yap
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all font-medium shadow-lg"
            >
              Kayıt Ol
            </NuxtLink>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="showMobileMenu = !showMobileMenu"
          class="md:hidden p-2 text-gray-700 dark:text-gray-300"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="!showMobileMenu"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div
        v-if="showMobileMenu"
        class="md:hidden py-4 border-t border-gray-200 dark:border-gray-700"
      >
        <div class="flex flex-col space-y-3">
          <NuxtLink
            v-if="isAuthenticated"
            to="/"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            @click="showMobileMenu = false"
          >
            Ürünlerim
          </NuxtLink>
          
          <div class="px-4 py-2 flex items-center justify-between">
            <span class="text-gray-700 dark:text-gray-300">Tema</span>
            <ThemeToggle />
          </div>

          <div v-if="isAuthenticated">
            <NuxtLink
              to="/profile"
              class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              @click="showMobileMenu = false"
            >
              👤 Profilim
            </NuxtLink>
            <button
              @click="handleLogout"
              class="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-2"
            >
              🚪 Çıkış Yap
            </button>
          </div>

          <div v-else class="flex flex-col space-y-2 px-4">
            <NuxtLink
              to="/login"
              class="px-4 py-2 text-center text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
              @click="showMobileMenu = false"
            >
              Giriş Yap
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="px-4 py-2 text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg transition-all font-medium"
              @click="showMobileMenu = false"
            >
              Kayıt Ol
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { user, isAuthenticated, logout } = useAuth();
const showMenu = ref(false);
const showMobileMenu = ref(false);

const handleLogout = () => {
  showMenu.value = false;
  showMobileMenu.value = false;
  logout();
};

// Close menu on click outside
if (process.client) {
  onMounted(() => {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.relative')) {
        showMenu.value = false;
      }
    });
  });
}
</script>
