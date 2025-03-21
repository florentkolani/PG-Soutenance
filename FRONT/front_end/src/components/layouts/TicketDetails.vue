<template>
  <div class="flex items-center justify-center bg-gray-100 h-screen">
    <div class="w-full max-w-7xl bg-white p-4 rounded-lg shadow-lg">
      <!-- Titre -->
      <h1 class="text-2xl font-bold mb-4 flex justify-center">Conversation</h1>

      <!-- Détails du ticket -->
      <div v-if="ticket" class="bg-white p-4 rounded shadow mb-6">
        <div class="flex flex-wrap justify-between">
          <p><strong>Client:</strong> {{ ticket.userId?.name || 'Inconnu' }}</p>
          <p><strong>Type de Demande:</strong> {{ ticket.typeDeDemandeId?.name || 'Inconnu' }}</p>
          <p><strong>Produit:</strong> {{ ticket.productId?.name || 'Inconnu' }}</p>
          <p><strong>Urgence:</strong> {{ ticket.urgence || 'Inconnu' }}</p>
        </div>
      </div>

      <!-- Section des messages -->
<div 
  v-if="messages.length" 
  class="bg-green-50 p-4 rounded shadow mb-6 overflow-y-auto"
  style="max-height: calc(100vh - 250px);" 
>
  <h2 class="text-lg font-semibold mb-4">Messages</h2>

  <div v-for="(message, index) in messages" :key="message._id">
    <div v-if="isNewDate(messages, index)" class="text-center my-2 text-sm font-semibold text-gray-500">
      {{ formatDate(message.createdAt) }}
    </div>

    <div 
      :class="[ 
        'mb-2 p-4 rounded max-w-xl break-words', 
        message.userId?._id === currentUserId ? 'bg-blue-100 ml-auto' : 'bg-green-100 mr-auto'
      ]"
    >
      <p><strong>{{ message.userId?.name || 'Inconnu' }}</strong></p>
      <p>{{ message.content }}</p>
      

      <!-- Lien de téléchargement du fichier joint pour le message de description -->
<div v-if="message.isDescription && ticket.file" class="mt-2">
  <a 
    :href="`/uploads/${ticket.file}`" 
    :download="ticket.file" 
    class="text-blue-500 hover:underline"
    @click.prevent="downloadFile"
  >
    Télécharger le fichier
  </a>
  <p v-if="fileDownloadError" class="text-red-500">{{ fileDownloadError }}</p>
</div>

<!-- Ajout de l'input pour le fichier -->
<div v-if="message.file" class="mt-2">
  <a 
  :href="`${API_URL}/uploads/${message.file}`" 
    class="text-blue-500 hover:underline flex items-center"
    @click.prevent="downloadMessageFile(message.file)"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
    Télécharger le fichier
  </a>
</div>

    <div class="flex items-center justify-end">
      <!-- Bouton Répondre -->
      <button 
        v-if="message.userId?._id !== currentUserId" 
        @click="toggleReply(message._id)" 
        class="text-black-500 text-sm mt-2 px-3 py-1 rounded-lg bg-blue-500 transition duration-200"
      >
        Répondre
      </button>
    </div>
    <p class="text-xs text-gray-500 text-right mt-3">{{ formatDateWithTime(message.createdAt) }}</p>
      

    </div>
  </div>

</div>

      <div v-else>
        Aucun message pour ce ticket.
      </div>

    </div>

    <!-- Popup de réponse -->
    <div v-if="replyingToMessageId" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Répondre au message</h3>
          <button 
            @click="replyingToMessageId = null" 
            class="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="sendMessage" class="space-y-4">
          <textarea
            v-model="newMessage"
            placeholder="Envoyez un Message"
            class="w-full p-3 rounded-xl bg-white text-black placeholder-gray-400 border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none transition duration-200"
            rows="4"
            ref="textarea"
            @input="adjustTextareaHeight"
          ></textarea>

          <div class="flex justify-between items-center ">
             <!-- Ajout de l'input pour le fichier -->
          <div class="flex items-center space-x-2 p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200">
            <input
              type="file"
              ref="fileInput"
              @change="handleFileChange"
              accept="image/*,.pdf,.doc,.docx"
              class="hidden"
            />
            <button
              type="button"
              @click="$refs.fileInput.click()"
              class="px-4 py-3 rounded-lg bg-gray-300 transition duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              Joindre un fichier
            </button>
            <span v-if="selectedFile" class="text-sm text-gray-600">
              {{ selectedFile.name }}
              <button
                type="button"
                @click="removeFile"
                class="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          </div>

          <div class="flex justify-end space-x-8">
            <div class="flex items-center space-x-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200 p-3">
              <button
              type="button"
              @click="replyingToMessageId = null"
              class="px-4 py-4 rounded-lg bg-gray-300 transition duration-200 p-3"
            >
              Annuler
            </button>
            </div>
            
            <button
              type="submit"
              class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-200 p-3"
              :disabled="isSending || (!newMessage && !selectedFile)"
            >
              Envoyer
            </button>
          </div>
          </div>

         
        </form>
      </div>
    </div>

  </div>
</template>


<script>
import axios from 'axios';
import { API_URL } from '@/services/config';

export default {
  props: ['ticketId'],
  data() {
    return {
      ticket: null,
      messages: [],
      newMessage: '',
      isAdminOrAgent: false,
      currentUserId: null,
      ticketCreatorId: null,
      isSending: false,
      maxTextareaHeight: 120,  
      fileDownloadError: null,
      replyingToMessageId: null, // ID of the message being replied to
      selectedFile: null,
      API_URL: import.meta.env.VITE_API_URL,
    };
  },
  mounted() {
    this.fetchTicket();
    this.isAdminOrAgent = localStorage.getItem('role') === 'Admin' || localStorage.getItem('role') === 'AgentSupport';

    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentUserId = payload.id;  // Utiliser l'ID de l'utilisateur connecté
    }
  },
  methods: {

    adjustTextareaHeight() {
      const textarea = this.$refs.textarea;
      textarea.style.height = "auto"; // Réinitialise la hauteur pour recalculer
      const newHeight = Math.min(textarea.scrollHeight, this.maxTextareaHeight); // Limite à 3 lignes
      textarea.style.height = `${newHeight}px`; // Définit la nouvelle hauteur
    },
    formatDateWithTime(date) {
    const messageDate = new Date(date);
    const today = new Date();

    // Vérification pour "Aujourd'hui"
    const isToday = messageDate.toDateString() === today.toDateString();

    // Vérification pour "Hier"
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const isYesterday = messageDate.toDateString() === yesterday.toDateString();

    // Formater la date en fonction des cas
    const formattedDate = isToday
        ? "Aujourd'hui"
        : isYesterday
        ? "Hier"
        : messageDate.toLocaleDateString('fr-FR', {
            weekday: 'long', // Affiche le jour de la semaine (ex. : lundi)
            day: 'numeric',  // Affiche le jour du mois (ex. : 20)
            month: 'long',   // Nom complet du mois (ex. : décembre)
            year: 'numeric'  // Année (ex. : 2024)
          });

    // Formater l'heure
    const formattedTime = messageDate.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Retourner le résultat final
    return `${formattedDate} · ${formattedTime}`;
}
,
fetchTicket() {
  const token = localStorage.getItem('token');
  axios.get(`${API_URL}/tickets/${this.ticketId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(response => {
    this.ticket = response.data;
    this.ticketCreatorId = this.ticket.userId._id;

    // Vérification si la description existe et l'ajouter comme message
    if (this.ticket.description) {
      // Ajouter la description comme premier message du bon côté
      const message = {
        _id: `desc-${this.ticketId}`, // ID temporaire unique pour la description
        content: this.ticket.description,
        isDescription: true,
        createdAt: this.ticket.createdAt,
        userId: {
          _id: this.ticket.userId._id,
          name: this.ticket.userId.name || 'Inconnu'
        }
      };
      // Ajouter ce message au début de la liste des messages
      this.messages.unshift(message);
    }

    // Récupérer les messages existants du ticket
    this.fetchMessages();
  })
  .catch(error => {
    console.error("Erreur lors de la récupération du ticket :", error);
  });
}
,

    fetchMessages() {
      const token = localStorage.getItem('token');
      axios.get(`${API_URL}/tickets/${this.ticketId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        this.messages.push(...response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des messages :", error);
      });
    },

    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
      }
    },

    removeFile() {
      this.selectedFile = null;
      this.$refs.fileInput.value = '';
    },

    async sendMessage() {
      if (!this.newMessage.trim() && !this.selectedFile) return;

      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      if (this.newMessage.trim()) {
        formData.append('content', this.newMessage.trim());
      }
      
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      this.isSending = true;

      try {
        const response = await axios.post(
          `${API_URL}/tickets/${this.ticketId}/messages`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        this.messages.push(response.data);
        this.newMessage = '';
        this.selectedFile = null;
        this.$refs.fileInput.value = '';
        this.replyingToMessageId = null;
      } catch (error) {
        console.error("Erreur lors de l'envoi du message :", error);
      } finally {
        this.isSending = false;
      }
    },

    async downloadMessageFile(filename) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/uploads/${filename}`, {
          responseType: 'blob',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status === 200) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url); // Clean up the URL object
        } else {
          throw new Error('File not found');
        }
      } catch (error) {
        this.fileDownloadError = 'Impossible de télécharger le fichier.';
        console.error(error);
      }
    },

    updateTicketStatus(ticketId, statusData) {
        const token = localStorage.getItem('token');
        console.log('Mise à jour du statut pour le ticket ID:', ticketId, 'avec les données:', statusData);
        return axios.put(`${API_URL}/tickets/${ticketId}/statut`, statusData, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
            console.log('Réponse du serveur pour la mise à jour du statut:', response.data);
            return response;
        })
        .catch(error => {
            console.error('Erreur lors de la mise à jour du statut du ticket:', error);
        });
    },
    isNewDate(messages, index) {
      if (index === 0) return true;
      const currentDate = new Date(messages[index].createdAt).toDateString();
      const previousDate = new Date(messages[index - 1].createdAt).toDateString();
      return currentDate !== previousDate;
    },

    formatDate(date) {
      const messageDate = new Date(date);
      const today = new Date();
      if (messageDate.toDateString() === today.toDateString()) {
        return "Aujourd'hui";
      }
      return messageDate.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    },

    formatTime(date) {
      return new Date(date).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    // Gestion de l'affichage en temps réel des nouveaux messages
    socketOnNewMessage(message) {
      if (message.ticketId === this.ticketId) {
        // Ajouter le nouveau message à la liste des messages
        this.messages.push(message);
      }
    },
    handleFileDownloadError() {
      this.fileDownloadError = "Erreur lors du téléchargement du fichier.";
    },
    async downloadFile() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/uploads/${this.ticket.file}`, {
                responseType: 'blob',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 200) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', this.ticket.file);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url); // Clean up the URL object
            } else {
                throw new Error('File not found');
            }
        } catch (error) {
            this.fileDownloadError = 'Impossible de télécharger le fichier.';
            console.error(error);
        }
    },
    toggleReply(messageId) {
      // Allow replying to the description message as well
      if (messageId === null) return; // Prevent toggling for invalid IDs
      this.replyingToMessageId = this.replyingToMessageId === messageId ? null : messageId;
    },
  }
};
</script>

<style scoped>
.overflow-y-auto {
  max-height: 300px;
  overflow-y: auto;
}
</style>