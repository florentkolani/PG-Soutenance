<template>
  <section class="bg-gray-50 h-screen flex items-center justify-center">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
      <!-- En-tête avec Logo -->
      <div class="text-center mb-8">
        <img class="w-16 h-16 mx-auto mb-4" src="../assets/logo.png" alt="logo">
        <h1 class="text-2xl font-bold text-gray-800">NOVA LEAD</h1>
        <p class="text-gray-600 mt-2">Sécurisez votre compte</p>
      </div>

      <!-- Formulaire -->
      <form @submit.prevent="changePassword" class="space-y-6">
        <!-- Nouveau mot de passe -->
        <div class="space-y-2">
          <label for="newPassword" class="text-sm font-medium text-gray-700 block">
            Nouveau mot de passe
          </label>
          <div class="relative">
            <input 
              v-model="newPassword" 
              :type="showNewPassword ? 'text' : 'password'" 
              id="newPassword" 
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
              required
              placeholder="Entrez votre nouveau mot de passe"
            />
            <button 
              type="button" 
              @click="toggleShowNewPassword" 
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Confirmation mot de passe -->
        <div class="space-y-2">
          <label for="confirmPassword" class="text-sm font-medium text-gray-700 block">
            Confirmer le mot de passe
          </label>
          <div class="relative">
            <input 
              v-model="confirmPassword" 
              :type="showConfirmPassword ? 'text' : 'password'" 
              id="confirmPassword" 
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
              required
              placeholder="Confirmez votre nouveau mot de passe"
            />
            <button 
              type="button" 
              @click="toggleShowConfirmPassword" 
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Critères de mot de passe -->
        <div class="bg-blue-50 p-4 rounded-lg">
          <h4 class="text-sm font-medium text-blue-800 mb-2">Critères de sécurité :</h4>
          <ul class="text-sm text-blue-700 space-y-1">
            <li class="flex items-center">
              <i class="fas fa-check-circle mr-2"></i>
              Minimum 6 caractères
            </li>
          </ul>
        </div>

        <!-- Bouton de soumission -->
        <button 
          type="submit" 
          class="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <i class="fas fa-lock"></i>
          <span>Mettre à jour le mot de passe</span>
        </button>
      </form>
    </div>
  </section>

  <!-- Modal de succès -->
  <div v-if="successMessage" 
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    @click.self="closePopup">
    <div class="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
      <div class="text-center">
        <!-- Icône de succès animée -->
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6 animate-bounce">
          <i class="fas fa-check text-green-600 text-2xl"></i>
        </div>
        
        <h3 class="text-2xl font-bold text-gray-900 mb-4">
          Mot de passe mis à jour !
        </h3>
        
        <p class="text-gray-600 mb-8 leading-relaxed">
          Votre mot de passe a été modifié avec succès. Pour des raisons de sécurité, vous allez être redirigé vers la page de connexion dans quelques secondes.
        </p>
        
        <button 
          @click="closePopup" 
          class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          <i class="fas fa-sign-in-alt"></i>
          <span>Se reconnecter</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Modal d'erreur -->
  <div v-if="error" 
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    @click.self="error = null">
    <div class="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6 animate-pulse">
          <i class="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
        </div>
        
        <h3 class="text-2xl font-bold text-red-600 mb-4">
          Erreur
        </h3>
        
        <p class="text-gray-600 mb-8 leading-relaxed">
          {{ error }}
        </p>
        
        <button 
          @click="error = null" 
          class="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          <i class="fas fa-times"></i>
          <span>Fermer</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_URL } from '@/services/config';

export default {
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      showNewPassword: false,
      showConfirmPassword: false,
      error: null,
      successMessage: null,
    };
  },
  methods: {
    toggleShowNewPassword() {
      this.showNewPassword = !this.showNewPassword;
    },
    toggleShowConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    async changePassword() {
      if (this.newPassword !== this.confirmPassword) {
        this.error = 'Les mots de passe ne correspondent pas.';
        return;
      }

      if (this.newPassword.length < 6) {
        this.error = 'Le mot de passe doit contenir au moins 6 caractères.';
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        await axios.post(`${API_URL}/auth/changePassword`, { newPassword: this.newPassword }, config);

        // Déconnexion automatique après modification
        localStorage.removeItem('token');
        this.successMessage = 'Votre mot de passe a été mis à jour avec succès.';
        
        // Redirection automatique après 3 secondes
        setTimeout(() => {
          this.closePopup();
        }, 10000);
      } catch (error) {
        console.error('Erreur lors du changement de mot de passe:', error);
        this.error = error.response?.data?.message || "Une erreur s'est produite. Veuillez réessayer.";
      }
    },
    closePopup() {
      this.successMessage = null;
      this.$router.push('/login');
    },
  },
};
</script>

<style>
/* Ajoutez les styles pour les icônes */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
</style>

<style scoped>
.animate-bounce {
  animation: bounce 1s infinite;
}

.animate-pulse {
  animation: pulse 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-5%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .7;
  }
}

.scale-100 {
  transform: scale(1);
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
