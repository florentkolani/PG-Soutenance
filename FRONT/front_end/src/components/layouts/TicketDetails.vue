<template>
    <div class="bg-gray-100 min-h-screen p-4">
      <h1 class="text-2xl font-bold mb-4">Détails du Ticket</h1>
  
      <div v-if="ticket" class="bg-white p-4 rounded shadow mb-6">
        <p><strong>Client:</strong> {{ ticket.userId?.name || 'Inconnu' }}</p>
        <p><strong>Type de Demande:</strong> {{ ticket.typeDeDemandeId?.name || 'Inconnu' }}</p>
        <p><strong>Produit:</strong> {{ ticket.productId?.name || 'Inconnu' }}</p>
        <p><strong>Urgence:</strong> {{ ticket.urgence || 'Inconnu' }}</p>
        <p><strong>Statut:</strong> {{ ticket.statut }}</p>
        <p><strong>Date de Création:</strong> {{ new Date(ticket.createdAt).toLocaleDateString() }}</p>
      </div>
  
      <div v-else>
        Chargement des détails du ticket...
      </div>
  
      <div v-if="messages.length" class="bg-white p-4 rounded shadow mb-6">
        <h2 class="text-lg font-semibold mb-4">Messages</h2>
        <div v-for="message in messages" :key="message._id" class="mb-2 p-2 bg-gray-100 rounded">
          <p><strong>{{ message.sender.name || 'Inconnu' }}:</strong> {{ message.content }}</p>
          <p class="text-sm text-gray-500">{{ new Date(message.createdAt).toLocaleString() }}</p>
        </div>
      </div>
      <div v-else>
        Aucun message pour ce ticket.
      </div>
  
      <div class="bg-white p-4 rounded shadow">
        <form @submit.prevent="sendMessage">
          <textarea v-model="newMessage" placeholder="Écrivez un message..." class="w-full p-2 border rounded mb-4"></textarea>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Envoyer</button>
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
      };
    },
    mounted() {
      this.fetchTicket();
    },
    methods: {
      fetchTicket() {
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:5000/api/tickets/${this.ticketId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
          this.ticket = response.data;
          this.fetchMessages(); // Appeler fetchMessages après avoir chargé le ticket
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
          this.messages = response.data;
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des messages :", error);
        });
      },
      sendMessage() {
        if (!this.newMessage.trim()) return;  // Éviter l'envoi de messages vides
        const token = localStorage.getItem('token');
        axios.post(`http://localhost:5000/api/tickets/${this.ticketId}/messages`, {
          content: this.newMessage
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
          this.messages.push(response.data);  // Ajouter le nouveau message à la liste
          this.newMessage = '';  // Réinitialiser le champ de message
        })
        .catch(error => {
          console.error("Erreur lors de l'envoi du message :", error);
        });
      }
    }
  };
  </script>
  
  <style scoped>
  /* Ajouter du style si nécessaire */
  </style>
  