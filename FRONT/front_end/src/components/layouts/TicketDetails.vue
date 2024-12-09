<template>
  <div class="bg-gray-100 min-h-screen p-4">
    <h1 class="text-2xl font-bold mb-4 flex justify-center">Conversation</h1>

    <!-- Détails du ticket -->
    <div v-if="ticket" class="bg-white p-4 rounded shadow mb-6 flex flex-wrap space-x-40">
      <div class="flex items-center">
        <p><strong>Client:</strong> {{ ticket.userId?.name || 'Inconnu' }}</p>
      </div>
      <div class="flex items-center">
        <p><strong>Type de Demande:</strong> {{ ticket.typeDeDemandeId?.name || 'Inconnu' }}</p>
      </div>
      <div class="flex items-center">
        <p><strong>Produit:</strong> {{ ticket.productId?.name || 'Inconnu' }}</p>
      </div>
      <div class="flex items-center">
        <p><strong>Urgence:</strong> {{ ticket.urgence || 'Inconnu' }}</p>
      </div>
    </div>

    <div v-if="messages.length" class="bg-green-50 p-4 rounded shadow mb-6 overflow-y-auto" style="max-height: 300px;">
      <h2 class="text-lg font-semibold mb-4">Messages</h2>

      <div v-for="(message, index) in messages" :key="message._id">

        <div v-if="isNewDate(messages, index)" class="text-center my-2 text-sm font-semibold text-gray-500">
          {{ formatDate(message.createdAt) }}
        </div>

        <!-- Affichage des messages en alternance gauche-droite, en fonction de l'utilisateur -->
        <div 
          :class="[
            'mb-2', 
            'p-4', 
            'rounded', 
            'max-w-xl', 
            'break-words',
            message.userId?._id === currentUserId ? 'bg-blue-100 ml-auto' : 'bg-green-100 mr-auto'
          ]"
        >
          <p><strong>{{ message.userId?.name || 'Inconnu' }}</strong></p>
          <p>{{ message.content }}</p>
          <p class="text-xs text-gray-500 text-right">{{ formatDateWithTime(message.createdAt) }}</p>
        </div>
      </div>
    </div>

    <div v-else>
      Aucun message pour ce ticket.
    </div>

    <!-- Zone de saisie pour envoyer un message -->
    <div class="bg-white p-4 rounded-lg shadow-lg">
      <form @submit.prevent="sendMessage" class="flex justify-between items-center space-x-4">
  <textarea
    v-model="newMessage"
    placeholder="Écrivez un message..."
    class="w-full p-3 h-12 resize-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
    :disabled="isSending" 
  ></textarea>
  <button
    type="submit"
    class="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
    :disabled="isSending" 
  >
    {{ isSending ? "Envoi..." : "Envoyer" }} <!-- Changement de texte -->
  </button>
</form>

    </div>
  </div>
</template>

<script>
import axios from 'axios';

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
      isSending: false 
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
    formatDateWithTime(date) {
      const messageDate = new Date(date);
      const today = new Date();
      const isToday = messageDate.toDateString() === today.toDateString();
      const formattedDate = isToday
        ? "Aujourd'hui"
        : messageDate.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });
      const formattedTime = messageDate.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
      return `${formattedDate} · ${formattedTime}`;
    },

    fetchTicket() {
  const token = localStorage.getItem('token');
  axios.get(`http://localhost:5000/api/tickets/${this.ticketId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(response => {
    this.ticket = response.data;
    this.ticketCreatorId = this.ticket.userId._id;

    // Vérification si la description existe et l'ajouter comme message
    if (this.ticket.description) {
      // Ajouter la description comme premier message du bon côté
      const message = {
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
      axios.get(`http://localhost:5000/api/tickets/${this.ticketId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        this.messages.push(...response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des messages :", error);
      });
    },

    sendMessage() {
  if (!this.newMessage.trim()) return;

  const token = localStorage.getItem('token');
  const messageContent = this.newMessage;
  const tempMessageId = `temp-${Date.now()}`;

  const tempMessage = {
    _id: tempMessageId,
    content: messageContent,
    createdAt: new Date().toISOString(),
    userId: { _id: this.currentUserId, name: 'Vous' },
  };

  this.messages.push(tempMessage);
  this.newMessage = '';
  this.isSending = true; // Début de l'état de chargement

  axios.post(
    `http://localhost:5000/api/tickets/${this.ticketId}/messages`,
    { content: messageContent },
    { headers: { Authorization: `Bearer ${token}` } }
  )
    .then(response => {
      const index = this.messages.findIndex(msg => msg._id === tempMessageId);
      if (index !== -1) {
        this.messages.splice(index, 1, response.data);
      }
      this.isSending = false; // Fin de l'état de chargement
    })
    .catch(error => {
      console.error("Erreur lors de l'envoi du message :", error);
      const index = this.messages.findIndex(msg => msg._id === tempMessageId);
      if (index !== -1) {
        this.messages.splice(index, 1);
      }
      this.isSending = false; // Fin de l'état de chargement
    });
},

updateTicketStatus(ticketId, statusData) {
    const token = localStorage.getItem('token');
    console.log('Mise à jour du statut pour le ticket ID:', ticketId, 'avec les données:', statusData);
    return axios.put(`http://localhost:5000/api/tickets/${ticketId}/statut`, statusData, {
        headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => {
        console.log('Réponse du serveur pour la mise à jour du statut:', response.data);
        return response;
    })
    .catch(error => {
        console.error('Erreur lors de la mise à jour du statut du ticket:', error);
    });
}

,

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
    }
  }
};
</script>

<style scoped>
/* Appliquer une hauteur maximale à la section des messages pour le défilement */
.overflow-y-auto {
  max-height: 300px;
  overflow-y: auto;
}
</style>
