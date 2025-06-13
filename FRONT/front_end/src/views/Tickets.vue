<template>
  <div class="bg-gray-100 min-h-screen">
    <Header title="NOVA LEAD" primaryActionText="Nouveau ticket" @primaryAction="showTicketModal = true"
      @filterChanged="onFilterChanged" @goToDashboard="redirectToDashboard" :filterAction="true"
      :filterOptions="ticketFilterOptions" />

    <main class="w-full px-4 py-3">
      <!-- Titre et légende -->
      <div class="flex flex-row items-center justify-between space-x-4 mb-4">
        <h1 class="text-2xl font-bold">Liste des tickets</h1>

        <!-- Tableau des légendes -->
        <div class="overflow-x-auto border-gray-500 bg-slate-200 rounded-lg">
          <table class="table-auto border-collapse border border-gray-300 w-500 ml-auto">
            <tbody>
              <tr>
                <!-- Légende Urgence -->
                <td class="px-4 py-2 text-sm text-gray-900 border border-gray-300">
                  <div class="flex items-center space-x-2">
                    <span class="font-bold">PRIORITE :</span>
                    <span class="inline-block w-4 h-4 bg-red-800 rounded-full"></span>
                    <span>Urgent</span>
                    <span class="inline-block w-4 h-4 bg-green-500 rounded-full"></span>
                    <span>Pas urgent</span>
                  </div>
                </td>

                <!-- Légende Statut -->
                <td class="px-4 py-2 text-sm text-gray-900 border border-gray-300">
                  <div class="flex items-center space-x-2">
                    <span class="font-bold">STATUT :</span>
                    <span class="inline-block w-4 h-4 bg-yellow-400 rounded-full"></span>
                    <span>En attente</span>
                    <span class="inline-block w-4 h-4 bg-blue-400 rounded-full"></span>
                    <span>Ouvert</span>
                    <span class="inline-block w-4 h-4 bg-orange-500 rounded-full"></span>
                    <span>En cours</span>
                    <span class="inline-block w-4 h-4 bg-green-500 rounded-full"></span>
                    <span>Clôturé</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="overflow-x-auto relative">
        <table class="min-w-full bg-white">
          <thead>
            <tr>
              <th class="py-2 pl-4 text-left">Client</th>
              <th class="py-2 pl-4 text-left">Type de demande</th>
              <th class="py-2 pl-4 text-left">Produit</th>
              <th class="py-2 text-center">Urgence</th>
              <th class="py-2 text-center">Statut</th>
              <th class="py-2 text-center">Date de création</th>
              <th class="py-2 text-center">Durée</th>
              <th class="py-2 text-center">Note</th>
              <th class="py-2 text-center">Actions</th>
            </tr>
          </thead>


          <tbody>
            <tr v-for="ticket in filteredTickets" :key="ticket._id">
              <td class="border px-4 py-2 ">{{ ticket.userId?.name || 'Inconnu' }}</td>
              <td class="border px-4 py-2 ">{{ ticket.typeDeDemandeId?.name || 'Inconnu' }}</td>
              <td class="border px-4 py-2 ">{{ ticket.productId?.name || 'Inconnu' }}</td>
              <td class="border px-4 py-2 text-center">
                <span v-if="ticket.urgence === 'urgent'" class="inline-block w-4 h-4 bg-red-800 rounded-full"></span>
                <span v-else class="inline-block w-4 h-4 bg-green-500 rounded-full"></span>
              </td>
              <td class="border px-4 py-2 text-center">
                <span v-if="ticket.statut === 'ouvert'" class="inline-block w-4 h-4 bg-blue-400 rounded-full"></span>
                <span v-else-if="ticket.statut === 'en cours'"
                  class="inline-block w-4 h-4 bg-orange-500 rounded-full"></span>
                <span v-else-if="ticket.statut === 'en attente'"
                  class="inline-block w-4 h-4 bg-yellow-400 rounded-full"></span>
                <span v-else class="inline-block w-4 h-4 bg-green-500 rounded-full"></span>
              </td>
              <td class="border px-4 py-2 text-center">
                {{ new Date(ticket.createdAt).toLocaleString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) }}
              </td>
              <td class="border px-4 py-2 text-center">
                <span :class="{
                  'text-green-600': ticket.statut === 'cloturé',
                  'text-blue-600': ticket.statut !== 'cloturé'
                }">
                  {{ getResolutionTime(ticket) }}
                </span>
              </td>
              <td class="border px-4 py-2 text-center">
                <div class="flex justify-center space-x-1">
                  <template v-for="index in 4" :key="index">
                    <svg xmlns="http://www.w3.org/2000/svg" :class="{
                      'text-gray-300': index > getStarCount(ticket.note),
                      'text-yellow-400': index <= getStarCount(ticket.note)
                    }" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M12 .587l3.668 7.568 8.332 1.151-6.083 5.911 1.437 8.324L12 18.897l-7.354 4.644 1.437-8.324-6.083-5.911 8.332-1.151z" />
                    </svg>
                  </template>
                </div>
              </td>


              <td class="border px-4 py-2 text-center">
                <fwb-dropdown placement="left">
                  <template #trigger>
                    <fwb-button color="light">
                      <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                        <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                      </svg>
                    </fwb-button>
                  </template>
                  <nav class="py-2 text-sm text-gray-700 dark:text-gray-200 bg-gray-100">
                    <button @click="openTicketDetails(ticket)"
                      class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 max-w-md text-left">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12H9m0 0H4.55M9 12h5l2.5 8.5M9 12H4.55M9 12v3m-1.6 5h7.2M9 9l-2.5 8.5M15 12l2.5 8.5M15 12l-2.5-8.5" />
                      </svg>
                      Messages
                    </button>

                    <button v-if="userRole === 'Client' && ticket.statut === 'en attente'"
                      @click="openTicketModal(ticket)"
                      class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 11V4m-7 7h14m-7 7v-3m-2-5h7m-3 0h4" />
                      </svg>
                      Modifier
                    </button>

                    <button v-if="userRole === 'Client' && ticket.statut !== 'cloturé'"
                      @click="openRatingModal(ticket)"
                      class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M5 12h14m0 0l-3 3m3-3l-3-3" />
                      </svg>
                      Clôturer
                    </button>
                  </nav>
                </fwb-dropdown>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- Modals -->
    <TicketModal :showModal="showTicketModal" :isEdit="isEdit" :ticket="selectedTicket" :products="products"
      :typesDeDemande="typesDeDemande" @close="closeTicketModal" @create-ticket="createTicket"
      @update-ticket="updateTicket" />

    <RatingModal :showModal="showRatingModal" :ticketId="selectedTicketId" @close="closeRatingModal"
      @submit-rating="submitRating" />
   
  </div>
   <!-- Pagination -->
    <Pagination :total-items="totalItems" :items-per-page="itemsPerPage" @page-changed="goToPage" />

</template>

<script>
import TicketModal from '@/components/layouts/TicketModal.vue';
import RatingModal from '@/components/layouts/RatingModal.vue';
import Pagination from '@/components/layouts/Pagination.vue';
import Header from '@/components/layouts/Header.vue';
import GoToDashboard from '@/components/layouts/GoToDashboard.vue';
import { FwbDropdown, FwbButton } from 'flowbite-vue';
import axios from 'axios';
import { API_URL } from '@/services/config';

export default {
  components: {
    TicketModal,
    RatingModal,
    Pagination,
    Header,
    GoToDashboard,
    FwbDropdown,
    FwbButton
  },
  data() {
    return {
      showAlertModal: false,
      alertMessage: '',
      showTicketModal: false,
      showRatingModal: false,
      isEdit: false,
      tickets: [],
      notes: [],
      selectedStatus: '',
      ticketFilterOptions: [
        { value: 'en attente', label: 'En attente' },
        { value: 'ouvert', label: 'Ouvert' },
        { value: 'en cours', label: 'En cours' },
        { value: 'cloturé', label: 'Clôturé' },
      ],
      products: [],
      typesDeDemande: [],
      selectedTicket: null,
      selectedTicketId: null,
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 1,
      userRole: null,
    };
  },
  computed: {
    filteredTickets() {
      let tickets = this.selectedStatus === ''
        ? [...this.tickets]
        : this.tickets.filter(ticket => ticket.statut === this.selectedStatus);

      return tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
  },

  mounted() {
    this.fetchUserRole();
    this.fetchTickets();
    this.fetchProducts();
    this.fetchTypesDeDemande();
    document.addEventListener('click', this.closeDropdownOnClickOutside);
    //this.interval = setInterval(() => {this.fetchTickets(); }, 1000);

  },

  beforeDestroy() {
    document.removeEventListener('click', this.closeDropdownOnClickOutside);
  },

  methods: {
    getStarCount(notes) {
      switch (notes) {
        case 'Médiocre':
          return 1;
        case 'Passable':
          return 2;
        case 'Satisfait':
          return 3;
        case 'Très Satisfait':
          return 4;
        default:
          return 0;
      }
    },

    redirectToDashboard() {
      this.$router.push('/dashboard'); 
    },

    fetchTickets() {
      const token = localStorage.getItem('token');

      // Récupérer les tickets et les notes en parallèle
      Promise.all([
        axios.get(`${API_URL}/tickets?page=${this.currentPage}&limit=${this.itemsPerPage}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/ratings`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])
        .then(([ticketsResponse, ratingsResponse]) => {
          // Vérifier les données des tickets
          if (ticketsResponse.data && Array.isArray(ticketsResponse.data.tickets)) {
            this.tickets = ticketsResponse.data.tickets;
            this.totalItems = ticketsResponse.data.total;
            this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

            // Vérifier les données des notes
            const notes = ratingsResponse.data;
            console.log('Tickets récupérés:', this.tickets);
            console.log('Notes récupérées:', notes);

            // Associer les notes aux tickets
            this.tickets = this.tickets.map(ticket => {
              const note = notes.find(note => note.ticketId === ticket._id); // Associer la note correspondante
              return {
                ...ticket,
                note: note ? note.note : null, 
              };
            });
          } else {
            console.error('Réponse invalide pour les tickets:', ticketsResponse.data);
          }
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des tickets ou des notes:', error);
        });
    },

    onFilterChanged(statut) {
      this.selectedStatus = statut;
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
        .get(`${API_URL}/products`, {
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
        .get(`${API_URL}/types`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
          this.typesDeDemande = response.data.typesDeDemande;
        })
        .catch(error => console.error('Erreur lors de la récupération des types de demande:', error));
    },

    openTicketDetails(ticket) {
      if (this.userRole === 'Admin' || this.userRole === 'AgentSupport') {
        if (ticket.statut === 'en attente') {
          ticket.statut = 'ouvert';
          this.updateTicketStatus(ticket._id, { statut: 'ouvert' });
        }
      }
      this.$router.push({ name: 'TicketDetails', params: { ticketId: ticket._id } });
    },
    updateTicketStatus(ticketId, statusData) {
      const token = localStorage.getItem('token');
      axios.put(`${API_URL}/tickets/${ticketId}/statut`, statusData, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => {
          this.fetchTickets();
        })
        .catch(error => console.error('Erreur lors de la mise à jour du statut du ticket:', error));
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
    checkTicketLimit() {
      const inProgressTickets = this.tickets.filter(ticket => ticket.statut === 'en cours');
      return inProgressTickets.length >= 3;
    },
    createTicket(ticketData) {
      if (this.checkTicketLimit()) {
        this.alertMessage = "Vous avez déjà trois tickets en cours. Veuillez clôturer certains tickets avant d'en créer de nouveaux.";
        this.showAlertModal = true;
        return;
      }
      const token = localStorage.getItem('token');
      axios
        .post(`${API_URL}/tickets`, ticketData, {
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
      const formData = new FormData();

      // Ajoutez tous les champs nécessaires à formData
      formData.append('productId', ticketData.productId._id);
      formData.append('typeDeDemandeId', ticketData.typeDeDemandeId._id);
      formData.append('userId', ticketData.userId._id);
      formData.append('urgence', ticketData.urgence);
      formData.append('description', ticketData.description);
      formData.append('status', ticketData.status);

      // Si un fichier est joint, ajoutez-le à formData
      if (ticketData.file) {
        formData.append('file', ticketData.file);
      }

      axios
        .put(`${API_URL}/tickets/${ticketData._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
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
        .get(`${API_URL}/ratings/ticket/${this.selectedTicketId}`, {
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
      axios.post(`${API_URL}/ratings`, ratingData, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => {
          const ticketId = response.data.ticketId;
          return this.closeTicket(ticketId);
        })
        .then(response => {
          if (response && response._id) {
            // Mise à jour du ticket avec le statut "cloturé"
            const ticketId = response._id;
            const updatedTicket = { ...response, statut: 'cloturé' };

            // Mettre à jour l'état local avec le ticket mis à jour
            this.updateTicketInState(ticketId, updatedTicket);
            this.closeRatingModal();
            this.fetchTickets();
          } else {
            throw new Error('Invalid response data');
          }
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
      return axios.put(`${API_URL}/tickets/${ticketId}/close`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => {
          if (!response || !response.data) {
            throw new Error('Aucune donnée de réponse');
          }
          console.log('Ticket fermé avec succès:', response.data);
          return response.data; // Return the actual data
        })
        .catch(error => {
          console.error('Erreur lors de la fermeture du ticket:', error);
        });
    },
    goToPage(page) {
      this.currentPage = page;
      this.fetchTickets();
    },
    getResolutionTime(ticket) {
      if (!ticket) return null;

      if (ticket.statut !== 'cloturé') {
        return 'En cours';
      }

      // Vérifier si closedAt existe
      if (!ticket.closedAt) {
        return 'Date non disponible';
      }

      // On récupère la date de création du ticket
      const createdAt = new Date(ticket.createdAt);
      // On récupère la date de clôture
      const closedAt = new Date(ticket.closedAt);

      // Calcul de la différence en millisecondes
      const diffTime = closedAt.getTime() - createdAt.getTime();

      // Conversion en jours, heures, minutes
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

      // Construction de la chaîne de temps
      let resolution = [];
      if (diffDays > 0) resolution.push(`${diffDays}j`);
      if (diffHours > 0) resolution.push(`${diffHours}h`);
      if (diffMinutes > 0) resolution.push(`${diffMinutes}min`);

      // Si le temps est inférieur à une minute
      if (resolution.length === 0) {
        return 'Moins d\'une minute';
      }

      return resolution.join(' ');
    },
  },
};
</script>

<style scoped>
/* Ajoutez des styles ici si nécessaire */
</style>
