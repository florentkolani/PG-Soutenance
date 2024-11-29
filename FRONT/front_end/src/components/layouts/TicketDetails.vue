<template>
  <div class="bg-gray-100 min-h-screen p-4">
    <h1 class="text-2xl font-bold mb-4 flex justify-center">Conversation</h1>

    
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

    <div v-else>
      Chargement des détails du ticket...
    </div>

 
<div v-if="messages.length" class="bg-green-50 p-4 rounded shadow mb-6 overflow-y-auto" style="max-height: 300px;">
  <h2 class="text-lg font-semibold mb-4">Messages</h2>

  <div v-for="(message, index) in messages" :key="message._id">

    <div v-if="isNewDate(messages, index)" class="text-center my-2 text-sm font-semibold text-gray-500">
      {{ formatDate(message.createdAt) }}
    </div>

    <!-- Affichage des messages en alternance gauche-droite -->
    <div :class="[
        'mb-2', 
        'p-4', 
        'rounded', 
        'max-w-xl',  
        'break-words', 
        { 'bg-blue-100': index % 2 === 0, 'bg-green-100': index % 2 !== 0 },
        index % 2 === 0 ? 'mr-auto' : 'ml-auto'
      ]">
      <p>{{ index === 0 && message.isDescription ? message.content : `${message.userId?.name || 'Inconnu'}: ${message.content}` }}</p>
      <p class="text-xs text-gray-500">{{ formatTime(message.createdAt) }}</p>
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
    ></textarea>
    <button
      type="submit"
      class="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
    >
      Envoyer
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
      isAdminOrAgent: false
    };
  },
  mounted() {
    this.fetchTicket();
    this.isAdminOrAgent = localStorage.getItem('role') === 'Admin' || localStorage.getItem('role') === 'AgentSupport';
  },
  methods: {
    fetchTicket() {
      const token = localStorage.getItem('token');
      axios.get(`http://localhost:5000/api/tickets/${this.ticketId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        this.ticket = response.data;
        // Ajouter la description du ticket en tant que premier message
        if (this.ticket.description) {
          this.messages.push({
            content: this.ticket.description,
            isDescription: true,
            createdAt: this.ticket.createdAt
          });
        }
        
        this.fetchMessages();
      })
      .catch(error => {
        console.error("Erreur lors de la récupération du ticket :", error);
      });
    },
    fetchMessages() {
      const token = localStorage.getItem('token');
      axios.get(`http://localhost:5000/api/tickets/${this.ticketId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        // Ajouter les messages du serveur à ceux existants
        this.messages.push(...response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des messages :", error);
      });
    },
    sendMessage() {
      if (!this.newMessage.trim()) return; // Éviter l'envoi de messages vides
      const token = localStorage.getItem('token');
      axios.post(`http://localhost:5000/api/tickets/${this.ticketId}/messages`, {
        content: this.newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        this.messages.push(response.data);
        this.newMessage = ''; 
      })
      .catch(error => {
        console.error("Erreur lors de l'envoi du message :", error);
      });
    },
     // Vérifier si la date est différente du message précédent
     isNewDate(messages, index) {
      if (index === 0) return true;  // Afficher la date pour le premier message
      const currentDate = new Date(messages[index].createdAt).toDateString();
      const previousDate = new Date(messages[index - 1].createdAt).toDateString();
      return currentDate !== previousDate;
    },
      // Formater la date (aujourd'hui ou formatée jour/mois/année)
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
    //permet d'afficher la date d'envoi des messages
    formatTime(date) {
  return new Date(date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
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
