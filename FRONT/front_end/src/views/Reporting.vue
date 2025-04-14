<template>
  <div >
    <Header 
      title="NOVA LEAD" 
       @goToDashboard="redirectToDashboard"
    />
  </div>
  <div class="reporting-container p-6">
    <h1 class="text-3xl font-bold mb-8">Tableau de bord - Reporting</h1>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
      {{ error }}
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Cards Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <!-- Products Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-700">Produits</h3>
            <span class="text-2xl font-bold text-blue-600">{{ products?.length || 0 }}</span>
          </div>
          <p class="text-gray-500 mt-2">Total des produits</p>
        </div>

        <!-- Users Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-700">Utilisateurs</h3>
            <span class="text-2xl font-bold text-green-600">{{ users?.length || 0 }}</span>
          </div>
          <p class="text-gray-500 mt-2">Total des utilisateurs</p>
        </div>

        <!-- Tickets Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-700">Tickets</h3>
            <span class="text-2xl font-bold text-purple-600">{{ tickets?.length || 0 }}</span>
          </div>
          <p class="text-gray-500 mt-2">Total des tickets</p>
        </div>

        <!-- Types Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-700">Types de demande</h3>
            <span class="text-2xl font-bold text-orange-600">{{ types?.length || 0 }}</span>
          </div>
          <p class="text-gray-500 mt-2">Total des types</p>
        </div>

        <!-- Ratings Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-700">Notes</h3>
            <span class="text-2xl font-bold text-orange-600">{{ ratings?.length || 0 }}</span>
          </div>
          <p class="text-gray-500 mt-2">Total des notes</p>
        </div>
      </div>
      

      <!-- Filters Section -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">Filtres</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Data Type Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Type de données</label>
            <select v-model="tempSelectedDataType" class="w-full p-2 border rounded-md">
              <option value="">Tous</option>
              <option value="products">Produits</option>
              <option value="users">Utilisateurs</option>
              <option value="tickets">Tickets</option>
              <option value="types">Types de demande</option>
              <option value="ratings">Notes</option>
            </select>
          </div>
           <!-- Date Range Filter -->
           <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
            <input 
              v-model="tempStartDate" 
              type="date" 
              class="w-full p-2 border rounded-md"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
            <input 
              v-model="tempEndDate" 
              type="date" 
              class="w-full p-2 border rounded-md"
            >
          </div>

          <!-- Conditional Filters -->
          <!-- Ticket Filters -->
          <template v-if="tempSelectedDataType === 'tickets'">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select v-model="tempFilters.ticketStatus" class="w-full p-2 border rounded-md">
                <option value="">Tous les statuts</option>
                <option value="en attente">En attente</option>
                <option value="Ouvert">Ouvert</option>
                <option value="en cours">En cours</option>
                <option value="cloturé">Cloturé</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Produit</label>
              <select v-model="tempFilters.ticketProduct" class="w-full p-2 border rounded-md">
                <option value="">Tous les produits</option>
                <option v-for="product in products" :key="product._id" :value="product._id">
                  {{ product.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Utilisateur</label>
              <select v-model="tempFilters.ticketUser" class="w-full p-2 border rounded-md">
                <option value="">Tous les utilisateurs</option>
                <option v-for="user in users" :key="user._id" :value="user._id">
                  {{ user.name }}
                </option>
              </select>
            </div>
          </template>

          <!-- User Filters -->
          <template v-if="tempSelectedDataType === 'users'">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
              <select v-model="tempFilters.userRole" class="w-full p-2 border rounded-md">
                <option value="">Tous les rôles</option>
                <option value="Admin">Admin</option>
                <option value="Client">Client</option>
                <option value="AgentSupport">Agent Support</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Pays</label>
              <select v-model="tempFilters.userCountry" class="w-full p-2 border rounded-md">
                <option value="">Tous les pays</option>
                <option v-for="country in countries" :key="country._id" :value="country._id">
                  {{ country.name }}
                </option>
              </select>
            </div>
          </template>

          <!-- Rating Filters -->
          <template v-if="tempSelectedDataType === 'ratings'">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Niveau de satisfaction</label>
              <select v-model="tempFilters.ratingsLevel" class="w-full p-2 border rounded-md">
                <option value="">Tous les niveaux</option>
                <option value="Médiocre">Médiocre</option>
                <option value="Passable">Passable</option>
                <option value="Satisfait">Satisfait</option>
                <option value="Très Satisfait">Très Satisfait</option>
              </select>
            </div>
          </template>
        </div>

        <!-- Filter Buttons -->
        <div class="mt-4 flex justify-end space-x-4">
          <button 
            @click="resetFilters" 
            class="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
          >
            Réinitialiser
          </button>
          <button 
            @click="applyFilters" 
            class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Filtrer
          </button>
        </div>
      </div>

      <!-- Data Table Section -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Résultats</h2>
           <!-- Search Filter -->
           <div class="whitespace-nowrap ml-auto mr-5">
            <!-- <label class="block text-sm font-medium text-gray-700 mb-2">Recherche</label> -->
            <input 
              v-model="tempSearchQuery" 
              type="text" 
              class="w-full p-2 border rounded-md"
              :placeholder="'Rechercher dans ' + tempSelectedDataType"
            >
          </div>
          <button 
            @click="showExportModal = true" 
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            :disabled="!filteredData.length"
          >
            Exporter
          </button>
        </div>

        <div v-if="!filteredData.length" class="text-center py-8 text-gray-500">
          Aucun résultat trouvé
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-50">
                <th 
                  v-for="header in tableHeaders" 
                  :key="header.key"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ header.label }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in paginatedData" :key="item._id">
                <td 
                  v-for="header in tableHeaders" 
                  :key="header.key"
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {{ formatValue(getNestedValue(item, header.key)) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredData.length" class="mt-4 flex justify-between items-center">
          <div class="text-sm text-gray-700">
            Affichage de {{ paginatedData.length }} sur {{ filteredData.length }} résultats
          </div>
          <div class="flex space-x-2">
            <button 
              @click="currentPage--" 
              :disabled="currentPage === 1"
              class="px-3 py-1 border rounded-md"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
            >
              Précédent
            </button>
            <button 
              @click="currentPage++" 
              :disabled="currentPage >= totalPages"
              class="px-3 py-1 border rounded-md"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Export Modal -->
    <div v-if="showExportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg">
        <h3 class="text-lg font-semibold mb-4 text-center">Format d'export</h3>
        <div class="space-y-4">
          <div>
            <label class="inline-flex items-center">
              <input type="radio" v-model="exportFormat" value="excel" class="form-radio">
              <span class="ml-2">Excel</span>
            </label>
          </div>
          <div>
            <label class="inline-flex items-center">
              <input type="radio" v-model="exportFormat" value="pdf" class="form-radio">
              <span class="ml-2">PDF</span>
            </label>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-4">
          <button 
            @click="showExportModal = false" 
            class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Annuler
          </button>
          <button 
            @click="exportData" 
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Exporter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_URL } from '@/services/config';
import Header from '@/components/layouts/Header.vue';
import * as XLSX from 'xlsx';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import vfsFonts from "pdfmake/build/vfs_fonts";

export default {
  name: 'Reporting',
  data() {
    return {
      // Data arrays
      products: [],
      users: [],
      tickets: [],
      types: [],
      ratings: [],
      countries: [],

      // Filters
      selectedDataType: 'products',
      searchQuery: '',
      startDate: '',
      endDate: '',
      filters: {
        ticketStatus: '',
        ticketProduct: '',
        ticketUser: '',
        userRole: '',
        userCountry: '',
        ratingsLevel: ''
      },

      // Pagination
      currentPage: 1,
      itemsPerPage: 10,

      // Loading state
      loading: true,
      error: null,

      // Ajout des filtres temporaires
      tempFilters: {
        ticketStatus: '',
        ticketProduct: '',
        ticketUser: '',
        userRole: '',
        userCountry: '',
        ratingsLevel: ''
      },
      tempSearchQuery: '',
      tempStartDate: '',
      tempEndDate: '',
      tempSelectedDataType: 'products',
      
      // Ajout pour le modal d'export
      showExportModal: false,
      exportFormat: 'excel'
    };
  },
  components: {
    Header
  },
  computed: {
    tableHeaders() {
      const headers = {
        products: [
          { key: 'name', label: 'Nom' },
          { key: 'description', label: 'Description' }
        ],
        users: [
          { key: 'name', label: 'Nom' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Rôle' },
          { key: 'pays', label: 'Pays' },
          { key: 'contact', label: 'Contact' }
        ],
        tickets: [
          { key: 'NumeroTicket', label: 'NumeroTicket' },
          { key: 'userId.name', label: 'Utilisateur' },
          { key: 'typeDeDemandeId.name', label: 'Type de Demande' },
          { key: 'productId.name', label: 'Produit' },
          { key: 'statut', label: 'Statut' },
          { key: 'processingTime', label: 'Durée' }
        ],
        types: [
          { key: 'name', label: 'Nom' },
          { key: 'description', label: 'Description' }
        ],
        ratings: [
          { key: 'note', label: 'Note' },
          { key: 'commentaire', label: 'Commentaire' },
          { key: 'ticketId.NumeroTicket', label: 'Ticket' },
          { key: 'processingTime', label: 'Durée' },
          { key: 'ticketId.userId.name', label: 'Utilisateur' }
        ]
      };
      return headers[this.selectedDataType] || [];
    },
    filteredData() {
      if (!this.selectedDataType) return [];
      
      let data = this[this.selectedDataType] || [];
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        data = data.filter(item => {
          return Object.values(item).some(value => 
            String(value).toLowerCase().includes(query)
          );
        });
      }

      // Apply date filter if applicable
      if (this.startDate && this.endDate) {
        data = data.filter(item => {
          if (item.createdAt) {
            const itemDate = new Date(item.createdAt);
            
            // Créer les objets Date pour le début et la fin
            const start = new Date(this.startDate);
            start.setHours(0, 0, 0, 0); // Début de journée
            
            const end = new Date(this.endDate);
            end.setHours(23, 59, 59, 999); // Fin de journée
            
            return itemDate >= start && itemDate <= end;
          }
          return true;
        });
      }

      // Apply specific filters based on data type
      if (this.selectedDataType === 'tickets') {
        if (this.filters.ticketStatus) {
          data = data.filter(item => item.statut === this.filters.ticketStatus);
        }
        if (this.filters.ticketProduct) {
          data = data.filter(item => item.productId?._id === this.filters.ticketProduct);
        }
        if (this.filters.ticketUser) {
          data = data.filter(item => item.userId?._id === this.filters.ticketUser);
        }
      } else if (this.selectedDataType === 'users') {
        if (this.filters.userRole) {
          data = data.filter(item => item.role === this.filters.userRole);
        }
        if (this.filters.userCountry) {
          data = data.filter(item => item.paysId === this.filters.userCountry);
        }
      } else if (this.selectedDataType === 'ratings') {
        if (this.filters.ratingsLevel) {
          data = data.filter(item => {
            return item.note === this.filters.ratingsLevel;
          });
        }
      }

      return data;
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredData.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    }
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Non authentifié');
        }

        // Decode le token pour récupérer les informations de l'utilisateur
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('Decoded token payload:', payload);
          // Stocker le nom de l'utilisateur dans localStorage pour une utilisation ultérieure
          if (payload.name) {
            localStorage.setItem('userName', payload.name);
          }
        }

        const headers = {
          Authorization: `Bearer ${token}`
        };

        const [productsRes, usersRes, ticketsRes, typesRes, ratingsRes, countriesRes] = await Promise.all([
          axios.get(`${API_URL}/reporting/products`, { headers }),
          axios.get(`${API_URL}/reporting/users`, { headers }),
          axios.get(`${API_URL}/reporting/tickets`, { headers }),
          axios.get(`${API_URL}/reporting/Types`, { headers }),
          axios.get(`${API_URL}/reporting/ratings`, { headers }),
          axios.get(`${API_URL}/reporting/countries`, { headers })
        ]);

        console.log('Raw API Responses:');
        console.log('Products:', productsRes);
        console.log('Users:', usersRes);
        console.log('Tickets:', ticketsRes);
        console.log('Types:', typesRes);
        console.log('Ratings:', ratingsRes);
        console.log('Countries:', countriesRes);
        

        // Ajustement selon la structure de la réponse
        this.products = productsRes.data.products || [];
        this.users = usersRes.data.data || [];
        this.tickets = ticketsRes.data.tickets || [];
        this.types = typesRes.data.types || [];
        this.countries = countriesRes.data.countries || [];

        // Gestion plus flexible des données de ratings
        if (ratingsRes.data) {
          if (Array.isArray(ratingsRes.data)) {
            this.ratings = ratingsRes.data;
          } else if (ratingsRes.data.ratings) {
            this.ratings = ratingsRes.data.ratings;
          } else if (ratingsRes.data.data) {
            this.ratings = ratingsRes.data.data;
          } else {
            this.ratings = [];
          }
        } else {
          this.ratings = [];
        }

        console.log('Processed Data:');
        console.log('Products:', this.products);
        console.log('Users:', this.users);
        console.log('Tickets:', this.tickets);
        console.log('Types:', this.types);
        console.log('Ratings:', this.ratings);

        // Vérification des données
        if (!this.products.length && !this.users.length && !this.tickets.length && !this.types.length && !this.ratings.length) {
          this.error = 'Aucune donnée disponible';
        }
      } catch (error) {
        console.error('Error details:', error);
        if (error.response?.status === 401) {
          this.error = 'Session expirée. Veuillez vous reconnecter.';
          // Redirection vers la page de connexion
          this.$router.push('/login');
        } else {
          this.error = 'Erreur lors du chargement des données: ' + (error.response?.data?.message || error.message);
        }
      } finally {
        this.loading = false;
      }
    },
    formatValue(value) {
      if (value === null || value === undefined) return '-';
      if (typeof value === 'object') return JSON.stringify(value);
      return value;
    },
    calculateProcessingTime(item) {
      // Pour les tickets
      if (item.createdAt && item.closedAt) {
        const created = new Date(item.createdAt);
        const closed = new Date(item.closedAt);
        return this.calculateDuration(created, closed);
      }
      // Pour les tickets dans les ratings
      if (item.ticketId && item.ticketId.createdAt && item.ticketId.closedAt) {
        const created = new Date(item.ticketId.createdAt);
        const closed = new Date(item.ticketId.closedAt);
        return this.calculateDuration(created, closed);
      }

      // Si le ticket est ouvert mais pas clôturé
      if ((item.createdAt && !item.closedAt) || 
          (item.ticketId?.createdAt && !item.ticketId?.closedAt)) {
        return 'En cours';
      }

      return 'Non disponible';
    },
    calculateDuration(created, closed) {
      if (isNaN(created.getTime()) || isNaN(closed.getTime())) {
        return 'Date invalide';
      }

      const diffInMilliseconds = closed - created;
      
      // Si la différence est négative, le ticket est toujours en cours
      if (diffInMilliseconds < 0) {
        return 'En cours';
      }
      
      // Convertir en jours, heures, minutes
      const days = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
      
      let duration = '';
      if (days > 0) duration += `${days}j `;
      if (hours > 0) duration += `${hours}h `;
      if (minutes > 0) duration += `${minutes}m`;
      
      return duration.trim() || '< 1m';
    },
    getNestedValue(obj, path) {
      if (path === 'processingTime') {
        return this.calculateProcessingTime(obj);
      }
      // Pour les autres chemins
      return path.split('.').reduce((current, key) => {
        return current ? current[key] : null;
      }, obj);
    },
    exportData() {
      if (!this.filteredData.length) return;
      
      if (this.exportFormat === 'excel') {
        this.exportToExcel();
      } else if (this.exportFormat === 'pdf') {
        this.exportToPDF();
      }
      
      this.showExportModal = false;
    },
    async exportToExcel() {
  // Créer une copie des données filtrées pour ne pas modifier les originales
  const dataToExport = this.filteredData.map(item => {
    // Créer un nouvel objet sans les champs sensibles
    const cleanItem = { ...item };
    
    // Supprimer les champs sensibles
    delete cleanItem.password;
    delete cleanItem.__v;
    delete cleanItem._id;
    delete cleanItem.paysId;
    delete cleanItem.villeId;
    
    // Supprimer les champs imbriqués
    if (cleanItem.user) {
      delete cleanItem.user.password;
      delete cleanItem.user.id;
    }
    
    return cleanItem;
  });
  
  // Utilise les données nettoyées pour créer la feuille Excel
  const ws = XLSX.utils.json_to_sheet(dataToExport);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  XLSX.writeFile(wb, `${this.selectedDataType}_export.xlsx`);
},
    async exportToPDF() {
      try {
        const headers = this.tableHeaders.map(h => h.label);
        
        const calculateColumnWidths = () => {
          const pageWidth = 595.28;
          const margins = 40;
          const availableWidth = pageWidth - (margins * 2);
          const minColumnWidth = 50;
          
          // Calcul des largeurs proportionnelles
          const widths = headers.map((header, index) => {
            let maxLength = header.length;
            
            // Vérifie la longueur maximale du contenu dans chaque colonne
            this.filteredData.forEach(row => {
              const cellContent = this.formatValue(this.getNestedValue(row, this.tableHeaders[index].key));
              const contentLength = String(cellContent).length;
              maxLength = Math.max(maxLength, contentLength);
            });
            
            return maxLength;
          });

          // Calcule la somme totale des largeurs
          const totalWidth = widths.reduce((sum, width) => sum + width, 0);
          
          // Ajuste les largeurs proportionnellement à l'espace disponible
          return widths.map(width => {
            const proportion = width / totalWidth;
            const calculatedWidth = Math.max(
              minColumnWidth,
              Math.floor(availableWidth * proportion)
            );
            return calculatedWidth;
          });
        };

        const columnWidths = calculateColumnWidths();

        // Récupére le nom de l'utilisateur dans le token
        const userName = localStorage.getItem('userName') || 'Utilisateur';
        
        const docDefinition = {
          pageMargins: [20, 80, 20, 80],
          pageSize: 'A4',
          
          header: {
            margin: [40, 20, 40, 0],
            columns: [
              { 
                width: '*', 
                text: '' 
              },
            ]
          },
          footer: function(currentPage, pageCount) {
            return {
              margin: [40, 10, 40, 20],
              columns: [
                { 
                  text: `Édité par: ${userName}`,
                  alignment: 'left', 
                  color: '#6b7280',
                  fontSize: 8
                },
                { 
                  text: `Page ${currentPage} sur ${pageCount}`, 
                  alignment: 'right', 
                  color: '#6b7280',
                  fontSize: 8
                }
              ]
            };
          },
          content: [
            // En-tête avec info société et date
            {
              margin: [0, 0, 0, 20],
              columns: [
                {
                  width: '50%',
                  stack: [
                    { 
                      text: 'NOVA LEAD', 
                      style: 'companyName',
                      margin: [0, 0, 0, 8]
                    },
                    { 
                      text: 'Rue 186 AFG', 
                      style: 'companyInfo' 
                    },
                    { 
                      text: 'Lomé, Togo', 
                      style: 'companyInfo' 
                    },
                    { 
                      text: 'Tél: +228 90 32 79 21', 
                      style: 'companyInfo' 
                    },
                    { 
                      text: 'Email: novalead@gmail.dev', 
                      style: 'companyInfo' 
                    }
                  ]
                },
                {
                  width: '50%',
                  stack: [
                    { 
                      text: `Date d'édition: ${new Date().toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}`, 
                      alignment: 'right', 
                      style: 'documentInfo' 
                    },
                    { 
                      text: `Rapport généré par: ${userName}`,
                      alignment: 'right', 
                      style: 'documentInfo' 
                    },
                    { 
                      text: `Type de rapport: ${this.selectedDataType}`, 
                      alignment: 'right',
                      style: 'documentInfo'
                    }
                  ]
                }
              ]
            },
            
            // Titre principal
            { 
              text: `Statistiques sur les ${this.selectedDataType.charAt(0).toUpperCase() + this.selectedDataType.slice(1)}`,
              style: 'mainHeader',
              margin: [0, 0, 0, 15]
            },
            
            // Tableau principal avec nouvelles largeurs dynamiques
            {
              margin: [0, 0, 0, 20],
              table: {
                headerRows: 1,
                widths: columnWidths,
                body: [
                  headers.map(header => ({
                    text: header,
                    style: 'tableHeader',
                    margin: [0, 5, 0, 5]
                  })),
                  ...this.filteredData.map(item => 
                    this.tableHeaders.map(h => ({
                      text: this.formatValue(this.getNestedValue(item, h.key)),
                      style: 'tableContent',
                      noWrap: false
                    }))
                  )
                ]
              },
              layout: {
                fillColor: function(rowIndex) {
                  return (rowIndex % 2 === 0) ? '#f9fafb' : null;
                },
                hLineWidth: function(i, node) { 
                  return (i === 0 || i === node.table.body.length) ? 1 : 0.5; 
                },
                vLineWidth: function() { return 0.5; },
                hLineColor: function() { return '#e5e7eb'; },
                vLineColor: function() { return '#e5e7eb'; },
                paddingTop: function() { return 4; }, // Réduit le padding
                paddingBottom: function() { return 4; }, // Réduit le padding
                paddingLeft: function() { return 4; }, // Réduit le padding
                paddingRight: function() { return 4; } // Réduit le padding
              }
            },
            
            // Résumé
            ...(this.filteredData.length > 0 ? [
              {
                margin: [0, 0, 0, 20],
                text: `${this.filteredData.length}  Données récupérées`,
                style: {
                  fontSize: 10,
                  bold: true,
                  color: '#1f2937',
                  alignment: 'right'
                }
              }
            ] : [])
          ],
          styles: {
            companyName: {
              fontSize: 18,
              bold: true,
              color: 'black'
            },
            companyInfo: {
              fontSize: 9,
              color: '#1f2937',
              margin: [0, 2]
            },
            documentInfo: {
              fontSize: 9,
              color: '#1f2937',
              margin: [0, 0]
            },
            mainHeader: {
              fontSize: 16,
              bold: true,
              alignment: 'center',
              color: '#1f2937'
            },
            tableHeader: {
              bold: true,
              fontSize: 9, // Réduit la taille de la police
              color: 'black',
              fillColor: '#C8E6C9',
              alignment: 'left'
            },
            tableContent: {
              fontSize: 8, // Réduit la taille de la police
              color: '#1f2937',
              margin: [2, 2, 2, 2], // Réduit les marges
              lineHeight: 1.1, // Réduit l'interligne
              alignment: 'left'
            },
            summaryLabel: {
              fontSize: 10,
              bold: true,
              color: '#ffffff'
            },
            summaryValue: {
              fontSize: 10,
              bold: true,
              color: '#ffffff',
              alignment: 'right'
            }
          },
          defaultStyle: {
            font: 'Roboto',
            fontSize: 10,
            lineHeight: 1.2
          },
          fonts: {
            Roboto: {
              normal: 'Roboto-Regular.ttf',
              bold: 'Roboto-Medium.ttf',
              italics: 'Roboto-Italic.ttf',
              bolditalics: 'Roboto-MediumItalic.ttf'
            }
          }
        };
        //construire le pdf
        const pdfDoc = pdfMake.createPdf(docDefinition);
        pdfDoc.download(`${this.selectedDataType}_export_${new Date().toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/[/: ]/g, '-')}.pdf`);
      } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        this.$toast.error('Une erreur est survenue lors de la génération du PDF');
      }
    },
    redirectToDashboard() {
      this.$router.push('/dashboard');
    },
    applyFilters() {
      this.selectedDataType = this.tempSelectedDataType;
      this.searchQuery = this.tempSearchQuery;
      this.startDate = this.tempStartDate;
      this.endDate = this.tempEndDate;
      Object.assign(this.filters, this.tempFilters);
      this.currentPage = 1;
    },
    resetFilters() {
      this.tempSelectedDataType = 'products';
      this.tempSearchQuery = '';
      this.tempStartDate = '';
      this.tempEndDate = '';
      Object.assign(this.tempFilters, {
        ticketStatus: '',
        ticketProduct: '',
        ticketUser: '',
        userRole: '',
        userCountry: '',
        ratingsLevel: ''
      });
    }
  },
  watch: {
    selectedDataType() {
      this.currentPage = 1;
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style scoped>
.reporting-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Add smooth transitions */
.card {
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
}

/* Add loading animation */
.loading {
  position: relative;
}

.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
