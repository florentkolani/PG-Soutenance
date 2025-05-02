<template>
  <div class="bg-gray-100 min-h-screen">
    <Header title="NOVA LEAD" primaryActionText="Nouvelle tâche" @primaryAction="showTaskModal = true"
      @filterChanged="onFilterChanged" :filterAction="true" :filterOptions="taskFilterOptions" />

    <main class="w-full px-4 py-3">
      <!-- Titre et légende -->
      <div class="flex flex-row items-center justify-between space-x-4 mb-4">
        <h1 class="text-2xl font-bold">Liste des tâches</h1>

        <!-- Légendes des statuts -->
        <div class="overflow-x-auto border-gray-500 bg-slate-200 rounded-lg">
          <table class="table-auto border-collapse border border-gray-300 w-500 ml-auto">
            <tbody>
              <tr>
                <td class="px-4 py-2 text-sm text-gray-900 border border-gray-300">
                  <div class="flex items-center space-x-2">
                    <span class="font-bold">STATUT :</span>
                    <span class="inline-block w-4 h-4 bg-yellow-400 rounded-full"></span>
                    <span>En attente</span>
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

      <!-- Table des tâches -->
      <div class="overflow-x-auto relative overflow-y-hidden">
        <table class="min-w-full bg-white">
          <thead>
            <tr>
              <th class="py-2 px-4 text-left">Client</th>
              <th class="py-2 px-4 text-left">Pays</th>
              <th class="py-2 px-4 text-left">Produit</th>
              <th class="py-2 px-4 text-left">Type de demande</th>
              <th class="py-2 px-4 text-center">Date début</th>
              <th class="py-2 px-4 text-center">Date fin</th>
              <th class="py-2 px-4 text-center">Statut</th>
              <th class="py-2 px-4 text-center">Agents assignés</th>
              <th class="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in filteredTasks" :key="task._id">
              <td class="border px-4 py-2">{{ task.userId?.name }}</td>
              <td class="border px-4 py-2">{{ task.countryId?.name }}</td>
              <td class="border px-4 py-2">{{ task.productId?.name }}</td>
              <td class="border px-4 py-2">{{ task.typeDeDemandeId?.name }}</td>
              <td class="border px-4 py-2 text-center">
                {{ formatDate(task.startday) }}
              </td>
              <td class="border px-4 py-2 text-center">
                {{ formatDate(task.endday) }}
              </td>
              <td class="border px-4 py-2 text-center">
                <span v-if="task.statut === 'en attente'"
                  class="inline-block w-4 h-4 bg-yellow-400 rounded-full"></span>
                <span v-else-if="task.statut === 'en cours'"
                  class="inline-block w-4 h-4 bg-orange-500 rounded-full"></span>
                <span v-else-if="task.statut === 'cloturé'"
                  class="inline-block w-4 h-4 bg-green-500 rounded-full"></span>
                <span v-else class="inline-block w-4 h-4 bg-green-500 rounded-full"></span>
              </td>
              <td class="border px-4 py-2">
                {{ Array.isArray(task.assignedAgents) ? task.assignedAgents.length : 0 }} agent(s)
              </td>
              <td class="border px-4 py-2 text-center">
                <div class="relative inline-block text-left">
                  <!-- Bouton des trois points pour ouvrir le dropdown -->
                  <button @click="toggleDropdown(task._id)"
                    class="text-gray-700 hover:text-gray-500 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"
                      stroke="none">
                      <circle cx="5" cy="12" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="19" cy="12" r="1.5" />
                    </svg>
                  </button>

                  <!-- Dropdown menu avec les boutons d'actions -->
                  <div v-if="dropdownOpen === task._id"
                    class="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded shadow-lg"
                    style="position: fixed; z-index: 9999;">
                    <button @click="openTaskDetails(task)"
                      class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12H9m0 0H4.55M9 12h5l2.5 8.5M9 12H4.55M9 12v3m-1.6 5h7.2M9 9l-2.5 8.5M15 12l2.5 8.5M15 12l-2.5-8.5" />
                      </svg>
                      Messages
                    </button>

                    <button @click="editTask(task)"
                      class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 11V4m-7 7h14m-7 7v-3m-2-5h7m-3 0h4" />
                      </svg>
                      Modifier
                    </button>


                    <button v-if="task.statut !== 'cloturé'" @click="closeTask(task)"
                      class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M5 12h14m0 0l-3 3m3-3l-3-3" />
                      </svg>
                      Clôturer
                    </button>

                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <Pagination :total-items="totalItems" :items-per-page="itemsPerPage" @page-changed="goToPage" />
    </main>

    <!-- Modal de tâche -->
    <TasksModal v-if="showTaskModal" :taskToEdit="selectedTask" @close="closeTaskModal" @task-updated="fetchTasks" />

    <!-- Modal de confirmation pour clôturer une tâche -->
    <div v-if="showCloseTaskModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded shadow-lg">
        <svg class="mx-auto mb-4 text-red-500 w-12 h-12 dark:text-gray-200" aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <p class="mb-4">Êtes-vous sûr de vouloir clôturer cette tâche ?</p>
        <div class="flex justify-center space-x-4 text-center">
          <button @click="cancelCloseTask" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Annuler</button>
          <button @click="confirmCloseTask"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Clôturer</button>
        </div>
      </div>
    </div>

    <!-- Dialog de confirmation/erreur de la clôture de la tache -->
    <div v-if="showDialog" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div class="bg-gray-300 rounded-xl shadow-2xl overflow-hidden w-full max-w-md mx-4">
        <div class="p-6 flex flex-col items-center">
          <div class="text-6xl mb-4 text-white">
            <svg class="mx-auto text-green-500 w-12 h-12 dark:text-green-400" aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" v-if="dialogType === 'success'">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 11.917 9.724 16.5 19 7.5" />
            </svg>
            <svg class="mx-auto text-red-500 w-12 h-12 dark:text-red-400" aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" v-else-if="dialogType === 'error'">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM15 9l-6 6m0-6l6 6" />
            </svg>
          </div>
          <p class="text-xl font-medium text-black mb-6 text-center">{{ dialogMessage }}</p>
        </div>
        <div class="p-4 flex justify-center">
          <button @click="closeDialog"
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
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
import Header from '@/components/layouts/Header.vue';
import Pagination from '@/components/layouts/Pagination.vue';
import TasksModal from '@/components/layouts/TasksModal.vue';

export default {
  name: 'Tasks',

  components: {
    Header,
    Pagination,
    TasksModal
  },

  data() {
    return {
      tasks: [],
      showTaskModal: false,
      selectedTask: null,
      dropdownOpen: null,
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      selectedStatus: '',
      taskFilterOptions: [
        { value: '', label: 'Tous' },
        { value: 'en attente', label: 'En attente' },
        { value: 'en cours', label: 'En cours' },
        { value: 'cloturé', label: 'Clôturé' }
      ],
      statusCheckInterval: null,
      showCloseTaskModal: false,
      taskToClose: null,
      showDialog: false,
      dialogMessage: '',
      dialogType: '',
    };
  },

  computed: {
    filteredTasks() {
      if (!this.selectedStatus) return this.tasks;
      return this.tasks.filter(task => task.statut === this.selectedStatus);
    }
  },

  mounted() {
    this.fetchTasks();
    document.addEventListener('click', this.closeDropdownOnClickOutside);
    // Vérifier le statut toutes les minutes
    this.statusCheckInterval = setInterval(this.checkTasksStatus, 60000);
  },

  beforeDestroy() {
    document.removeEventListener('click', this.closeDropdownOnClickOutside);
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
    }
  },

  methods: {
    async fetchTasks() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${API_URL}/tasks?page=${this.currentPage}&limit=${this.itemsPerPage}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        this.tasks = response.data.tasks;
        this.totalItems = response.data.total;
      } catch (error) {
        console.error('Erreur lors de la récupération des tâches:', error);
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('fr-FR');
    },


    toggleDropdown(id) {
      this.dropdownOpen = this.dropdownOpen === id ? null : id;
    },

    closeDropdownOnClickOutside(event) {
      if (!event.target.closest('.relative')) {
        this.dropdownOpen = null;
      }
    },

    editTask(task) {
      this.selectedTask = task;
      this.showTaskModal = true;
      this.dropdownOpen = null;
    },
    closeDialog() {
      this.showDialog = false;
      this.dialogMessage = '';
      this.dialogType = '';
    },

    async closeTask(task) {
      this.taskToClose = task;
      this.showCloseTaskModal = true;
    },
    cancelCloseTask() {
      this.showCloseTaskModal = false;
      this.taskToClose = null;
    },
    async confirmCloseTask() {
      try {
        const token = localStorage.getItem('token');
        await axios.put(
          `${API_URL}/tasks/${this.taskToClose._id}/close`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        this.dialogMessage = 'Tâche clôturée avec succès.';
        this.dialogType = 'success';
        this.showDialog = true;

        this.fetchTasks();
      } catch (error) {
        console.error('Erreur lors de la clôture de la tâche:', error);
        this.dialogMessage = 'Erreur lors de la clôture de la tâche.';
        this.dialogType = 'error';
        this.showDialog = true;
      } finally {
        this.showCloseTaskModal = false;
        this.taskToClose = null;
      }
    },
    closeTaskModal() {
      this.showTaskModal = false;
      this.selectedTask = null;
    },

    onFilterChanged(status) {
      this.selectedStatus = status;
    },

    goToPage(page) {
      this.currentPage = page;
      this.fetchTasks();
    },

    async checkTasksStatus() {
      const now = new Date();
      for (const task of this.tasks) {
        if (task.statut === 'en attente' && new Date(task.startday) <= now) {
          try {
            const token = localStorage.getItem('token');
            await axios.put(
              `${API_URL}/tasks/${task._id}/status`,
              { status: 'en cours' },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            task.statut = 'en cours';
          } catch (error) {
            console.error('Erreur lors de la mise à jour du statut:', error);
          }
        }
      }
    },

    openTaskDetails(task) {
      this.$router.push(`/tasks/${task._id}`);
    }
  }
};
</script>