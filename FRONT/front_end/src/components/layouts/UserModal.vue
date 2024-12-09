<template>
  <div>
    <!-- Modal Form -->
    <div
      v-if="!showDialog"
      tabindex="-1"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
    >
      <div class="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow">
        <div class="relative p-4">
          <div class="flex justify-between items-center pb-4 mb-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Ajouter Un Utilisateur</h3>
            <button
              @click="$emit('close')"
              class="text-red-600 hover:text-red-800 text-2xl"
              :disabled="isLoading"
            >
              &times;
            </button>
          </div>
          <!-- Modal body -->
          <form @submit.prevent="registerUser">
            <div class="grid gap-4 mb-4 sm:grid-cols-2">
              <div>
                <label for="name" class="block mb-2 text-sm font-medium text-gray-900">
                  Nom <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="user.name"
                  type="text"
                  id="name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  placeholder="Entrez votre nom"
                  required
                  :disabled="isLoading"
                />
              </div>
              <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900">
                  Email <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="user.email"
                  type="email"
                  id="email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  placeholder="Entrez votre email"
                  required
                  :disabled="isLoading"
                />
              </div>
              <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900">
                  Mot de Passe <span class="text-red-500">*</span> <br> <span class="text-red-500">Minimum 6 caractères</span>
                </label>
                <input
                  v-model="user.password"
                  type="password"
                  id="password"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  placeholder="Entrez votre mot de passe "
                  required
                  :disabled="isLoading"
                />
              </div>
              <div>
                <label for="contact" class="block mb-2 text-sm font-medium text-gray-900">
                  Contact <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="user.contact"
                  type="text"
                  id="contact"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  placeholder="Entrez votre contact"
                  required
                  :disabled="isLoading"
                />
              </div>

              
              <div>
                <label for="pays" class="block mb-2 text-sm font-medium text-gray-900">
                  Pays <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="user.pays"
                  id="pays"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  required
                  @change="loadCities(user.pays)" 
                >
                  <option value="" disabled hidden class="text-gray-500 opacity-50">
                    Veuillez sélectionner votre pays
                  </option>
                  <option v-for="country in countries" :key="country.code" :value="country.code">
                    {{ country.name }}
                  </option>
                </select>

                <label for="ville" class="block mb-2 text-sm font-medium text-gray-900 mt-4">
                  Ville <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="user.ville"
                  id="ville"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  required
                  :disabled="isLoadingCities" 
                  @focus="startLoadingCities"  
                >
                  <option value="" disabled hidden class="text-gray-500 opacity-50">
                    Veuillez sélectionner votre ville
                  </option>
                  <option v-for="city in cities" :key="city" :value="city">
                    {{ city }}
                  </option>
                </select>

                <!-- Affichage du spinner et du message de chargement uniquement si l'utilisateur clique -->
                <div v-if="isLoadingCities && !cities.length" class="mt-2 flex justify-center items-center text-sm text-gray-500">
                  <div class="w-6 h-6 border-4 border-green-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Les villes se chargent, veuillez patienter...
                </div>
              </div>


              <div>
                <label for="role" class="block mb-2 text-sm font-medium text-gray-900">
                  Role <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="user.role"
                  id="role"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  :disabled="isLoading"
                >
                  <option value="Client">Client</option>
                  <option value="Admin">Admin</option>
                  <option value="AgentSupport">Agent Support</option>
                </select>
              </div>
            </div>
            <div class="flex justify-center">
              <button
                type="submit"
                class="inline-flex items-center px-5 py-2.5 mt-4 text-sm font-medium text-black bg-green-300 rounded-lg hover:bg-green-800 disabled:opacity-50"
                :disabled="isLoading"
              >
                Ajouter l'utilisateur
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Spinner -->
    <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Dialog -->
    <div v-if="showDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white p-5 rounded-lg shadow-xl text-center">
        <div :class="['text-6xl mb-4', dialogType === 'success' ? 'text-green-500' : 'text-red-500']">
          <i v-if="dialogType === 'success'" class="fas fa-check-circle"></i>
          <i v-else class="fas fa-times-circle"></i>
        </div>
        <p class="text-xl mb-4">{{ dialogMessage }}</p>
        <button @click="closeDialog" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: '',
        contact: '',
        pays: '',
        ville: '',
        role: 'Client',
      },

      countries: [], 
      cities: [],
      isLoadingCities: false,

      isLoading: false, 
      showDialog: false,
      dialogMessage: '',
      dialogType: '',
    };
  },

  async created() {
    // Chargement des pays
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();
      this.countries = data.map((country) => ({
        name: country.name.common,
        code: country.cca2,
      }));
    } catch (error) {
      console.error("Erreur lors du chargement des pays :", error);
      this.countries = [];
    }
  },
  methods: {
      // Chargement des villes lors du changement de pays
  async loadCities(countryCode) {
    if (!countryCode) return;

     this.isLoadingCities = true;
    this.cities = []; // Réinitialiser la liste des villes

    try {
      const response = await fetch(
        `http://api.geonames.org/searchJSON?country=${countryCode}&featureClass=P&maxRows=1000&username=florentinoperez`
      );

      if (!response.ok) {
        console.error("Erreur dans la réponse de l'API :", response.status, response.statusText);
        throw new Error(`API GeoNames erreur : ${response.statusText}`);
      }

      const data = await response.json();
      this.cities = data.geonames.map((city) => city.name);
    } catch (error) {
      console.error("Erreur lors de la récupération des villes :", error);
      this.cities = [];
    } finally {
      this.isLoadingCities = false;
    }
  },

  // Fonction appelée lors du focus pour démarrer le chargement
  startLoadingCities() {
    if (!this.cities.length && !this.isLoading) {
      this.isLoading = true;
    }
  },

  // Fonction appelée lors du focus pour démarrer le chargement
  startLoadingCities() {
    if (!this.cities.length && !this.isLoadingCities) {
      this.isLoadingCities = true;
    }
  },

//enregistrement d'un user
    async registerUser() {
      this.isLoading = true;
      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.user),
        });

        if (response.ok) {
          this.dialogType = 'success';
          this.dialogMessage = 'Utilisateur enregistré avec succès';
          this.showDialog = true; // Affiche le popup
        } else {
          const errorData = await response.json();
          this.dialogType = 'error';
          this.dialogMessage = errorData.message || "Erreur d'enregistrement de l'utilisateur";
          this.showDialog = true; // Affiche le popup
        }
      } catch (error) {
        this.dialogType = 'error';
        this.dialogMessage = "Une erreur est survenue lors de l'enregistrement.";
        this.showDialog = true; // Affiche le popup
      } finally {
        this.isLoading = false;
        this.resetForm();
      }
    },
    closeDialog() {
      this.showDialog = false;
      this.$emit('close'); // Ferme le modal
    },
    resetForm() {
      this.user = {
        name: '',
        email: '',
        password: '',
        contact: '',
        pays: '',
        ville: '',
        role: 'Client',
      };
    },
  }
};
</script>
