<template>
  <section class="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12">
    <div class="flex flex-col items-center justify-center px-6 mx-auto h-full lg:py-0">
      <!-- Logo et Titre -->
      <a href="#" class="flex flex-col items-center mb-8 transform hover:scale-105 transition-transform duration-300">
        <img class="w-12 h-12 mb-2" src="../assets/logo.png" alt="logo">
        <span class="text-3xl font-bold text-gray-800 tracking-tight">NOVA LEAD</span>
      </a>

      <!-- Card principale -->
      <div
        class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform hover:shadow-2xl transition-all duration-300">
        <div class="p-8 space-y-6">
          <h1 class="text-2xl font-bold text-gray-900 text-center mb-2">
            Mot de passe oublié ?
          </h1>
          <p class="text-center text-gray-600 text-sm mb-6">
            Entrez votre email pour réinitialiser votre mot de passe
          </p>

          <form class="space-y-6" @submit.prevent="requestReset">
            <div class="space-y-2">
              <label for="email" class="text-sm font-medium text-gray-700 block">Email</label>
              <div class="relative">
                <input v-model="email" type="email" id="email"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required />
                <p class="mt-1 text-sm text-gray-500">Exemple : nom@domaine.com</p>
              </div>
            </div>

            <button type="submit"
              class="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 focus:ring-4 focus:ring-green-200 font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              :disabled="isLoading">
              <span v-if="!isLoading">Réinitialiser le mot de passe</span>
              <div v-else class="flex items-center space-x-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                <span>Envoi en cours...</span>
              </div>
            </button>

            <div class="text-center">
              <a href="/login"
                class="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">
                Retour à la connexion
              </a>
            </div>
          </form>
        </div>
      </div>

      <!-- Popup de succès -->
      <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
          <div class="text-center">
            <div class="mb-4 flex justify-center">
              <i class="fas fa-check-circle text-5xl text-green-500"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Email envoyé avec succès</h3>
            <p class="mb-6 text-gray-600">
              Un nouveau mot de passe vous a été envoyé par email.
              Vous devrez le changer lors de votre prochaine connexion.
            </p>
            <button @click="handlePopupClose"
              class="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200">
              Retour à la connexion
            </button>
          </div>
        </div>
      </div>

      <!-- Popup d'erreur -->
      <div v-if="errorPopup" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
          <div class="text-center">
            <div class="mb-4 flex justify-center">
              <i class="fas fa-exclamation-circle text-5xl text-red-500"></i>
            </div>
            <h3 class="text-xl font-semibold text-red-600 mb-4">Erreur</h3>
            <p class="mb-6 text-gray-600">{{ errorMessage }}</p>
            <button @click="errorPopup = false"
              class="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import { API_URL } from '@/services/config';

export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      showPopup: false,
      errorPopup: false,
      errorMessage: '',
      isLoading: false
    };
  },
  methods: {
    async requestReset() {
      if (this.isLoading) return;

      this.isLoading = true;
      try {
        const response = await axios.post(`${API_URL}/auth/resetPasswordRequest`, { email: this.email });
        console.log('Réponse:', response.data);
        this.showPopup = true;
      } catch (error) {
        console.error('Erreur:', error.response ? error.response.data : error);
        this.errorMessage = error.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe, veuillez réessayer.';
        this.errorPopup = true;
      } finally {
        this.isLoading = false;
      }
    },
    handlePopupClose() {
      this.showPopup = false;
      this.$router.push('/login');
    }
  },
};
</script>

<style scoped>
.scale-100 {
  animation: modalPop 0.3s ease-out;
}

@keyframes modalPop {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Effet de focus amélioré */
input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Animation de transition pour les boutons */
button {
  transition: all 0.2s ease-in-out;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
