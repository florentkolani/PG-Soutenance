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
            <th class="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in tickets" :key="ticket._id">
            <td class="border px-4 py-2 text-center">{{ ticket.userId?.name || 'Inconnu' }}</td>
            <td class="border px-4 py-2 text-center">{{ ticket.typeDeDemandeId?.name || 'Inconnu' }}</td>
            <td class="border px-4 py-2 text-center">{{ ticket.productId?.name || 'Inconnu' }}</td>
            <td class="border px-4 py-2 text-center">
              <span v-if="ticket.urgence === 'urgent'" class="inline-block w-4 h-4 bg-red-500 rounded-full"></span>
              <span v-else class="inline-block w-4 h-4 bg-green-500 rounded-full"></span>
            </td>
            <td class="border px-4 py-2 text-center">
              <span v-if="ticket.statut === 'ouvert'" class="inline-block w-4 h-4 bg-red-500 rounded-full"></span>
              <span v-else-if="ticket.statut === 'en cours'" class="inline-block w-4 h-4 bg-yellow-500 rounded-full"></span>
              <span v-else class="inline-block w-4 h-4 bg-green-500 rounded-full"></span>
            </td>
            <td class="border px-4 py-2 text-center">{{ new Date(ticket.createdAt).toLocaleDateString() }}</td>
            <td class="border px-4 py-2 text-center">
  <div class="relative inline-block text-left">
    <!-- Bouton des trois points pour ouvrir le dropdown -->
    <button @click="toggleDropdown(ticket._id)" class="text-gray-700 hover:text-gray-500 focus:outline-none">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" stroke="none">
        <circle cx="5" cy="12" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="19" cy="12" r="1.5" />
      </svg>
    </button>

    <!-- Dropdown menu avec les boutons d'actions -->
    <div v-if="dropdownOpen === ticket._id" class="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded shadow-lg">
      <button @click="openTicketDetails(ticket)" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m0 0H4.55M9 12h5l2.5 8.5M9 12H4.55M9 12v3m-1.6 5h7.2M9 9l-2.5 8.5M15 12l2.5 8.5M15 12l-2.5-8.5" />
        </svg>
        Message
      </button>
      <button @click="openTicketModal(ticket)" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11V4m-7 7h14m-7 7v-3m-2-5h7m-3 0h4" />
        </svg>
        Modifier
      </button>
      <button @click="openRatingModal(ticket)" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m0 0l-3 3m3-3l-3-3" />
        </svg>
        Noter
     </button>
    </div>
  </div>
</td>
</tr>
</tbody>
</table>
 </main>

    <!-- Modals -->
    <TicketModal
      :showModal="showTicketModal"
      :isEdit="isEdit"
      :ticket="selectedTicket"
      @close="closeTicketModal"
      @create-ticket="createTicket"
      @update-ticket="updateTicket"
    />
    <RatingModal
  :showModal="showRatingModal"
  :ticketId="selectedTicketId"
  @close="closeRatingModal"
  @submit-rating="submitRating"
/>

 <!-- Pagination -->
 <Pagination
        :total-items="totalItems" 
        :items-per-page="itemsPerPage" 
        @page-changed="goToPage" 
      />
  </div>
  
</template>

<script>
import TicketModal from '@/components/layouts/TicketModal.vue';
import RatingModal from '@/components/layouts/RatingModal.vue';
import Pagination from '@/components/layouts/Pagination.vue'; 
import axios from 'axios';

export default {
  components: {
    TicketModal,
    RatingModal,
    Pagination,
  },
  data() {
    return {
      showTicketModal: false,
      showRatingModal: false,
      isEdit: false,
      tickets: [],
      products: [],
      selectedTicket: null,
      dropdownOpen: null,
      selectedTicketId: null,
      currentPage: 1, 
      itemsPerPage: 10, 
      totalItems: 0, 
      totalPages: 1,
    };
  },
  mounted() {
    this.fetchTickets();
    document.addEventListener('click', this.closeDropdownOnClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeDropdownOnClickOutside);
  },
  methods: {
    fetchTickets() {
      const token = localStorage.getItem('token');
      axios
        .get(`http://localhost:5000/api/tickets?page=${this.currentPage}&limit=${this.itemsPerPage}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
          if (response.data && Array.isArray(response.data.tickets)) {
            this.tickets = response.data.tickets; 
            this.totalItems = response.data.total; 
            this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
          } else {
            console.error('Réponse invalide pour les tickets:', response.data);
          }
        })
        .catch(error => console.error('Erreur lors de la récupération des tickets:', error));
    },
    toggleDropdown(id) {
      this.dropdownOpen = this.dropdownOpen === id ? null : id;
    },
    closeDropdownOnClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.dropdownOpen = null;
      }
    },
    openTicketDetails(ticket) {
      this.$router.push({ name: 'TicketDetails', params: { ticketId: ticket._id } });
    },
    openTicketModal(ticket = null) {
      this.selectedTicket = ticket ? { ...ticket } : {};
      this.isEdit = !!ticket;
      this.showTicketModal = true;
    },
    closeTicketModal() {
      this.showTicketModal = false;
      this.selectedTicket = null;
    },
    createTicket(ticketData) {
      const token = localStorage.getItem('token');
      axios
        .post('http://localhost:5000/api/tickets', ticketData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          this.closeTicketModal(); // Fermer le modal après création
          this.fetchTickets(); // Recharger les tickets
        })
        .catch(error => console.error('Erreur lors de la création du ticket:', error));
    },
    updateTicket(ticketData) {
      const token = localStorage.getItem('token');
      axios
        .put(`http://localhost:5000/api/tickets/${ticketData._id}`, ticketData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          this.closeTicketModal(); // Fermer le modal après mise à jour
          this.fetchTickets(); // Recharger les tickets
        })
        .catch(error => console.error('Erreur lors de la mise à jour du ticket:', error));
    },
    openRatingModal(ticket) {
      const token = localStorage.getItem('token');
      this.selectedTicketId = ticket._id;
      axios
        .get(`http://localhost:5000/api/ratings/ticket/${this.selectedTicketId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
          if (response.data) { 
            alert("Vous avez déjà noté ce ticket.");
          } else {
            this.showRatingModal = true; 
          }
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            this.showRatingModal = true;
          } else {
            console.error('Erreur lors de la vérification de la note:', error);
          }
        });
    },
    closeRatingModal() {
      this.showRatingModal = false;
      this.selectedTicketId = null;
    },
    submitRating(ratingData) {
      const token = localStorage.getItem('token');
      axios.post('http://localhost:5000/api/ratings', ratingData, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => {
          this.closeRatingModal();
        })
        .catch(error => {
          console.error('Erreur lors de la soumission de la note:', error);
        });
    },
    goToPage(page) {
      this.currentPage = page;
      this.fetchTickets(); 
    },
  },
};
</script>
