<template>
    <div>
      <transition 
        enter-active-class="transition-all duration-300 ease-out" 
        enter-from-class="opacity-0 scale-95" 
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-200 ease-in" 
        leave-from-class="opacity-100 scale-100" 
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="visible" :class="modalClass">
          <!-- Overlay pour modal plein écran -->
          <div 
            v-if="position !== 'dropdown'" 
            class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300" 
            @click="$emit('close')"
          ></div>
          
          <!-- Contenu du modal -->
          <div :class="contentClass">
            <!-- Bouton de fermeture -->
            <button 
              class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 z-10 group" 
              @click="$emit('close')" 
              aria-label="Fermer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
  
            <!-- En-tête -->
            <div class="flex items-center mb-6">
              <div class="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5v-8a1 1 0 00-1-1H9a1 1 0 00-1 1v8h5z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 mb-1">Notifications</h3>
                <p class="text-sm text-gray-500" v-if="notifications.length">{{ unreadCount }} non lue(s)</p>
              </div>
            </div>
  
            <!-- Liste des notifications -->
            <div class="max-h-96 overflow-y-auto custom-scrollbar">
              <div v-if="notifications.length" class="space-y-3">
                <div 
                  v-for="notif in notifications" 
                  :key="notif._id" 
                  :class="[
                    'p-4 rounded-xl border transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer',
                    notif.isRead 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-sm'
                  ]"
                >
                  <!-- Indicateur de non-lu -->
                  <div class="flex items-start space-x-3">
                    <div v-if="!notif.isRead" class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div v-else class="w-2 h-2 bg-transparent rounded-full mt-2 flex-shrink-0"></div>
                    
                    <div class="flex-1 min-w-0">
                      <!-- Message -->
                      <p :class="[
                        'text-sm leading-relaxed mb-2',
                        notif.isRead ? 'text-gray-600' : 'text-gray-800 font-medium'
                      ]">
                        {{ getCustomNotificationMessage(notif) }}
                      </p>
                      
                      <!-- Date -->
                      <p class="text-xs text-gray-400 mb-3">
                        {{ formatDate(notif.createdAt) }}
                      </p>
                      
                      <!-- Actions -->
                      <div class="flex items-center space-x-2">
                        <button 
                          v-if="!notif.isRead" 
                          @click="markAsRead(notif._id)" 
                          class="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium rounded-lg transition-colors duration-200"
                        >
                          Marquer comme lue
                        </button>
                        
                        <router-link 
                          v-if="notif.type === 'ticket'" 
                          :to="`/tickets/${notif.ticket}`"
                          class="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-xs font-medium rounded-lg transition-colors duration-200 no-underline"
                        >
                          Voir le ticket
                        </router-link>
                        
                        <router-link 
                          v-if="notif.type === 'task'" 
                          :to="`/tasks/${notif.task}`"
                          class="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-medium rounded-lg transition-colors duration-200 no-underline"
                        >
                          Voir la tâche
                        </router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- État vide -->
              <div v-else class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-4h-2m-5 4h2" />
                  </svg>
                </div>
                <h4 class="text-lg font-medium text-gray-600 mb-2">Aucune notification</h4>
                <p class="text-sm text-gray-400">Vous êtes à jour !</p>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { API_URL } from '@/services/config';
  import { getCustomNotificationMessage } from '@/services/notificationMessages';
  
  export default {
    name: 'NotificationModal',
    props: {
      visible: Boolean,
      position: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        notifications: []
      };
    },
    computed: {
      unreadCount() {
        return this.notifications.filter(n => !n.isRead).length;
      },
      modalClass() {
        return this.position === 'dropdown' 
          ? 'absolute top-12 right-2 z-50' 
          : 'fixed inset-0 z-50 flex items-center justify-center p-4';
      },
      contentClass() {
        return this.position === 'dropdown'
          ? 'w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-h-[80vh] overflow-hidden backdrop-blur-xl'
          : 'w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-h-[80vh] overflow-hidden relative z-50';
      }
    },
    methods: {
      async fetchNotifications() {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`${API_URL}/notifications/me?unread=true`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.notifications = res.data;
          this.$emit('unread-count', this.unreadCount);
        } catch (e) {
          this.notifications = [];
          this.$emit('unread-count', 0);
        }
      },
      async markAsRead(id) {
        try {
          const token = localStorage.getItem('token');
          await axios.patch(`${API_URL}/notifications/${id}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.fetchNotifications();
        } catch (e) {
          console.error('Erreur lors du marquage comme lu:', e);
        }
      },
      formatDate(date) {
        return new Date(date).toLocaleString('fr-FR', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      },
      getCustomNotificationMessage
    },
    watch: {
      visible(val) {
        if (val) this.fetchNotifications();
      }
    }
  };
  </script>
  
  <style scoped>
  /* Scrollbar personnalisée */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  
  /* Animations supplémentaires */
  @keyframes slideInFromTop {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .custom-scrollbar > div > div {
    animation: slideInFromTop 0.3s ease-out forwards;
  }
  
  .custom-scrollbar > div > div:nth-child(2) {
    animation-delay: 0.1s;
  }
  
  .custom-scrollbar > div > div:nth-child(3) {
    animation-delay: 0.2s;
  }
  </style>