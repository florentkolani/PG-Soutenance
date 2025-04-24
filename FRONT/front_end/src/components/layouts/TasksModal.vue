<template>
  <div>
    <!-- Modal Form -->
    <section
      v-if="!showDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      @click.self="closeDropdowns"
    >
      <div class="relative w-full max-w-2xl mx-4 transform transition-all duration-300 ease-in-out scale-100">
        <div class="bg-white rounded-xl shadow-2xl overflow-hidden">
          <!-- Header -->
          <div class="p-2 bg-gray-200">
            <div class="flex justify-between items-center">
              <h3 class="text-2xl font-bold text-black pl-4 mb-1">
                {{ isEditing ? 'Modifier' : 'Ajouter' }} une tâche
              </h3>
              <button
                @click="$emit('close')"
                class="rounded-full p-1 hover:bg-blue-400/50 text-black transition-colors duration-200"
                :disabled="isLoading"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Form -->
          <form @submit.prevent="submitForm" class="p-3 space-y-1">
            <!-- Client et Pays -->
            <div class="grid grid-cols-2 gap-6">
              <!-- Sélection du pays -->
              <div class="space-y-2">
                <label for="pays" class="block text-sm font-medium text-gray-700">
                  Pays <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="task.countryId"
                  id="pays"
                  required
                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" class="text-gray-500">Sélectionnez un pays</option>
                  <option v-for="country in countries" :key="country._id" :value="country._id" class="text-gray-800">
                    {{ country.name }}
                  </option>
                </select>
              </div>
              <!-- Sélection du client -->
              <div class="space-y-2">
                <label for="client" class="block text-sm font-medium text-gray-700">
                  Client <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="task.userId"
                  id="client"
                  required
                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" class="text-gray-500">Sélectionnez un client</option>
                  <option v-for="user in clients" :key="user._id" :value="user._id" class="text-gray-800">
                    {{ user.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Dates -->
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <label for="dateDebut" class="block text-sm font-medium text-gray-700">
                  Date de début <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="task.startday"
                  type="date"
                  id="dateDebut"
                  required
                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div class="space-y-2">
                <label for="dateFin" class="block text-sm font-medium text-gray-700">
                  Date de fin <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="task.endday"
                  type="date"
                  id="dateFin"
                  required
                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <!-- Produit et Type de demande -->
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <label for="produit" class="block text-sm font-medium text-gray-700">
                  Produit <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="task.productId"
                  id="produit"
                  required
                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" class="text-gray-500">Sélectionnez un produit</option>
                  <option v-for="product in products" :key="product._id" :value="product._id" class="text-gray-800">
                    {{ product.name }}
                  </option>
                </select>
              </div>

              <div class="space-y-2">
                <label for="typeDemande" class="block text-sm font-medium text-gray-700">
                  Type de demande <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="task.typeDeDemandeId"
                  id="typeDemande"
                  required
                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" class="text-gray-500">Sélectionnez un type de demande</option>
                  <option v-for="type in typeDemandes" :key="type._id" :value="type._id" class="text-gray-800">
                    {{ type.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div class="space-y-2">
              <label for="description" class="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                v-model="task.description"
                id="description"
                rows="4"
                class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Entrez une description détaillée..."
              ></textarea>
            </div>
             <!-- Agents assignés -->
             <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Agents assignés <span class="text-red-500">*</span>
              </label>
              <div class="relative w-full">
                <button
                  type="button"
                  @click="toggleDropdown"
                  class="w-full border border-gray-300 rounded-lg p-2 text-left hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200 text-base flex items-center justify-between"
                >
                  <span class="truncate">
                    {{ getSelectedAgentsNames }}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div v-if="isDropdownOpen" class="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-60 overflow-y-auto shadow-lg">
                  <!-- Checkbox Tout sélectionner -->
                  <div class="p-2 border-b">
                    <label class="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        :checked="isAllSelected"
                        @change="toggleSelectAll"
                        class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span class="ml-2 font-semibold">Tout sélectionner</span>
                    </label>
                  </div>
                  <div v-for="user in agents" :key="user._id" class="flex items-center p-2 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      :value="user._id"
                      v-model="task.assignedAgents"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label class="ml-2 cursor-pointer">{{ user.name }}</label>
                  </div>
                  <p v-if="agents.length === 0" class="text-gray-500 p-2">Aucun agent disponible.</p>
                </div>
              </div>
            </div>


            <!-- Zone d'upload -->
            <div v-if="!file" class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Ajouter un fichier
              </label>
              <div
                class="relative border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-blue-500 cursor-pointer transition-colors duration-200"
                @click="$refs.fileInput.click()"
              >
                <input
                  type="file"
                  ref="fileInput"
                  @change="handleFileChange"
                  class="hidden"
                  accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                />
                <div class="space-y-2">
                  <svg
                    class="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <div class="text-sm text-gray-600">
                    <span class="font-medium text-blue-500 hover:text-blue-600">
                      Cliquer pour choisir
                    </span>
                    <p class="text-xs text-gray-500 mt-1">
                      PNG, JPG, PDF, Word jusqu'à 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

           
            <!-- Bouton de soumission -->
            <div class="flex justify-center pt-4">
              <button
                type="submit"
                class="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 shadow-lg transition-all duration-200 disabled:opacity-50"
                :disabled="isLoading"
              >
                <span class="mr-2">{{ isEditing ? 'Modifier' : 'Créer' }} la tâche</span>
                <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Dialog de confirmation/erreur -->
    <div v-if="showDialog" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div class="bg-gray-300 rounded-xl shadow-2xl overflow-hidden w-full max-w-md mx-4">
        <div class="p-6 flex flex-col items-center">
          <div class="text-6xl mb-4 text-white">
            <svg
          class="mx-auto text-green-500 w-12 h-12 dark:text-green-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          v-if ="dialogType === 'success'"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 11.917 9.724 16.5 19 7.5"
          />
        </svg>
        <svg
          class="mx-auto text-red-500 w-12 h-12 dark:text-red-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          v-else-if="dialogType === 'error'"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM15 9l-6 6m0-6l6 6"
          />
        </svg>
          </div>
          <p class="text-xl font-medium text-black mb-6 text-center">{{ dialogMessage }}</p>
        </div>
        <div class="p-4 flex justify-center">
          <button
            @click="closeDialog"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_URL } from '@/services/config';

export default {
  name: 'TacheModal',

  props: {
    taskToEdit: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      task: {
        userId: '',
        countryId: '',
        typeDeDemandeId: '',
        productId: '',
        startday: '',
        endday: '',
        description: '',
        files: [],
        assignedAgents: []
      },
      clients: [],
      agents: [],
      countries: [],
      products: [],
      typeDemandes: [],
      isLoading: false,
      showDialog: false,
      dialogMessage: '',
      dialogType: '',
      file: null,
      isDropdownOpen: false
    };
  },

  computed: {
    isEditing() {
      return !!this.taskToEdit;
    },
    getSelectedAgentsNames() {
      return this.task.assignedAgents.map(userId => {
        const user = this.agents.find(u => u._id === userId);
        return user ? user.name : '';
      }).join(', ');
    },
    isAllSelected() {
      return this.task.assignedAgents.length === this.agents.length;
    }
  },

  async created() {
    try {
      await Promise.all([
        this.loadUsers(),
        this.loadCountries(),
        this.loadProducts(),
        this.loadTypeDemandes()
      ]);

      if (this.taskToEdit) {
        this.initializeEditForm();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      this.showErrorDialog('Erreur lors du chargement des données');
    }
  },

  methods: {
    async loadUsers() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/users/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        this.clients = response.data.data.filter(user => user.role === 'Client') || [];
        this.agents = response.data.data.filter(user => ['Admin', 'AgentSupport'].includes(user.role)) || [];
        
        console.log('Clients chargés:', this.clients);
        console.log('Agents chargés:', this.agents);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        throw error;
      }
    },

    async loadCountries() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/countries`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.countries = response.data.countries || [];
        console.log('Pays chargés:', this.countries);
      } catch (error) {
        console.error('Erreur lors du chargement des pays:', error);
        throw error;
      }
    },

    async loadProducts() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/products`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.products = Array.isArray(response.data) ? response.data : (response.data.products || []);
        console.log('Produits chargés:', this.products);
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        throw error;
      }
    },

    async loadTypeDemandes() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/types`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.typeDemandes = response.data.types || [];
        console.log('Types de demandes chargés:', this.typeDemandes);
      } catch (error) {
        console.error('Erreur lors du chargement des types de demande:', error);
        throw error;
      }
    },

    handleFileChange(event) {
      this.file = event.target.files[0];
      this.task.files = Array.from(event.target.files);
    },

    initializeEditForm() {
      if (this.taskToEdit) {
        console.log('Tâche à modifier:', this.taskToEdit);
        
        // Formater les dates pour les champs de type date (format YYYY-MM-DD)
        const formatDateForInput = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        };
        
        this.task = {
          userId: this.taskToEdit.userId?._id || this.taskToEdit.userId || '',
          countryId: this.taskToEdit.countryId?._id || this.taskToEdit.countryId || '',
          typeDeDemandeId: this.taskToEdit.typeDeDemandeId?._id || this.taskToEdit.typeDeDemandeId || '',
          productId: this.taskToEdit.productId?._id || this.taskToEdit.productId || '',
          startday: formatDateForInput(this.taskToEdit.startday),
          endday: formatDateForInput(this.taskToEdit.endday),
          description: this.taskToEdit.description || '',
          files: [],
          assignedAgents: this.taskToEdit.assignedAgents?.map(agent => 
            typeof agent === 'object' ? agent._id : agent
          ) || []
        };
        
      } else {
        // Ensure assignedAgents is initialized for new tasks
        this.task.assignedAgents = [];
      }
    },

    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },

    toggleSelectAll(event) {
      if (event.target.checked) {
        this.task.assignedAgents = this.agents.map(user => user._id);
      } else {
        this.task.assignedAgents = [];
      }
    },

    async submitForm() {
      this.isLoading = true;
      try {
        // Validate that at least one user is selected
        if (!this.task.assignedAgents || this.task.assignedAgents.length === 0) {
          this.showErrorDialog('Veuillez sélectionner au moins un agent pour la tâche.');
          this.isLoading = false;
          return;
        }

        const formData = new FormData();
        
        // Format dates to ISO string if they exist
        const formattedTask = { ...this.task };
        if (formattedTask.startday) {
          formattedTask.startday = new Date(formattedTask.startday).toISOString().split('T')[0];
        }
        if (formattedTask.endday) {
          formattedTask.endday = new Date(formattedTask.endday).toISOString().split('T')[0];
        }
        
        // Add all fields to formData
        Object.keys(formattedTask).forEach(key => {
          if (key === 'files') {
            if (formattedTask.files && formattedTask.files.length > 0) {
              formattedTask.files.forEach(file => {
                formData.append('files', file);
              });
            }
          } else if (key === 'assignedAgents') {
            formData.append('assignedAgents', JSON.stringify(formattedTask.assignedAgents));
          } else {
            formData.append(key, formattedTask[key]);
          }
        });

        const token = localStorage.getItem('token');
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        };

        let response;
        if (this.isEditing) {
          // Vérifier si les dates ont changé
          const datesChanged = this.checkIfDatesChanged();
          
          response = await axios.put(
            `${API_URL}/tasks/${this.taskToEdit._id}`,
            formData,
            { headers }
          );
          
          // Si les dates ont changé, mettre à jour le statut
          if (datesChanged) {
            await this.updateTaskStatus(response.data._id);
          }
        } else {
          response = await axios.post(
            `${API_URL}/tasks`,
            formData,
            { headers }
          );
        }

        this.dialogType = 'success';
        this.dialogMessage = `Tâche ${this.isEditing ? 'modifiée' : 'créée'} avec succès`;
        this.showDialog = true;
        this.$emit('task-updated');
      } catch (error) {
        console.error('Erreur lors de la soumission du formulaire:', error);
        this.showErrorDialog(`Erreur lors de ${this.isEditing ? 'la modification' : 'la création'} de la tâche: ${error.response?.data?.message || error.message}`);
      } finally {
        this.isLoading = false;
      }
    },
    
    // Vérifier si les dates ont changé
    checkIfDatesChanged() {
      if (!this.isEditing || !this.taskToEdit) return false;
      
      const originalStartDate = new Date(this.taskToEdit.startday).toISOString().split('T')[0];
      const originalEndDate = new Date(this.taskToEdit.endday).toISOString().split('T')[0];
      
      const newStartDate = new Date(this.task.startday).toISOString().split('T')[0];
      const newEndDate = new Date(this.task.endday).toISOString().split('T')[0];
      
      return originalStartDate !== newStartDate || originalEndDate !== newEndDate;
    },
    
    // Mettre à jour le statut de la tâche en fonction de la date actuelle
    async updateTaskStatus(taskId) {
      try {
        const now = new Date();
        const startDate = new Date(this.task.startday);
        
        // Si la date de début est passée ou égale à aujourd'hui, mettre le statut à "en cours"
        // Si la date de début est dans le futur, mettre le statut à "en attente"
        const newStatus = startDate <= now ? 'en cours' : 'en attente';
        
        const token = localStorage.getItem('token');
        await axios.put(
          `${API_URL}/tasks/${taskId}/status`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(`Statut de la tâche mis à jour en "${newStatus}"`);
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
      }
    },

    showErrorDialog(message) {
      this.dialogType = 'error';
      this.dialogMessage = message;
      this.showDialog = true;
    },

    closeDialog() {
      this.showDialog = false;
      if (this.dialogType === 'success') {
        this.$emit('close');
      }
    },

    closeDropdowns() {
      // Implement if needed
    }
  }
};
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Styles pour le dropdown des agents */
.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.z-10 {
  z-index: 10;
}

.max-h-60 {
  max-height: 15rem;
}

.overflow-y-auto {
  overflow-y: auto;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>