<template>
  <div>
    <section v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-0 rounded-lg shadow-lg max-w-lg w-full max-h-[100vh] overflow-y-auto relative">
        <button @click="$emit('close')" 
        class="absolute top-4 right-6 text-red-600 hover:text-gray-700 text-2xl w-10 h-10 flex items-center justify-center">&times;</button>

        <div class="py-4 px-6">
          <h2 class="mb-4 text-xl font-bold text-gray-900 text-center">
            {{ isEdit ? "Modifier le ticket" : "Créer un ticket" }}
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <!-- Product Select -->
              <div class="sm:col-span-2">
                <label for="product" class="block mb-2 text-sm font-medium text-gray-900">
                  Produit <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="selectedProduct"
                  id="product"
                  required
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                >
                  <option value="">Sélectionnez un produit</option>
                  <option v-for="product in products" :key="product._id" :value="product._id">{{ product.name }}</option>
                </select>
              </div>

              <!-- Type de Demande Select -->
              <div class="sm:col-span-2">
                <label for="typeDeDemande" class="block mb-2 text-sm font-medium text-gray-900">
                  Type de demande <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="selectedTypeDeDemande"
                  id="typeDeDemande"
                  required
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                >
                  <option value="">Sélectionnez un type de demande</option>
                  <option v-for="type in typeDeDemandes" :key="type._id" :value="type._id">{{ type.name }}</option>
                </select>
              </div>

              <!-- Urgency, Description, and File Upload -->
              <div class="sm:col-span-2">
                <label for="urgence" class="block mb-2 text-sm font-medium text-gray-900">
                  Priorité <span class="text-red-500">*</span>
                </label>
                <select v-model="urgence" 
                id="urgence" required 
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5">
                  <option value="">Sélectionnez une priorité</option>
                  <option value="urgent">Urgent</option>
                  <option value="Pas Urgent">Pas Urgent</option>
                </select>
              </div>
              <div class="sm:col-span-2">
                <label for="description" class="block mb-2 text-sm font-medium text-gray-900">
                  Description <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="description"
                  id="description"
                  rows="5"
                  required
                  class="block w-full text-sm bg-gray-50 rounded-lg border"
                ></textarea>
              </div>
              <div class="sm:col-span-2">
              <!-- Afficher le fichier récupéré s'il existe -->
              <div v-if="file" class="mb-4">
                <p class="text-sm font-medium text-gray-900">Fichier actuel :</p>
                <a :href="file" target="_blank" class="text-blue-500 hover:underline">
                  Télécharger le fichier
                </a>
                <button
                  @click="removeFile"
                  type="button"
                  class="ml-4 text-sm text-red-500 hover:text-red-700"
                >
                  X
                </button>
              </div>

              <!-- Champ pour télécharger un nouveau fichier -->
              <label v-if="!file" for="screenshot" class="block mb-2 text-sm font-medium text-gray-900">
                Télécharger un fichier (seul les fichiers .png, .jpg, .jpeg, .Mswords, .pdf sont autorisés)
              </label>
              <input
                type="file"
                @change="handleFileChange"
                id="screenshot"
                class="bg-gray-50 text-sm rounded-lg w-full p-2.5"
              />
            </div>
            </div>
            <div class="flex justify-center">
              <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div class="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
                <button
                  type="submit"
                  class="inline-flex items-center px-5 py-2.5 mt-4 text-sm font-medium text-black bg-green-300 rounded-lg hover:bg-green-800 disabled:opacity-50"
                  :disabled="isLoading"
                >
                  {{ isLoading ? "Chargement..." : (isEdit ? "Modifier le ticket" : "Créer un ticket") }}
                </button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Boîte de dialogue de succès -->
    <div v-if="showSuccessMessage" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-4 rounded-lg shadow-lg max-w-md w-full text-center">
        <h3 class="text-xl font-bold mb-4">Succès</h3>
        <p>{{ successMessage }}</p>
        <button @click="closeSuccessDialog" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          OK
        </button>
      </div>
    </div>

    <div v-if="showLimitModal" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-md flex flex-col items-center">
      <!-- Icône d'alerte -->
      <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M5.22 19h13.56c1.07 0 1.6-1.3.84-2.04L13.84 5.04a1.5 1.5 0 00-2.68 0L4.38 16.96c-.76.74-.23 2.04.84 2.04z"/>
      </svg>

      <!-- Message d'erreur -->
      <p class="mt-4 text-gray-700 text-center">{{ errorMessage }}</p>

      <!-- Bouton centré -->
      <button 
        @click="showLimitModal = false" 
        class="mt-6 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
      >
        Fermer
      </button>
    </div>
  </div>

  </div>
</template>


<script>
import axios from 'axios';
import { API_URL } from '@/services/config';

export default {
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
    ticket: {
      type: Object,
      default: null,
    },
  },
  emits: ['close', 'createTicket', 'updateTicket', 'refreshData'],
  data() {
    return {
      products: [],
      typeDeDemandes: [],
      selectedProduct: '',
      selectedTypeDeDemande: '',
      urgence: '',
      description: '',
      status: 'ouvert',
      file: null,
      isLoading: false,
      showLimitModal: false, // Affichage de la boîte de dialogue de limite
      showSuccessMessage: false, // Affichage de la boîte de dialogue de succès
      errorMessage: "", // Message d'erreur pour la boîte de dialogue
    };
  },
  computed: {
    isEdit() {
      return !!this.ticket;
    },
  },
  watch: {
  ticket: {
    immediate: true,
    handler(ticket) {
      console.log("Ticket reçu :", ticket); // Ajoutez ce log pour déboguer
      this.loadProductsAndTypes();
      if (ticket) {
        this.selectedProduct = ticket.productId?._id || ticket.productId || '';
        this.selectedTypeDeDemande = ticket.typeDeDemandeId?._id || ticket.typeDeDemandeId || '';
        this.urgence = ticket.urgence;
        this.description = ticket.description;
        this.status = ticket.status; // Assurez-vous de récupérer le statut
        if (ticket.file) {
          this.file = ticket.file; // Assigner le fichier à une variable
          console.log("Fichier récupéré :", this.file); // Log pour déboguer
        } else {
          this.file = null; // Réinitialiser le fichier s'il n'existe pas
        }
      } else {
        this.resetFields();
      }
    },
  },
},
  mounted() {
    this.loadProductsAndTypes();
  },
  methods: {
    resetFields() {
      this.selectedProduct = '';
      this.selectedTypeDeDemande = '';
      this.urgence = '';
      this.description = '';
      this.file = null;
    },

    removeFile() {
      this.file = null; // Supprimer le fichier
    },

    async loadProductsAndTypes() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("L'utilisateur n'est pas connecté");
        return;
      }

      try {
        // Chargement des produits
        const productResponse = await axios.get(`${API_URL}/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.products = Array.isArray(productResponse.data) ? productResponse.data : [];

        // Chargement des types de demandes
        const typeResponse = await axios.get(`${API_URL}/types`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.typeDeDemandes = typeResponse.data.types || [];
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    },

    async handleSubmit() {
  if (!this.selectedProduct || !this.selectedTypeDeDemande || !this.urgence || !this.description) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert("L'utilisateur n'est pas connecté");
    return;
  }

  let userId;
  try {
    userId = JSON.parse(atob(token.split('.')[1])).id;
  } catch (error) {
    console.error("Erreur lors de la récupération de userId :", error);
    alert("Erreur lors de la récupération de userId");
    return;
  }

  const apiEndpoint = this.isEdit ? `${API_URL}/tickets/${this.ticket._id}` : `${API_URL}/tickets`;
  const method = this.isEdit ? 'put' : 'post';

  const data = new FormData();
  data.append('productId', this.selectedProduct);
  data.append('typeDeDemandeId', this.selectedTypeDeDemande);
  data.append('urgence', this.urgence);
  data.append('description', this.description);
  data.append('status', this.status || 'en attente'); // Assurez-vous que le statut est défini
  data.append('userId', userId);
  if (this.file) {
    data.append('file', this.file);
  }

  // Log des données avant envoi
  for (let [key, value] of data.entries()) {
    console.log(key, value);
  }

  this.isLoading = true;

  try {
    const response = await axios({
      method,
      url: apiEndpoint,
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });

    this.successMessage = this.isEdit ? "Ticket mis à jour avec succès !" : "Ticket créé avec succès !";
    this.showSuccessMessage = true;
    this.$emit('close');
    this.$emit('refreshData'); // Rafraîchit les données
  } catch (error) {
    console.error("Erreur lors de l'envoi des données :", error.response?.data || error.message);

    if (error.response?.status === 400 && error.response.data.message.includes("trois tickets en cours")) {
      this.errorMessage = error.response.data.message;
      this.showLimitModal = true; // Afficher la boîte de dialogue de limite
    } else {
      alert("Erreur lors de l'envoi des données");
    }
  } finally {
    this.isLoading = false;
  }
},

    handleFileChange(event) {
      this.file = event.target.files[0];
    },
    closeSuccessDialog() {
      this.showSuccessMessage = false;
      setTimeout(() => {
    location.reload();
  }); 
    },
  },
};
</script>
