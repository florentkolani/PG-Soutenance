<template>
  <div class="bg-gray-100 min-h-screen">
    <Header title="NOVA LEAD" :primaryActionText="canAddTask ? 'Nouvelle tâche' : ''"
      @primaryAction="showTaskModal = true" @filterChanged="onFilterChanged" :filterAction="true"
      :filterOptions="taskFilterOptions" />

    <main class="w-full px-4 py-3">
      <div class="flex flex-row items-center justify-between space-x-4 mb-4">
        <h1 class="text-2xl font-bold">Liste des tâches</h1>
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
      <div class="overflow-x-auto relative">
        <table class="min-w-full bg-white">
          <thead>
            <tr>
              <th class="py-2 px-4 text-left">Client</th>
              <th class="py-2 px-4 text-left">Pays</th>
              <th class="py-2 px-4 text-left">Produit</th>
              <th class="py-2 px-4 text-left">Type de demande</th>
              <th class="py-2 px-4 text-center">Date début</th>
              <th class="py-2 px-4 text-center">Date fin</th>
              <th class="py-2 px-4 text-center">T.Exécution</th>
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
              <td class="border px-4 py-2 text-center">{{ formatDate(task.startday) }}</td>
              <td class="border px-4 py-2 text-center"> {{ formatDate(task.endday) }}</td>
              <td class="border px-4 py-2 text-center">
                <span v-if="task.statut === 'cloturé'" :class="{
                  'text-red-700': status.type === 'late',
                  'text-green-700': status.type === 'early',
                  'text-blue-700': status.type === 'ontime'
                }" v-for="status in [task.statusMessage || calculateStatusMessage(task) || { message: 'N/A' }]">
                  {{ status.message }}
                </span>
                <span v-else class="text-orange-500">En cours</span>
              </td>
              <td class="border px-4 py-2 text-center">
                <span v-if="task.statut === 'en attente'"
                  class="inline-block w-4 h-4 bg-yellow-400 rounded-full"></span>
                <span v-else-if="task.statut === 'en cours'"
                  class="inline-block w-4 h-4 bg-orange-500 rounded-full"></span>
                <span v-else-if="task.statut === 'cloturé'"
                  class="inline-block w-4 h-4 bg-green-500 rounded-full"></span>
                <span v-else class="inline-block w-4 h-4 bg-green-500 rounded-full">

                </span>
              </td>
              <td class="border px-4 py-2">
                {{ Array.isArray(task.assignedAgents) ? task.assignedAgents.length : 0 }} agent(s)
              </td>
              <td class="border px-4 py-2 text-center">
                <fwb-dropdown placement="left">
                  <template #trigger class="">
                    <fwb-button color="light">
                      <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                        <path
                          d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                      </svg>
                    </fwb-button>
                  </template>
                  <nav class="py-2 text-sm text-gray-700 dark:text-gray-200 bg-gray-100">
                    <button @click="openTaskDetailsDialog(task)"
                      class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
                      <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"
                          d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 5h6m-6 4h6M10 3v4h4V3h-4Z" />
                      </svg>

                      Détail
                    </button>
                    <button @click="openTaskDetails(task)"
                      class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 max-w-md text-left">
                      <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"
                          d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z" />
                      </svg>


                      Messages
                    </button>

                    <button v-if="task.statut !== 'cloturé' && task.statut !== 'en cours'" @click="editTask(task)"
                      class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Modifier
                    </button>

                    <button v-if="task.statut !== 'cloturé'" @click="closeTask(task)"
                      class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
                      <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"
                          d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
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
          <button @click="cancelCloseTask" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            :disabled="isLoading">Annuler</button>
          <button @click="confirmCloseTask"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
            :disabled="isLoading">
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            {{ isLoading ? 'Clôture en cours...' : 'Clôturer' }}
          </button>
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

    <!-- Details dialog -->
    <div v-if="selectedTaskDetails"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center p-4 z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg shadow-md relative">
        <h2 class="text-xl font-bold mb-4 text-center">Détails de la tâche</h2>
        <table class="table-auto w-full border-collapse border border-gray-300">
          <tbody>
            <tr>
              <td class="font-bold border px-4 py-2">Client</td>
              <td class="border px-4 py-2">{{ selectedTaskDetails.userId?.name || 'Inconnu' }}</td>
            </tr>
            <tr>
              <td class="font-bold border px-4 py-2">Pays</td>
              <td class="border px-4 py-2">{{ selectedTaskDetails.countryId?.name || 'Inconnu' }}</td>
            </tr>
            <tr>
              <td class="font-bold border px-4 py-2">Produit</td>
              <td class="border px-4 py-2">{{ selectedTaskDetails.productId?.name || 'Inconnu' }}</td>
            </tr>
            <tr>
              <td class="font-bold border px-4 py-2">Type de demande</td>
              <td class="border px-4 py-2">{{ selectedTaskDetails.typeDeDemandeId?.name || 'Inconnu' }}</td>
            </tr>
            <tr>
              <td class="font-bold border px-4 py-2">Date début</td>
              <td class="border px-4 py-2">{{ formatDate(selectedTaskDetails.startday) }}</td>
            </tr>
            <tr>
              <td class="font-bold border px-4 py-2">Date fin</td>
              <td class="border px-4 py-2">{{ formatDate(selectedTaskDetails.endday) }}</td>
            </tr>
            <tr>
              <td class="font-bold border px-4 py-2">Statut</td>
              <td class="border px-4 py-2">{{ selectedTaskDetails.statut }}</td>
            </tr>
            <tr>
              <td class="font-bold border px-4 py-2">Agents assignés</td>
              <td class="border px-4 py-2">
                <template
                  v-if="Array.isArray(selectedTaskDetails.assignedAgents) && selectedTaskDetails.assignedAgents.length">
                  {{selectedTaskDetails.assignedAgents.map(agent => agent.name || agent.email || agent).join(', ')}}
                </template>
                <template v-else>
                  Aucun agent assigné
                </template>
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="closeTaskDetailsDialog"
          class="bg-gray-500 text-white px-4 py-2 mt-6 rounded-md mx-auto block">Fermer</button>
      </div>
    </div>
  </div>

  <!-- Pagination -->
  <Pagination :total-items="totalItems" :items-per-page="itemsPerPage" @page-changed="goToPage" />
</template>

<script>
import axios from 'axios';
import { API_URL } from '@/services/config';
import Header from '@/components/layouts/Header.vue';
import Pagination from '@/components/layouts/Pagination.vue';
import TasksModal from '@/components/layouts/TasksModal.vue';
import { FwbDropdown, FwbButton } from 'flowbite-vue';
import { getUserRole } from '@/services/authService';

export default {
  name: 'Tasks',

  components: {
    Header,
    Pagination,
    TasksModal,
    FwbDropdown,
    FwbButton
  },

  data() {
    return {
      tasks: [],
      showTaskModal: false,
      selectedTask: null,
      dropdownOpen: null,
      dropdownPosition: { top: 0, left: 0 },
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
      isLoading: false,
      selectedTaskDetails: null,
    };
  },

  computed: {
    filteredTasks() {
      if (!this.selectedStatus) return this.tasks;
      return this.tasks.filter(task => task.statut === this.selectedStatus);
    },
    canAddTask() {
      const userRole = getUserRole();
      return userRole !== 'AgentSupport';
    }
  },

  mounted() {
    this.fetchTasks();
    document.addEventListener('click', this.closeDropdownOnClickOutside);
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

    toggleDropdown(id, event) {
      if (this.dropdownOpen === id) {
        this.dropdownOpen = null;
      } else {
        this.dropdownOpen = id;
        this.$nextTick(() => {
          const btn = this.$refs['dropdownBtn-' + id];
          const menu = this.$refs['dropdownMenu-' + id];
          if (!btn || !menu) return;
          const btnRect = btn[0] ? btn[0].getBoundingClientRect() : btn.getBoundingClientRect();
          const menuRect = menu[0] ? menu[0].getBoundingClientRect() : menu.getBoundingClientRect();
          let top = btnRect.bottom + window.scrollY;
          let left = btnRect.left + window.scrollX;
          // Adjust if overflow right
          if (left + menuRect.width > window.innerWidth) {
            left = window.innerWidth - menuRect.width - 8; // 8px margin
          }
          // Adjust if overflow bottom
          if (top + menuRect.height > window.innerHeight + window.scrollY) {
            top = btnRect.top + window.scrollY - menuRect.height;
            if (top < 0) top = 8; // 8px margin
          }
          this.dropdownPosition = { top, left };
        });
      }
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
        this.isLoading = true;
        const token = localStorage.getItem('token');
        const response = await axios.put(  // Ajout de la constante response manquante
          `${API_URL}/tasks/${this.taskToClose._id}/close`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // La réponse contient la tâche mise à jour avec le statusMessage
        const updatedTask = response.data;

        // Mettre à jour la tâche dans votre tableau local
        const index = this.tasks.findIndex(t => t._id === updatedTask._id);
        if (index !== -1) {
          this.tasks.splice(index, 1, updatedTask);
        }

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
        this.isLoading = false;
        this.showCloseTaskModal = false;
        this.taskToClose = null;
      }
    },

    calculateStatusMessage(task) {
      if (!task.closedAt || !task.endday || task.statut !== 'cloturé') return null;

      const closedAt = new Date(task.closedAt);
      const endDay = new Date(task.endday);
      const diffTime = closedAt - endDay;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        return {
          message: `⚠ +${diffDays}j`,
          type: 'late'
        };
      } else if (diffDays < 0) {
        return {
          message: `⏱ ${diffDays}j`,
          type: 'early'
        };
      } else {
        return {
          message: "✓ À temps",
          type: 'ontime'
        };
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
    openTaskDetails(task) {
      this.$router.push(`/tasks/${task._id}`);
    },
    goToTaskDetails(task) {
      this.$router.push({ name: 'TaskDetails', params: { id: task._id } });
    },
    openTaskDetailsDialog(task) {
      this.selectedTaskDetails = task;
    },
    closeTaskDetailsDialog() {
      this.selectedTaskDetails = null;
    }
  }
};
</script>