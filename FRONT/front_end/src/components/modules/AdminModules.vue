<template>
<aside id="default-sidebar" class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidenav">
  <div class="overflow-y-auto py-5 px-3 h-full border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <ul class="pt-4 mt-11 space-y-2 border-t border-gray-200 dark:border-gray-700">
          <li>
              <router-link to="/Utilisateurs" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                  <svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-400 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 3a3 3 0 00-3 3v1a1 1 0 000 2v4a1 1 0 000 2v4h6v-4a1 1 0 100-2v-4a1 1 0 000-2V6a3 3 0 00-3-3z" clip-rule="evenodd"></path></svg>
                  <span class="ml-3">Utilisateurs</span>
              </router-link>
          </li>
          <li>
              <router-link to="/Tickets" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"><svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M4 2a1 1 0 00-1 1v2.528a3 3 0 010 5.944V14a1 1 0 001 1h12a1 1 0 001-1v-2.528a3 3 0 010-5.944V3a1 1 0 00-1-1H4zm1 5a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1zm10 0a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1z" clip-rule="evenodd"/></svg>
                  <span class="ml-3">Tickets</span>
              </router-link>
          </li>
          <li>
              <router-link to="/produits" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                  <svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-400 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path></svg>
                  <span class="ml-3">Produits</span>
              </router-link>
          </li>
          
          <li>
              <router-link to="/TypeDeDemande" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                  <svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-400 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6 8a2 2 0 114 0h1.5a1.5 1.5 0 110 3H9a2 2 0 010-4H6z"></path></svg>
                  <span class="ml-3">TypeDemande</span>
              </router-link>
          </li>
          <li>
                <router-link to="/Archives" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                    <!-- Icône d'archive -->
                    <svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-400 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6h14a1 1 0 011 1v9a1 1 0 01-1 1H3a1 1 0 01-1-1V7a1 1 0 011-1zM2 5a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"></path>
                    </svg>
                    <span class="ml-3">Archives</span>
                </router-link>
            </li>
      </ul>
      <ul class="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700">
          <li>
              <router-link to="/PdfUploader" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                  <svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-400 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path></svg>
                  <span class="ml-3">Docs</span>
              </router-link>
          </li>
          <li>
              <router-link to="/about" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                  <svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-400 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path></svg>
                  <span class="ml-3">À propos</span>
              </router-link>
          </li>
           

      </ul>
  </div>
</aside>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      // Etat de la sidebar (ouverte ou fermée)
      isSidebarOpen: false
    };
  },
  methods: {
    // Méthode pour basculer l'état de la sidebar
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    }
  }
};
</script>
