<template>
  <div>
    <!-- Email Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="relative p-4 w-full max-w-2xl bg-white h-auto rounded-2xl shadow">
        <div class="relative p-4">
          <div class="flex justify-between items-center pb-2 mb-2 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Envoyer un Email</h3>
            <button @click="closeModal" class="text-red-600 hover:text-red-800 text-2xl">&times;</button>
          </div>

          <form @submit.prevent="sendEmail">
            <!-- Liste des utilisateurs avec dropdown -->
            <div class="mb-4">
              
              <!-- Sélecteur de pays -->
              <div class="mb-3">
                <label for="country" class="block text-lg font-semibold mb-1">Pays :</label>
                <select
                  id="country"
                  v-model="selectedCountry"
                  @change="fetchUsers"
                  class="w-full border border-gray-300 rounded-lg p-2 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200"
                >
                  <option value="">Tous les pays</option>
                  <option v-for="country in countries" :key="country._id" :value="country._id">
                    {{ country.name }}
                  </option>
                </select>
              </div>

              <div class="relative w-full">
                <h2 class="text-lg font-semibold mb-1">Clients :</h2>
                <button
                  type="button"
                  @click="toggleDropdown"
                  class="w-full border border-gray-300 rounded-lg p-2 text-left hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200 text-base flex items-center justify-between"
                >
                  <span class="truncate">
                    {{ selectedEmails.length > 0 ? selectedEmails.join(", ") : "Sélectionnez les utilisateurs" }}
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
                  <div v-for="user in users" :key="user._id" class="flex items-center p-2 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      :value="user.email"
                      v-model="selectedEmails"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label class="ml-2 cursor-pointer">{{ user.name }}</label>
                  </div>
                  <p v-if="users.length === 0" class="text-gray-500 p-2">Aucun utilisateur disponible.</p>
                </div>
              </div>
            </div>

            <!-- Sujet de l'email -->
            <div class="mb-3">
              <label for="subject" class="block text-lg font-semibold mb-1">Objet :</label>
              <input
                type="text"
                id="subject"
                v-model="emailSubject"
                class="block w-full border border-gray-300 rounded-lg p-2 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200"
                placeholder="Entrez le sujet de l'email"
                required
              />
            </div>

            <!-- Contenu de l'email -->
            <div class="mb-3">
              <div id="editor" class="block w-full border border-gray-300 rounded-lg p-2" style="min-height: 200px;"></div>
            </div>

            <!-- Bouton d'envoi -->
            <div class="flex justify-end">
              <button
                type="submit"
                class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                :disabled="isSending || selectedEmails.length === 0"
              >
                <span v-if="isSending" class="loader-spinner"></span>
                {{ isSending ? "Envoi en cours..." : "Envoyer l'email" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Success Popup -->
    <div v-if="showSuccessPopup" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg text-center">
        <div class="flex justify-center mb-4">
          <svg
          class="mx-auto text-green-500 w-12 h-12 dark:text-green-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 11.917 9.724 16.5 19 7.5"
          />
        </svg>
        </div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Email envoyé avec succès !</h2>
        <button
          @click="handleSuccessPopupClose"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          OK
        </button>
      </div>
    </div>

    <!-- Error Popup -->
    <div v-if="showErrorPopup" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg text-center">
        <div class="flex justify-center mb-4">
          <svg
          class="mx-auto text-red-500 w-12 h-12 dark:text-red-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
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
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Échec de l'envoi de l'email.</h2>
        <button
          @click="handleErrorPopupClose"
          class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Réessayer
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URL } from "@/services/config";
import Header from "@/components/layouts/Header.vue";
import Quill from "quill";

export default {
  props: ['showModal'],
  components: {
    Header,
  },
  data() {
    return {
      users: [],
      selectedEmails: [],
      emailSubject: "",
      emailMessage: "",
      isSending: false,
      isDropdownOpen: false,
      quill: null,
      showSuccessPopup: false,
      showErrorPopup: false,
      selectedCountry: "",
      countries: [],
    };
  },
  computed: {
    isAllSelected() {
      return this.users.length > 0 && this.selectedEmails.length === this.users.length;
    }
  },
  methods: {
    async fetchUsers() {
      try {
        const token = localStorage.getItem("token");
        const url = `${API_URL}/users/all`;
        
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allUsers = response.data.data || [];
        // Filter users based on selected country's _id
        this.users = this.selectedCountry
          ? allUsers.filter(user => user.paysId === this.selectedCountry)
          : allUsers;
        console.log("Utilisateurs récupérés :", this.users);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        alert("Impossible de récupérer les utilisateurs. Veuillez réessayer plus tard.");
      }
    },
    async fetchCountries() {
      // charger les pays depuis la base de données
    try {
      const response = await axios.get(`${API_URL}/countries?limit=0`);
      this.countries = response.data.countries
        .map((country) => ({
          name: country.name,
          code: country.code,
          _id: country._id,
          dialCode: country.code,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      console.log("Countries loaded:", this.countries);
    } catch (error) {
      console.error("Erreur lors du chargement des pays :", error);
      this.countries = [];
    }
    },
    async sendEmail() {
      if (this.selectedEmails.length === 0) {
        alert("Veuillez sélectionner au moins un utilisateur.");
        return;
      }

      this.isSending = true;

      try {
        const token = localStorage.getItem("token");
        const emailContent = this.quill.root.innerHTML; // Get the rich text content
        await axios.post(
          `${API_URL}/emails/send`,
          {
            to: this.selectedEmails,
            subject: this.emailSubject,
            message: emailContent,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.showSuccessPopup = true; // Show success popup
      } catch (error) {
        console.error("Erreur lors de l'envoi de l'email :", error);
        this.showErrorPopup = true; // Show error popup
      } finally {
        this.isSending = false;
      }
    },
    handleSuccessPopupClose() {
      this.showSuccessPopup = false; // Hide the popup
      this.$emit('close'); // Close the modal
      window.location.reload(); // Refresh the page
    },
    handleErrorPopupClose() {
      this.showErrorPopup = false; // Hide the error popup
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    closeModal() {
      this.$emit('close'); // Ferme le modal d'envoi d'email
    },
    initializeQuill() {
      this.quill = new Quill("#editor", {
        theme: "snow",
        placeholder: "  Rédigez votre message...",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            [{ align: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
          ],
        },
      });
    },
    toggleSelectAll() {
      if (this.isAllSelected) {
        this.selectedEmails = [];
      } else {
        this.selectedEmails = this.users.map(user => user.email);
      }
    },
  },
  mounted() {
    this.fetchUsers();
    this.fetchCountries();
    this.$nextTick(() => {
      if (this.showModal) {
        this.initializeQuill();
      }
    });
  },
  watch: {
    showModal(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.initializeQuill();
        });
      }
    },
  },
};
</script>

<style scoped>
.loader-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 2s linear infinite;
  display: inline-block;
  vertical-align: middle;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

#editor {
  min-height: 300px;
}

/* Styles pour l'éditeur Quill */
:deep(.ql-toolbar) {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  border-color: #e5e7eb;
  background-color: #f9fafb;
}

:deep(.ql-container) {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  border-color: #e5e7eb;
  font-size: 1rem;
}

:deep(.ql-editor) {
  min-height: 250px;
  padding: 1rem;
}
</style>
