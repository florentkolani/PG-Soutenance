<template>
  <div class="bg-gray-100 min-h-screen">
    <header class="bg-lime-500 p-4 shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <img src="@/assets/logo.png" alt="Logo" class="h-10" />
          <span class="text-white text-xl font-bold">NOVA Lead</span>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="showTicketModal = true" class="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition">
            New <span class="ml-1">+</span>
          </button>
          <button class="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition flex items-center">
            Filtrer
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <main class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Liste des Tickets</h1>
      <table class="min-w-full bg-white">
        <thead>
          <tr class="text-center">
            <th class="py-2">Client</th>
            <th class="py-2">Type de Demande</th>
            <th class="py-2">Produit</th>
            <th class="py-2">Urgence</th>
            <th class="py-2">Statut</th>
            <th class="py-2">Date de Création</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in tickets" :key="ticket._id" @click="openTicket(ticket)">
            <td class="border px-4 py-2 text-center">{{ ticket.userId?.name || 'Inconnu' }}</td>
            <td class="border px-4 py-2 text-center">{{ ticket.typeDeDemandeId?.name || 'Inconnu' }}</td>
            <td class="border px-4 py-2 text-center">{{ ticket.productId?.name || 'Inconnu' }}</td>
            <td class="border px-4 py-2 text-center">{{ ticket.urgence || 'Inconnu' }}</td>
            <td class="border px-4 py-2 text-center">
              <!-- Affichage des boutons de statut -->
              <span v-if="ticket.statut === 'ouvert'" class="inline-block w-4 h-4 bg-red-500 rounded-full"></span>
              <span v-if="ticket.statut === 'en cours'" class="inline-block w-4 h-4 bg-yellow-500 rounded-full"></span>
              <span v-if="ticket.statut === 'fermé'" class="inline-block w-4 h-4 bg-green-500 rounded-full"></span>
            </td>
            <td class="border px-4 py-2 text-center">{{ new Date(ticket.createdAt).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </main>

    <!-- Ticket Modal -->
    <TicketModal :showModal="showTicketModal" @close="showTicketModal = false" />
  </div>
</template>

<script>
import axios from 'axios';
import TicketModal from '@/components/layouts/TicketModal.vue';

export default {
  name: 'Tickets',
  components: {
    TicketModal,
  },
  data() {
    return {
      showTicketModal: false,
      tickets: []
    };
  },
  mounted() {
    // Récupérer les tickets à partir de l'API
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/tickets', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      this.tickets = response.data;
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des tickets :", error);
    });
  },
  methods: {
    openTicket(ticket) {
      // Ouvrir le ticket sélectionné (fonctionnalité à implémenter)
      this.$router.push({ name: 'TicketDetails', params: { ticketId: ticket._id } });
    }
  }
};
</script>

<style scoped>
/* Ajouter du style si nécessaire */
</style>
