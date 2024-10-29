<template>
  <section class="bg-gray-50">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a href="#" class="flex flex-col items-center mb-6 text-2xl font-semibold text-gray-1000">
        <img class="w-8 h-8 mr-2" src="../assets/logo.png" alt="logo">
        NOVA Lead
      </a>
      <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 ">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
            Connectez-Vous 
          </h1>
          <!-- Formulaire de connexion -->
          <form class="space-y-4 md:space-y-6" @submit.prevent="login">
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Your email</label>
              <input v-model="email" type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" placeholder="name@company.com" required />
            </div>
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Password</label>
              <input v-model="password" type="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" required />
            </div>
            <button type="submit" class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Connexion</button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { loginUser } from '@/services/authService';

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        const credentials = { email: this.email, password: this.password }
        const response = await loginUser(credentials);
        
        // Enregistrer le token dans le localStorage
        localStorage.setItem('token', response.token);

        this.$router.push('/dashboard');
      } catch (error) {
        // Gestion des erreurs de connexion
        console.error('Login failed:', error);
        alert('Échec de la connexion. Veuillez vérifier vos identifiants.');
      }
    }
  }
};
</script>
