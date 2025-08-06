<template>
  <header class="bg-white border-b shadow-sm">
    <div class="w-full px-2 sm:px-4 py-2 sm:py-3 flex justify-between items-center space-y-2 sm:space-y-0">
      <!-- Logo avec redirection vers le Dashboard -->
      <div class="flex items-center space-x-2 sm:space-x-3 cursor-pointer" @click="goToDashboard">
        <img :src="logo" alt="Logo" class="h-8 sm:h-10 w-8 sm:w-10 rounded-lg shadow-sm" />
        <span class="text-lg sm:text-xl font-bold text-gray-800">{{ title }}</span>
      </div>

      <div class="flex items-center space-x-4">
        <!-- Notification Bell -->
        <div class="relative flex items-center">
          <button @click="showNotifications = true" class="relative focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700 hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">{{ unreadCount }}</span>
          </button>
          <NotificationModal :visible="showNotifications" @close="showNotifications = false" @unread-count="unreadCount = $event" position="dropdown" />
        </div>
        <!-- Autres boutons -->
        <button v-if="primaryActionText" @click="$emit('primaryAction')"
          class="w-full sm:w-auto flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors duration-200 shadow-sm">
          <span class="text-sm sm:text-base max-sm:hidden">{{ primaryActionText }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 sm:h-5 w-4 sm:w-5 flex item-center justify-center"
            viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clip-rule="evenodd" />
          </svg>
        </button>
        <div v-if="filterAction && showFilter" class="relative w-full sm:w-auto">
          <select v-model="selectedStatus" @change="emitFilter"
            class="w-full sm:w-auto appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 sm:px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base">
            <option value="">Tous les statuts</option>
            <option v-for="option in filterOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import GoToDashboard from "@/components/layouts/GoToDashboard.vue";
import NotificationModal from "@/components/layouts/NotificationModal.vue";
import logo from "@/assets/logo.png";
import { io } from 'socket.io-client';
import axios from 'axios';
import { API_URL } from '@/services/config';

export default {
  name: "Header",
  components: {
    GoToDashboard,
    NotificationModal,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    primaryActionText: {
      type: String,
      default: null,
    },
    filterAction: {
      type: Boolean,
      default: true,
    },
    filterOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedStatus: '',
      logo,
      showNotifications: false,
      unreadCount: 0,
      socket: null,
    };
  },
  computed: {
    showFilter() {
      const excludedRoutes = ['VideoUploader', 'Utilisateurs', 'sendEmail', 'PdfUploader', 'Archives', 'Apropos', 'GestionsPays', 'GestionsVille', 'TypeDeDemande', 'Produits', 'Reporting'];
      return !excludedRoutes.includes(this.$route.name);
    },
  },
  methods: {
    async fetchUnreadCount() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/notifications/unread-count`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.unreadCount = res.data.unreadCount;
      } catch (e) {
        this.unreadCount = 0;
      }
    },
    emitFilter() {
      this.$emit('filterChanged', this.selectedStatus);
    },
    goToDashboard() {
      this.$router.push('/dashboard');
    },
  },
  mounted() {
    this.fetchUnreadCount();

    this.socket = io('http://localhost:5000');
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.socket.emit('register', payload._id);
    }

    this.socket.on('notification', (notification) => {
      this.fetchUnreadCount();
    });
  },
  beforeUnmount() {
    if (this.socket) this.socket.disconnect();
  }
};
</script>

<style scoped>
/* Styles personnalisés ici */
</style>
