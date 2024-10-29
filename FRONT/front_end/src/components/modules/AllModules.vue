<template>
    <div>
      <!-- Bouton pour ouvrir la sidebar sur mobile -->
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        class="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span class="sr-only">Open sidebar</span>
        <svg
          class="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>
  
      <aside
        id="default-sidebar"
        class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidenav"
      >
        <div class="overflow-y-auto py-5 px-3 h-full bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <ul class="space-y-2">
            <!-- Liens pour l'Admin -->
            <li v-if="isAdmin">
              <router-link
                to="/Utilisateurs"
                class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-6 h-6 text-gray-400 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill-rule="evenodd" d="M10 3a3 3 0 00-3 3v1a1 1 0 000 2v4a1 1 0 000 2v4h6v-4a1 1 0 100-2v-4a1 1 0 000-2V6a3 3 0 00-3-3z" clip-rule="evenodd"></path>
                </svg>
                <span class="ml-3">Utilisateurs</span>
              </router-link>
            </li>
            <li v-if="isAdmin">
              <router-link
                to="/Documents"
                class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-6 h-6 text-gray-400 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill-rule="evenodd" d="M10 3a3 3 0 00-3 3v1a1 1 0 000 2v4a1 1 0 000 2v4h6v-4a1 1 0 100-2v-4a1 1 0 000-2V6a3 3 0 00-3-3z" clip-rule="evenodd"></path>
                </svg>
                <span class="ml-3">Docs</span>
              </router-link>
            </li>
            <li v-if="isAdmin">
              <router-link
                to="/Propos"
                class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-6 h-6 text-gray-400 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill-rule="evenodd" d="M10 3a3 3 0 00-3 3v1a1 1 0 000 2v4a1 1 0 000 2v4h6v-4a1 1 0 100-2v-4a1 1 0 000-2V6a3 3 0 00-3-3z" clip-rule="evenodd"></path>
                </svg>
                <span class="ml-3">A Propos</span>
              </router-link>
            </li>
            <li v-if="isAdmin">
              <router-link
                to="/produits"
                class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-6 h-6 text-gray-400 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path>
                </svg>
                <span class="ml-3">Produits</span>
              </router-link>
            </li>
            <li v-if="isAdmin">
              <router-link
                to="/TypeDeDemande"
                class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-6 h-6 text-gray-400 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 8a2 2 0 114 0h1.5a1.5 1.5 0 110 3H9a2 2 0 010-4H6z"></path>
                </svg>
                <span class="ml-3">Type de Demande</span>
              </router-link>
            </li>
  
            <!-- Liens pour le Client -->
            <li v-if="isClient">
              <router-link
                to="/Tickets"
                class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-6 h-6 text-gray-400 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 4a6 6 0 00-6 6 6 6 0 006 6 6 6 0 006-6 6 6 0 00-6-6z"></path>
                </svg>
                <span class="ml-3">Tickets</span>
              </router-link>
            </li>
            <li v-if="isClient">
              <router-link
                to="/Formations"
                class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-6 h-6 text-gray-400 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 6a2 2 0 00-2 2v4a2 2 0 002 2h16a2 2 0 002-2v-4a2 2 0 00-2-2H2z"></path>
                </svg>
                <span class="ml-3">Formations</span>
              </router-link>
            </li>
            <li v-if="isClient">
              <router-link
                to="/Documents"
                class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-6 h-6 text-gray-400 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 6a2 2 0 00-2 2v4a2 2 0 002 2h16a2 2 0 002-2v-4a2 2 0 00-2-2H2z"></path>
                </svg>
                <span class="ml-3">Docs</span>
              </router-link>
            </li>
            <li v-if="isClient">
              <router-link
                to="/Propos"
                class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-6 h-6 text-gray-400 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 6a2 2 0 00-2 2v4a2 2 0 002 2h16a2 2 0 002-2v-4a2 2 0 00-2-2H2z"></path>
                </svg>
                <span class="ml-3">A Propos De Nous</span>
              </router-link>
            </li>
  
            <!-- Liens pour l'Agent Support -->
            <li v-if="isAgentSupport">
              <router-link
                to="/Tickets"
                class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-6 h-6 text-gray-400 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 4a1 1 0 100 2h14a1 1 0 100-2H3zm0 4a1 1 0 100 2h14a1 1 0 100-2H3zm0 4a1 1 0 100 2h14a1 1 0 100-2H3zm-2 4a1 1 0 011-1h14a1 1 0 011 1H1z"></path>
                </svg>
                <span class="ml-3">Tickets</span>
              </router-link>
            </li>
            <li v-if="isAgentSupport">
              <router-link
                to="/Formations"
                class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-6 h-6 text-gray-400 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 4a1 1 0 100 2h14a1 1 0 100-2H3zm0 4a1 1 0 100 2h14a1 1 0 100-2H3zm0 4a1 1 0 100 2h14a1 1 0 100-2H3zm-2 4a1 1 0 011-1h14a1 1 0 011 1H1z"></path>
                </svg>
                <span class="ml-3">Formations</span>
              </router-link>
            </li>
            <li v-if="isAgentSupport">
              <router-link
                to="/DOcuments"
                class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-6 h-6 text-gray-400 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 4a1 1 0 100 2h14a1 1 0 100-2H3zm0 4a1 1 0 100 2h14a1 1 0 100-2H3zm0 4a1 1 0 100 2h14a1 1 0 100-2H3zm-2 4a1 1 0 011-1h14a1 1 0 011 1H1z"></path>
                </svg>
                <span class="ml-3">Docs</span>
              </router-link>
            </li>
            <li v-if="isAgentSupport">
              <router-link
                to="/Propos"
                class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-6 h-6 text-gray-400 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 4a1 1 0 100 2h14a1 1 0 100-2H3zm0 4a1 1 0 100 2h14a1 1 0 100-2H3zm0 4a1 1 0 100 2h14a1 1 0 100-2H3zm-2 4a1 1 0 011-1h14a1 1 0 011 1H1z"></path>
                </svg>
                <span class="ml-3">A Propos de nous</span>
              </router-link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </template>
  
  <script>
  export default {
    computed: {
      isAdmin() {
        return this.$store.state.user.role === 'Admin';
      },
      isClient() {
        return this.$store.state.user.role === 'Client';
      },
      isAgentSupport() {
        return this.$store.state.user.role === 'AgentSupport';
      },
    },
  };
  </script>
  
  <style scoped>
  /* Styles additionnels peuvent être ajoutés ici si nécessaire */
  </style>
  