<template>
    <section class="bg-gray-50 h-screen flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4 text-center">Changer le mot de passe</h2>
        <form @submit.prevent="changePassword">
          <div class="mb-4">
            <label for="newPassword" class="block text-sm font-medium text-gray-900">Nouveau mot de passe</label>
            <input v-model="newPassword" type="password" id="newPassword" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5" required />
          </div>
          <div class="mb-4">
            <label for="confirmPassword" class="block text-sm font-medium text-gray-900">Confirmer le mot de passe</label>
            <input v-model="confirmPassword" type="password" id="confirmPassword" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5" required />
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
        error: null,
      };
    },
    methods: {
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
  