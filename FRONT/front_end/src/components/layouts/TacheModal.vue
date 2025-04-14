<template>
    <div>
      <!-- Modal Form -->
      <div
        v-if="!showDialog"
        tabindex="-1"
        class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75 backdrop-blur-sm transition-opacity duration-300"
        @click.self="closeDropdowns"
      >
        <div class="relative w-full max-w-2xl mx-4 transform transition-all duration-300 ease-in-out">
          <div class="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div class="p-2 bg-gradient-to-r">
              <div class="flex justify-between items-center">
                <h3 class="text-2xl font-bold text-black pl-4">
                  {{ isEditing ? 'Modifier' : 'Ajouter' }} une tâche
                </h3>
                <button
                  @click="$emit('close')"
                  class="rounded-full p-2 hover:bg-gray-400 text-black transition-colors duration-200"
                  :disabled="isLoading"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
  
            <!-- Form -->
            <form @submit.prevent="submitForm" class="p-6">
              <div class="grid gap-4 md:gap-6">
                <!-- Sélection du client -->
                <div>
                  <label for="client" class="block mb-2 text-sm font-medium text-gray-700">
                    Client <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="task.clientId"
                    id="client"
                    required
                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                    <option value="" class="text-gray-400">Sélectionnez un client</option>
                    <option v-for="client in clients" :key="client._id" :value="client._id" class="text-gray-800">
                      {{ client.name }}
                    </option>
                  </select>
                </div>
  
                <!-- Sélection du pays -->
                <div>
                  <label for="pays" class="block mb-2 text-sm font-medium text-gray-700">
                    Pays <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="task.paysId"
                    id="pays"
                    required
                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                    <option value="" class="text-gray-400">Sélectionnez un pays</option>
                    <option v-for="country in countries" :key="country._id" :value="country._id" class="text-gray-800">
                      {{ country.name }}
                    </option>
                  </select>
                </div>
  
                <!-- Dates -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="dateDebut" class="block mb-2 text-sm font-medium text-gray-700">
                      Date de début <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="task.dateDebut"
                      type="date"
                      id="dateDebut"
                      required
                      class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  </div>
                  <div>
                    <label for="dateFin" class="block mb-2 text-sm font-medium text-gray-700">
                      Date de fin <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="task.dateFin"
                      type="date"
                      id="dateFin"
                      required
                      class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                  </div>
                </div>
  
                <!-- Type de demande -->
                <div>
                  <label for="typeDemande" class="block mb-2 text-sm font-medium text-gray-700">
                    Type de demande <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="task.typeDemande"
                    id="typeDemande"
                    required
                    class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                    <option value="" class="text-gray-400">Sélectionnez le type de demande</option>
                    <option value="urgent">Urgent</option>
                    <option value="normal">Normal</option>
                    <option value="planifie">Planifié</option>
                  </select>
                </div>
  
                <!-- Upload de fichier -->
                <div>
                  <label for="fichier" class="block mb-2 text-sm font-medium text-gray-700">
                    Document(s)
                  </label>
                  <input
                    type="file"
                    id="fichier"
                    multiple
                    @change="handleFileUpload"
                    class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                  />
                </div>
  
                <!-- Sélection des agents -->
                <div>
                  <label class="block mb-2 text-sm font-medium text-gray-700">
                    Agents assignés <span class="text-red-500">*</span>
                  </label>
                  <div class="space-y-2 max-h-48 overflow-y-auto p-2 border border-gray-300 rounded-lg">
                    <div v-for="agent in agents" :key="agent._id" class="flex items-center">
                      <input
                        type="checkbox"
                        :id="agent._id"
                        v-model="task.selectedAgents"
                        :value="agent._id"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label :for="agent._id" class="ml-2 text-sm font-medium text-gray-900">
                        {{ agent.name }} ({{ agent.role }})
                      </label>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Bouton de soumission -->
              <div class="flex justify-center mt-6">
                <button
                  type="submit"
                  class="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-300 shadow-md transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50"
                  :disabled="isLoading"
                >
                  {{ isEditing ? 'Modifier' : 'Créer' }} la tâche
                  <svg v-if="isLoading" class="w-4 h-4 ml-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  
      <!-- Dialog de confirmation/erreur -->
      <div v-if="showDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md mx-4">
          <div :class="['p-6', dialogType === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600']">
            <div class="text-6xl mb-4 text-white">
              <i v-if="dialogType === 'success'" class="fas fa-check-circle"></i>
              <i v-else class="fas fa-times-circle"></i>
            </div>
            <p class="text-xl font-medium text-white mb-6">{{ dialogMessage }}</p>
          </div>
          <div class="p-4 bg-gray-50 flex justify-center">
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
          clientId: '',
          paysId: '',
          dateDebut: '',
          dateFin: '',
          typeDemande: '',
          files: [],
          selectedAgents: []
        },
        clients: [],
        countries: [],
        agents: [],
        isLoading: false,
        showDialog: false,
        dialogMessage: '',
        dialogType: ''
      };
    },
  
    computed: {
      isEditing() {
        return !!this.taskToEdit;
      }
    },
  
    async created() {
      await Promise.all([
        this.loadClients(),
        this.loadCountries(),
        this.loadAgents()
      ]);
  
      if (this.taskToEdit) {
        this.initializeEditForm();
      }
    },
  
    methods: {
      async loadClients() {
        try {
          const response = await axios.get(`${API_URL}/users?role=Client`);
          this.clients = response.data.users;
        } catch (error) {
          console.error('Erreur lors du chargement des clients:', error);
        }
      },
  
      async loadCountries() {
        try {
          const response = await axios.get(`${API_URL}/countries`);
          this.countries = response.data.countries;
        } catch (error) {
          console.error('Erreur lors du chargement des pays:', error);
        }
      },
  
      async loadAgents() {
        try {
          const response = await axios.get(`${API_URL}/users?role=Admin,AgentSupport`);
          this.agents = response.data.users;
        } catch (error) {
          console.error('Erreur lors du chargement des agents:', error);
        }
      },
  
      handleFileUpload(event) {
        this.task.files = Array.from(event.target.files);
      },
  
      initializeEditForm() {
        if (this.taskToEdit) {
          this.task = {
            ...this.taskToEdit,
            selectedAgents: this.taskToEdit.agents?.map(agent => agent._id) || []
          };
        }
      },
  
      async submitForm() {
        this.isLoading = true;
        try {
          const formData = new FormData();
          Object.keys(this.task).forEach(key => {
            if (key === 'files') {
              this.task.files.forEach(file => {
                formData.append('files', file);
              });
            } else if (key === 'selectedAgents') {
              formData.append('agents', JSON.stringify(this.task.selectedAgents));
            } else {
              formData.append(key, this.task[key]);
            }
          });
  
          const token = localStorage.getItem('token');
          const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          };
  
          let response;
          if (this.isEditing) {
            response = await axios.put(
              `${API_URL}/tasks/${this.taskToEdit._id}`,
              formData,
              { headers }
            );
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
          this.dialogType = 'error';
          this.dialogMessage = `Erreur lors de ${this.isEditing ? 'la modification' : 'la création'} de la tâche: ${error.message}`;
          this.showDialog = true;
        } finally {
          this.isLoading = false;
        }
      },
  
      closeDialog() {
        this.showDialog = false;
        this.$emit('close');
      },
  
      closeDropdowns() {
        // Implement if needed
      }
    }
  };
  </script>