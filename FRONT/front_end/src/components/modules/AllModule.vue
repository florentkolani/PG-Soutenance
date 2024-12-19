<template>
  <aside id="default-sidebar" class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidenav">
    <div class="overflow-y-auto py-5 px-3 h-full border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <ul class="pt-4 mt-11 space-y-2 border-t border-gray-200 dark:border-gray-700">
        <li >
          <router-link to="/Utilisateurs" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
          </router-link>
        </li>
        <li>
          <router-link to="/Tickets" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
          </router-link>
        </li>
        <li >
          <router-link to="/produits" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
          </router-link>
        </li>
        <li >
          <router-link to="/TypeDeDemande" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray- 100 dark:text-white dark:hover:bg-gray-700">
          </router-link>
        </li>
        <li>
          <router-link to="/Archives" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
          </router-link>
        </li>
      </ul>
      <ul class="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700">
        <li>
          <router-link to="/PdfUploader" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
          </router-link>
        </li>
        <li>
          <router-link to="/about" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
          </router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'AllModule',
  data() {
    return {
      isSidebarOpen: false
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    }
  }
};
</script>

<style scoped>
/* Aucun style CSS personnalisé n'est nécessaire car tout est fait avec Tailwind */
</style>