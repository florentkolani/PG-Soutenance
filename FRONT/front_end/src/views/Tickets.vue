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
              <span v-if="ticket.urgence === 'urgent'" class="inline-block w-4 h-4 bg-red-800 rounded-full"></span>
              <span v-else class="inline-block w-4 h-4 bg-green-500 rounded-full"></span>
            </td>
            <td class="border px-4 py-2 text-center">
              <span v-if="ticket.statut === 'ouvert'" class="inline-block w-4 h-4 bg-red-800 rounded-full"></span>
              <span v-else-if="ticket.statut === 'en cours'" class="inline-block w-4 h-4 bg-orange-300 rounded-full"></span>
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

    <!-- Modal for alerting the user -->
   <div v-if="showAlertModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-15">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <p class="text-lg text-center text-gray-800">{{ alertMessage }}</p>
        <div class="mt-4 flex justify-center">
          <button
            class="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
            @click="closeAlertModal"
          >
            Ok
          </button>
        </div>
      </div>
    </div>

     <!-- Dropdown menu avec les boutons d'actions -->
  <div v-if="dropdownOpen === ticket._id" class="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded shadow-lg">
    <!-- Affichage du bouton "Message" pour tous les rôles -->
    <button @click="openTicketDetails(ticket)" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m0 0H4.55M9 12h5l2.5 8.5M9 12H4.55M9 12v3m-1.6 5h7.2M9 9l-2.5 8.5M15 12l2.5 8.5M15 12l-2.5-8.5" />
      </svg>
      Message
    </button>

    <!-- Affichage des boutons "Modifier" et "Noter" uniquement pour les Clients -->
    <button v-if="userRole === 'Client'" @click="openTicketModal(ticket)" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11V4m-7 7h14m-7 7v-3m-2-5h7m-3 0h4" />
      </svg>
      Modifier
    </button>
    <button v-if="userRole === 'Client'" @click="openRatingModal(ticket)" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
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
  :products="products"
  :typesDeDemande="typesDeDemande"
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
      showAlertModal: false,
      alertMessage: '',
      showTicketModal: false,
      showRatingModal: false,
      isEdit: false,
      tickets: [],
      products: [],
      typesDeDemande: [],
      selectedTicket: null,
      dropdownOpen: null,
      selectedTicketId: null,
      currentPage: 1, 
      itemsPerPage: 10, 
      totalItems: 0, 
      totalPages: 1,
      userRole: null,
    };
  },
  mounted() {
    this.fetchUserRole();
    this.fetchTickets();
    this.fetchProducts();
    this.fetchTypesDeDemande();
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

    fetchUserRole() {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Décoder le JWT
        this.userRole = decodedToken.role; // Stocker le rôle dans le data
      }
    },

    fetchProducts() {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        this.products = response.data.products;
      })
      .catch(error => console.error('Erreur lors de la récupération des produits:', error));
  },
  fetchTypesDeDemande() {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5000/api/types', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        this.typesDeDemande = response.data.typesDeDemande;
      })
      .catch(error => console.error('Erreur lors de la récupération des types de demande:', error));
  },

    toggleDropdown(id) {
      this.dropdownOpen = this.dropdownOpen === id ? null : id;
    },
    closeDropdownOnClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.dropdownOpen = null;
      }
    },
    // openTicketDetails(ticket) {
    //   this.$router.push({ name: 'TicketDetails', params: { ticketId: ticket._id } });
    // },

    openTicketDetails(ticket) {
    if (this.userRole === 'Admin' || this.userRole === 'AgentSupport') {
        if (ticket.statut === 'ouvert') {
            this.updateTicketStatus(ticket._id, { statut: 'en cours' })
                .then(() => {
                    // Une fois le statut mis à jour, redirigez vers les détails du ticket
                    this.$router.push({ name: 'TicketDetails', params: { ticketId: ticket._id } });
                })
                .catch(error => {
                    console.error('Erreur lors de la mise à jour du statut du ticket:', error);
                });
        } else {
            // Si le ticket n'est pas "ouvert", redirigez simplement vers les détails
            this.$router.push({ name: 'TicketDetails', params: { ticketId: ticket._id } });
        }
    } else {
        // Si l'utilisateur n'est pas admin ou agent de support, redirigez directement
        this.$router.push({ name: 'TicketDetails', params: { ticketId: ticket._id } });
    }
},
updateTicketStatus(ticketId, statusData) {
    const token = localStorage.getItem('token');
    return axios.put(`http://localhost:5000/api/tickets/${ticketId}/statut`, statusData, {
        headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => {
        console.log('Statut du ticket mis à jour avec succès:', response.data);
        return response;
    })
    .catch(error => {
        console.error('Erreur lors de la mise à jour du statut du ticket:', error);
    });
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
          this.closeTicketModal();
          this.fetchTickets();
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
          this.closeTicketModal();
          this.fetchTickets();
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
            this.alertMessage = "Vous avez déjà noté ce ticket.";
            this.showAlertModal = true;
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
    closeAlertModal() {
      this.showAlertModal = false;
    },
    closeRatingModal() {
      this.showRatingModal = false;
      this.selectedTicketId = null;
    },
    // Affichage conditionnel des actions selon le rôle
    canEdit(ticket) {
      return this.userRole === 'client'; // Seul un client peut modifier ou noter un ticket
    },

    canMessage() {
      return this.userRole === 'client' || this.userRole === 'admin' || this.userRole === 'agentSupport';
    },
    submitRating(ratingData) {
    const token = localStorage.getItem('token');
    axios.post('http://localhost:5000/api/ratings', ratingData, {
        headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => {
        const ticketId = response.data.ticketId;
        return this.closeTicket(ticketId);
    })
    .then(response => {
        // Mise à jour du ticket avec le statut "cloturé"
        const ticketId = response.data._id;
        const updatedTicket = { ...response.data, statut: 'cloturé' };
        
        // Mettre à jour l'état local avec le ticket mis à jour
        this.updateTicketInState(ticketId, updatedTicket);
        this.closeRatingModal();
        this.fetchTickets();
    })
    .catch(error => {
        console.error('Erreur lors de la soumission de la note ou de la clôture du ticket:', error);
    });
},

updateTicketInState(ticketId, updatedTicket) {
    const index = this.tickets.findIndex(ticket => ticket._id === ticketId);
    
    if (index !== -1) {
        // Mise à jour du ticket à cet index dans le tableau
        this.tickets[index] = updatedTicket;
    }
},

closeTicket(ticketId) {
    const token = localStorage.getItem('token');
    return axios.put(`http://localhost:5000/api/tickets/${ticketId}/close`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => {
        if (!response || !response.data) {
            throw new Error('Aucune donnée de réponse');
        }
        console.log('Ticket fermé avec succès:', response.data);
        return response;
    })
    .catch(error => {
        console.error('Erreur lors de la fermeture du ticket:', error);
    });
}, 
    goToPage(page) {
      this.currentPage = page;
      this.fetchTickets(); 
    },
  },
};
</script>
