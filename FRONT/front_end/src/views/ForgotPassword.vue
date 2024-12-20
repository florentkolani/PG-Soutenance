<template>
  <section class="bg-gray-50">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <!-- Logo et Titre -->
      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900  flex-col ">
        <img class="w-8 h-8 mr-2" src="../assets/logo.png" alt="logo">
        NOVA LEAD
      </a>
      <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
            Réinitialisez votre mot de passe
          </h1>
          <form class="space-y-4 md:space-y-6" @submit.prevent="requestReset">
            <!-- Champ Email -->
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Votre email</label>
              <input 
                v-model="email" 
                type="email" 
                id="email" 
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" 
                placeholder="name@company.com" 
                required 
              />
            </div>
            <!-- Bouton d'envoi -->
            <button 
              type="submit" 
              class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Envoyer le lien
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
    };
  },
  methods: {
    async requestReset() {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/resetPasswordRequest', { email: this.email });
        console.log('Réponse:', response.data);
        alert('Lien de réinitialisation envoyé, vérifiez votre email.');
      } catch (error) {
        console.error('Erreur:', error.response ? error.response.data : error);
        alert('Erreur lors de l\'envoi du lien, veuillez réessayer.');
      }
    },
  },
};
</script>
<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
</style>
