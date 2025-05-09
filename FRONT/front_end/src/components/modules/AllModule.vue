<template>
  <aside id="default-sidebar"
    class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
    aria-label="Sidenav">
    <div class="overflow-y-auto py-5 px-3 h-full border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <ul class="pt-4 mt-11 space-y-2 border-t border-gray-200 dark:border-gray-700">
        <li>
          <router-link to="/Utilisateurs"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            Utilisateurs
          </router-link>
        </li>
        <li>
          <router-link to="/Tickets"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            Tickets
          </router-link>
        </li>
        <li>
          <router-link to="/produits"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            Produits
          </router-link>
        </li>
        <li>
          <router-link to="/TypeDeDemande"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            Type de demandes
          </router-link>
        </li>
        <li>
          <router-link to="/GestionsPays"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            Pays
          </router-link>
        </li>
        <li>
          <router-link to="/SendEmail"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            Notifications
          </router-link>
        </li>
        <li>
          <router-link to="/Archives"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            Archives
          </router-link>
        </li>
        <li>
          <router-link to="/Tasks"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            Tâches
          </router-link>
        </li>
        <li>
          <router-link to="/PdfUploader"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            Documents
          </router-link>
        </li>
        <li>
          <router-link to="/Reporting"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            Reporting
          </router-link>
        </li>
        <li>
          <router-link to="/Apropos"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            À propos
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