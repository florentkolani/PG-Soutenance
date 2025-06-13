<template>
  <section class="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12">
    <!-- Toast Notification -->
    <Toast
      :show="showToast"
      :title="toastTitle"
      :message="toastMessage"
      :type="toastType"
      @close="showToast = false"
    />
    <div class="flex flex-col items-center justify-center px-6 mx-auto h-full lg:py-0">
      <!-- Logo et titre -->
      <a href="#" class="flex flex-col items-center mb-8 transform hover:scale-105 transition-transform duration-300">
        <img class="w-12 h-12 mb-2" src="../assets/logo.png" alt="logo">
        <span class="text-3xl font-bold text-gray-800 tracking-tight">NOVA LEAD</span>
      </a>

      <!-- Card de connexion -->
      <div
        class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform hover:shadow-2xl transition-all duration-300">
        <div class="p-8 space-y-6">
          <h1 class="text-2xl font-bold text-gray-900 text-center mb-2">
            Bienvenue
          </h1>
          <p class="text-center text-gray-600 text-sm mb-6">
            Connectez-vous à votre compte
          </p>

          <!-- Message d'erreur -->
          <div v-if="showAlert"
            class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center space-x-3 animate-shake">
            <i class="fas fa-exclamation-circle text-red-500"></i>
            <span class="text-red-800 text-sm">Échec de la connexion. Veuillez vérifier vos identifiants.</span>
            <button @click="resetError" class="text-red-500 hover:text-red-700 ml-auto">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Formulaire -->
          <form class="space-y-5" @submit.prevent="login">
            <div class="space-y-2">
              <label for="email" class="text-sm font-medium text-gray-700 block">Email</label>
              <div class="relative">
                <input v-model="email" type="email" id="email"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required />
                <p class="mt-1 text-sm text-gray-500">Exemple : nom@domaine.com</p>
              </div>
            </div>

            <div class="space-y-2">
              <label for="password" class="text-sm font-medium text-gray-700 block">Mot de passe</label>
              <div class="relative">
                <input :type="showPassword ? 'text' : 'password'" v-model="password" id="password"
                  class="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required />
                <button type="button" @click="togglePasswordVisibility"
                  class="absolute right-3 top-6 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
                <p class="mt-1 text-sm text-gray-500">6 caractères minimum avec lettres et chiffres</p>
              </div>
            </div>

            <div class="flex items-center justify-end">
              <a href="/ForgotPassword"
                class="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">
                Mot de passe oublié ?
              </a>
            </div>

            <button type="submit"
              class="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 focus:ring-4 focus:ring-green-200 font-medium transition-all duration-200 flex items-center justify-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>Se connecter</span>
              <!-- <i class="fas fa-arrow-right"></i> -->
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { loginUser } from '@/services/authService';
import axios from 'axios';
import { API_URL } from '@/services/config';
import Toast from '@/components/layouts/Toast.vue';

export default {
  name: 'LoginView',
  components: {
    Toast
  },
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      showAlert: false,
      showToast: false,
      toastTitle: '',
      toastMessage: '',
      toastType: 'success'
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    resetError() {
      this.showAlert = false;
      this.password = ''; // Reset le champ password
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
        const response = await axios.post(`${API_URL}/auth/login`, credentials);

        if (response && response.data && response.data.token) {
          localStorage.setItem('token', response.data.token);
          
          // Afficher le toast de succès
          this.showToast = true;
          this.toastTitle = 'Connexion réussie';
          this.toastMessage = 'Bienvenue ! Vous allez être redirigé...';
          this.toastType = 'success';

          if (response.data.mustChangePassword) {
            console.log("Première connexion - redirection vers la page de modification");
            setTimeout(() => {
              this.$router.push('/changePassword');
            }, 1000);
          } else {
            console.log("Connexion réussie - redirection vers le tableau de bord");
            setTimeout(() => {
              this.$router.push('/dashboard');
            }, 1000);
          }
        } else {
          console.error('Token manquant dans la réponse');
          this.showAlert = true;
        }
      } catch (error) {
        console.error('Login failed:', error);
        this.showAlert = true;
        this.password = ''; // Reset le password en cas d'erreur
        if (error.response) {
          console.error('Erreur de serveur:', error.response.data);
        }
      }
    }
  }
};
</script>

<style scoped>
@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-5px);
  }

  75% {
    transform: translateX(5px);
  }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
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

button:hover {
  opacity: 0.8;
}

button:active {
  transform: translateY(0);
}
</style>
