<template>
  <div class="flex items-center justify-center bg-gray-100 h-screen">
    <div class="w-full max-w-7xl bg-white p-4 rounded-lg shadow-lg">
      <!-- Titre de la page -->
      <h1 class="text-2xl font-bold mb-4 flex justify-center">Conversation</h1>

      <!-- Détails de la tâche -->
      <div v-if="task" class="bg-white p-4 rounded shadow mb-6">
        <div class="flex flex-wrap justify-between">
          <p><strong>Client:</strong> {{ task.userId?.name || 'Inconnu' }}</p>
          <p><strong>Type de Demande:</strong> {{ task.typeDeDemandeId?.name || 'Inconnu' }}</p>
          <p><strong>Produit:</strong> {{ task.productId?.name || 'Inconnu' }}</p>
          <p><strong>Statut:</strong> {{ task.statut || 'Inconnu' }}</p>
          <p><strong>Date de début:</strong> {{ formatDate(task.startday) }}</p>
          <p><strong>Date de fin:</strong> {{ formatDate(task.endday) }}</p>
        </div>
      </div>

      <!-- Section des messages -->
      <div v-if="messages.length" class="bg-green-50 p-4 rounded shadow mb-6 overflow-y-auto"
        style="max-height: calc(100vh - 250px);">
        <h2 class="text-lg font-semibold mb-4">Messages</h2>

        <!-- Liste des messages -->
        <div v-for="(message, index) in messages" :key="message._id">
          <!-- Affichage de la date si c'est un nouveau jour -->
          <div v-if="isNewDate(messages, index)" class="text-center my-2 text-sm font-semibold text-gray-500">
            {{ formatDate(message.createdAt) }}
          </div>

          <!-- Contenu du message -->
          <div :class="[
            'mb-2 p-4 rounded max-w-xl break-words',
            message.senderId?._id === currentUserId ? 'bg-blue-100 ml-auto' : 'bg-green-100 mr-auto'
          ]">
            <!-- Nom de l'expéditeur -->
            <p><strong>{{ message.senderName || 'Inconnu' }}</strong></p>
            <!-- Contenu du message -->
            <p>{{ message.content }}</p>

            <!-- Lien de téléchargement du fichier joint -->
            <div v-if="message.file" class="mt-2">
              <a :href="`/uploads/documents/${message.file}`" :download="message.file"
                class="text-blue-500 hover:underline flex items-center"
                @click.prevent="downloadMessageFile(message.file)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {{ message.isDescription ? 'Fichier joins à la création' : 'Télécharger le fichier' }}
              </a>
            </div>

            <!-- Bouton Répondre -->
            <div class="flex items-center justify-end">
              <button v-if="message.senderId?._id !== currentUserId" @click="toggleReply(message._id)"
                class="text-white text-sm mt-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition duration-200 flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span>Répondre</span>
              </button>
            </div>

            <!-- Date et heure du message -->
            <p class="text-xs text-gray-500 text-right mt-3">{{ formatDateWithTime(message.createdAt) }}</p>
          </div>
        </div>
      </div>

      <div v-else>
        Aucun message pour cette tâche.
      </div>

      <!-- Formulaire d'envoi de message -->
      <div v-if="replyingToMessageId"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Répondre au message</h3>
            <button @click="replyingToMessageId = null" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="sendMessage" class="space-y-4">
            <!-- Zone de texte pour le message -->
            <textarea v-model="newMessage" placeholder="Envoyez un Message"
              class="w-full p-3 rounded-xl bg-white text-black placeholder-gray-400 border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none transition duration-200"
              rows="4" ref="textarea" @input="adjustTextareaHeight"></textarea>

            <div class="flex justify-between items-center">
              <!-- Bouton pour joindre un fichier -->
              <div class="flex items-center space-x-2">
                <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*,.pdf,.doc,.docx"
                  class="hidden" />
                <button type="button" @click="$refs.fileInput.click()"
                  class="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition duration-200 flex items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  Joindre un fichier
                </button>
                <span v-if="selectedFile" class="text-sm text-gray-600">
                  {{ selectedFile.name }}
                  <button type="button" @click="removeFile" class="ml-2 text-red-500 hover:text-red-700">
                    ×
                  </button>
                </span>
              </div>

              <div class="flex space-x-3">
                <!-- Bouton Annuler -->
                <button type="button" @click="replyingToMessageId = null"
                  class="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition duration-200 text-gray-700">
                  Annuler
                </button>

                <!-- Bouton Envoyer -->
                <button type="submit"
                  class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-200 flex items-center justify-center min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="isSending || (!newMessage && !selectedFile)">
                  <template v-if="isSending">
                    <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                      viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                      </path>
                    </svg>
                    Envoi...
                  </template>
                  <span v-else>Envoyer</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_URL } from '@/services/config';

export default {
  // Props pour recevoir l'ID de la tâche
  props: {
    id: {
      type: String,
      required: true
    }
  },

  // Données du composant
  data() {
    return {
      task: null,           // Détails de la tâche
      messages: [],         // Liste des messages
      newMessage: '',       // Nouveau message en cours d'écriture
      isAdminOrAgent: false, // Statut de l'utilisateur
      currentUserId: null,  // ID de l'utilisateur connecté
      isSending: false,     // État d'envoi du message
      maxTextareaHeight: 120, // Hauteur maximale de la zone de texte
      fileDownloadError: null, // Erreur de téléchargement
      replyingToMessageId: null, // ID du message auquel on répond
      selectedFile: null,   // Fichier sélectionné
      API_URL: import.meta.env.VITE_API_URL, // URL de l'API
    };
  },

  // Hook appelé après le montage du composant
  mounted() {
    this.fetchTask();
    this.isAdminOrAgent = localStorage.getItem('role') === 'Admin' || localStorage.getItem('role') === 'AgentSupport';

    // Récupération de l'ID de l'utilisateur depuis le token
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentUserId = payload.id;
    }
  },

  methods: {
    // Ajuster la hauteur de la zone de texte
    adjustTextareaHeight() {
      const textarea = this.$refs.textarea;
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, this.maxTextareaHeight);
      textarea.style.height = `${newHeight}px`;
    },

    // Formater la date avec l'heure
    formatDateWithTime(date) {
      const messageDate = new Date(date);
      const today = new Date();

      const isToday = messageDate.toDateString() === today.toDateString();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const isYesterday = messageDate.toDateString() === yesterday.toDateString();

      const formattedDate = isToday
        ? "Aujourd'hui"
        : isYesterday
          ? "Hier"
          : messageDate.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });

      const formattedTime = messageDate.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });

      return `${formattedDate} · ${formattedTime}`;
    },

    // Récupérer les détails de la tâche
    fetchTask() {
      const token = localStorage.getItem('token');
      axios.get(`${API_URL}/tasks/${this.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          this.task = response.data;

          // Ajouter la description comme premier message si elle existe
          if (this.task.description) {
            const message = {
              _id: `desc-${this.id}`,
              content: this.task.description,
              isDescription: true,
              createdAt: this.task.createdAt,
              senderId: {
                _id: this.task.userId._id,
                name: this.task.userId.name || 'Inconnu'
              },
              senderName: this.task.userId.name || 'Inconnu',
              file: this.task.files && this.task.files.length > 0 ? this.task.files[0] : null
            };
            this.messages.unshift(message);
          }

          this.fetchMessages();
        })
        .catch(error => {
          console.error("Erreur lors de la récupération de la tâche :", error);
        });
    },

    // Récupérer les messages de la tâche
    fetchMessages() {
      const token = localStorage.getItem('token');
      axios.get(`${API_URL}/tasks/${this.id}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          // Formater les messages de manière défensive
          const formattedMessages = response.data
            .filter(message => message)
            .map(message => {
              // Gestion flexible de senderId
              const senderId = message.senderId && typeof message.senderId === 'object'
                ? message.senderId._id
                : (message.senderId || 'unknown');

              return {
                _id: message._id || `temp-${Date.now()}-${Math.random()}`,
                content: message.content || '',
                createdAt: message.createdAt || new Date(),
                senderId: typeof message.senderId === 'object'
                  ? message.senderId // Utiliser directement si c'est déjà un objet formaté
                  : { _id: senderId, name: message.senderName || 'Inconnu' },
                senderName: message.senderName || 'Inconnu',
                file: message.file || ''
              };
            });

          // Ajouter les messages
          if (this.messages && this.messages.length > 0) {
            this.messages = [...this.messages, ...formattedMessages];
          } else {
            this.messages = formattedMessages;
          }
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des messages :", error);
        });
    },

    // Gérer le changement de fichier
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
      }
    },

    // Supprimer le fichier sélectionné
    removeFile() {
      this.selectedFile = null;
      this.$refs.fileInput.value = '';
    },

    // Envoyer un nouveau message
    async sendMessage() {
      if (!this.newMessage.trim() && !this.selectedFile) return;

      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token.split('.')[1]));

      // Créer un FormData pour gérer le fichier
      const formData = new FormData();
      formData.append('content', this.newMessage.trim());
      formData.append('senderId', payload.id);

      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      this.isSending = true;

      try {
        const response = await axios.post(
          `${API_URL}/tasks/${this.id}/messages`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        // Ajouter le nouveau message à la liste
        const newMessage = {
          _id: response.data._id,
          content: response.data.content,
          createdAt: response.data.createdAt,
          senderId: {
            _id: response.data.senderId,
            name: response.data.senderName || 'Inconnu'
          },
          senderName: response.data.senderName || 'Inconnu',
          file: response.data.file
        };

        this.messages.push(newMessage);
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

    // Télécharger un fichier joint
    async downloadMessageFile(filename) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/uploads/documents/${filename}`, {
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
          window.URL.revokeObjectURL(url);
        } else {
          throw new Error('File not found');
        }
      } catch (error) {
        this.fileDownloadError = 'Impossible de télécharger le fichier.';
        console.error(error);
      }
    },

    // Vérifier si c'est un nouveau jour pour l'affichage de la date
    isNewDate(messages, index) {
      if (index === 0) return true;
      const currentDate = new Date(messages[index].createdAt).toDateString();
      const previousDate = new Date(messages[index - 1].createdAt).toDateString();
      return currentDate !== previousDate;
    },

    // Formater la date
    formatDate(date) {
      if (!date) return 'Non spécifié';
      return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    },

    // Basculer l'état de réponse à un message
    toggleReply(messageId) {
      if (messageId === null) return;
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
