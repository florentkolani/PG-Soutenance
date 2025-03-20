<template>
  <div>
    <!-- Email Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow">
        <div class="relative p-4">
          <div class="flex justify-between items-center pb-4 mb-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Envoyer un Email</h3>
            <button @click="closeModal" class="text-red-600 hover:text-red-800 text-2xl">&times;</button>
          </div>

          <form @submit.prevent="sendEmail">
            <!-- Liste des utilisateurs avec dropdown -->
            <div class="mb-6">
              <h2 class="text-lg font-semibold mb-4">À :</h2>
              <div class="relative">
                <button
                  type="button"
                  @click="toggleDropdown"
                  class="w-full border border-gray-300 rounded-lg p-2 text-left"
                >
                  {{ selectedEmails.length > 0 ? selectedEmails.join(", ") : "Sélectionnez les utilisateurs" }}
                </button>
                <div v-if="isDropdownOpen" class="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-60 overflow-y-auto">
                  <div v-for="user in users" :key="user._id" class="flex items-center p-2">
                    <input
                      type="checkbox"
                      :value="user.email"
                      v-model="selectedEmails"
                      class="mr-2"
                    />
                    <label>{{ user.name }}</label>
                  </div>
                  <p v-if="users.length === 0" class="text-gray-500 p-2">Aucun utilisateur disponible.</p>
                </div>
              </div>
            </div>

            <!-- Sujet de l'email -->
            <div class="mb-4">
              <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">Objet :</label>
              <input
                type="text"
                id="subject"
                v-model="emailSubject"
                class="block w-full border border-gray-300 rounded-lg p-2"
                placeholder="Entrez le sujet de l'email"
                required
              />
            </div>

            <!-- Contenu de l'email -->
            <div class="mb-4">
              <!-- <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Rédigez votre message</label> -->
              <div id="editor" class="block w-full border border-gray-300 rounded-lg p-2" style="min-height: 300px;"></div>
            </div>

            <!-- Bouton d'envoi -->
            <div class="flex justify-end">
              <button
                type="submit"
                class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
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
      showSuccessPopup: false, // New state for success popup
      showErrorPopup: false, // New state for error popup
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/users/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.users = response.data.data || [];
        console.log("Utilisateurs récupérés :", this.users);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        alert("Impossible de récupérer les utilisateurs. Veuillez réessayer plus tard.");
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
  },
  mounted() {
    this.fetchUsers();
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
  min-height: 300px; /* Augmenter la hauteur */
}
</style>
