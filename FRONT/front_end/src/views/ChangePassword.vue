<template>
  <section class="bg-gray-50 h-screen flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <!-- Logo -->
      <a href="#" class="flex flex-col items-center mb-6 text-2xl font-semibold text-gray-900">
        <img class="w-12 h-12 mb-2" src="../assets/logo.png" alt="logo">
        NOVA LEAD
      </a>
      <h2 class="text-2xl font-bold mb-4 text-center">Choisissez un nouveau mot de passe</h2>
      <form @submit.prevent="changePassword">
        <div class="mb-4 relative">
          <label for="newPassword" class="block text-sm font-medium text-gray-900">Nouveau mot de passe</label>
          <input 
            v-model="newPassword" 
            :type="showNewPassword ? 'text' : 'password'" 
            id="newPassword" 
            class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 pr-10" 
            required
          />
          <button 
            type="button" 
            @click="toggleShowNewPassword" 
            class="absolute inset-y-0 right-2 flex items-center text-gray-500 focus:outline-none"
          >
            <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
        <div class="mb-4 relative">
          <label for="confirmPassword" class="block text-sm font-medium text-gray-900">Confirmer le mot de passe</label>
          <input 
            v-model="confirmPassword" 
            :type="showConfirmPassword ? 'text' : 'password'" 
            id="confirmPassword" 
            class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 pr-10" 
            required
          />
          <button 
            type="button" 
            @click="toggleShowConfirmPassword" 
            class="absolute inset-y-0 right-2 flex items-center text-gray-500 focus:outline-none"
          >
            <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Enregistrer
        </button>
      </form>
      <div v-if="error" class="mt-4 text-red-500 text-sm text-center">{{ error }}</div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      showNewPassword: false,
      showConfirmPassword: false,
      error: null,
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

      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        await axios.post('http://localhost:5000/api/auth/changePassword', { newPassword: this.newPassword }, config);

        // Déconnexion automatique après modification
        localStorage.removeItem('token');
        this.$router.push('/');
      } catch (error) {
        console.error('Erreur lors du changement de mot de passe:', error);
        this.error = "Une erreur s'est produite. Veuillez réessayer.";
      }
    },
  },
};
</script>

<style>
/* Ajoutez les styles pour les icônes */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
</style>
