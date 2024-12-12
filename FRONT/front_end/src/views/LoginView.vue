<template>
  <section class="bg-gray-50">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a href="#" class="flex flex-col items-center mb-6 text-2xl font-semibold text-gray-1000">
        <img class="w-8 h-8 mr-2" src="../assets/logo.png" alt="logo">
        NOVA LEAD
      </a>
      <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 ">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
            Connectez - vous
          </h1>

          <!-- Message d'erreur -->
          <div v-if="showAlert" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center justify-between text-center" role="alert">
            <span>Échec de la connexion. Veuillez vérifier vos identifiants et Réessayez .</span>
            <button @click="closeAlert" class="text-red-700 font-bold ml-4">
              &times;
            </button>
          </div>

          <!-- Formulaire de connexion -->
          <form class="space-y-4 md:space-y-6" @submit.prevent="login">
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Votre email</label>
              <input v-model="email" type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" placeholder="name@company.com" required />
            </div>
            <div class="relative">
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Mot de passe</label>
              <input :type="showPassword ? 'text' : 'password'" v-model="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 pr-10" required />
              <button type="button" @click="togglePasswordVisibility" class="absolute inset-y-0 right-3 top-5 flex items-center text-gray-500 focus:outline-none">
                <span v-if="showPassword">👁️</span>
                <span v-else>👁️‍🗨️</span>
              </button>
            </div>
            <button type="submit" class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Connexion</button>
            <div class="flex justify-end">
              <a href="/ForgotPassword" class="text-sm text-blue-600 hover:underline">Mot de passe oublié ?</a>
            </div>
          </form>

        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { loginUser } from '@/services/authService';
import axios from 'axios';

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      showAlert: false
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    
    async login() {
  console.log('Tentative de connexion...');
  if (!this.email || !this.password) {
    console.error('Email ou mot de passe manquant');
    this.showAlert = true;
    return;
  }

  try {
    const credentials = { email: this.email, password: this.password };
    const response = await axios.post('http://localhost:5000/api/auth/login', credentials);

    // Afficher la réponse pour vérifier sa structure
    console.log('Réponse de la connexion:', response);

    // Vérifier si la structure de la réponse est correcte
    if (response && response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);

      // Vérification de mustChangePassword
      if (response.data.mustChangePassword) {
        console.log("Première connexion - redirection vers la page de modification");
        this.$router.push('/changePassword');
      } else {
        console.log("Connexion réussie - redirection vers le tableau de bord");
        this.$router.push('/dashboard');
      }
    } else {
      console.error('Token manquant dans la réponse');
      this.showAlert = true; // Afficher l'alerte en cas de réponse invalide
    }
  } catch (error) {
    console.error('Login failed:', error);
    this.showAlert = true; // Afficher l'alerte en cas d'échec
    if (error.response) {
      console.error('Erreur de serveur:', error.response.data);
    }
  }
}

}

};
</script>

<style>
button[type="button"] {
  padding: 0;
  background: none;
}
</style>
