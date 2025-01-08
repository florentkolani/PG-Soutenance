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
              <!-- <div>
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
              </div> -->
              
              <!-- Sélecteur de pays avec label -->
              <div class="mb-4">
                <label for="pays" class="block text-sm font-medium text-gray-900 mb-2">
                  Pays <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="selectedCountryCode"
                  id="pays"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  required
                  @change="updateCountryName($event.target.value); loadCities($event.target.value)"
                >
                  <option value="default" disabled hidden>
                    Veuillez sélectionner votre pays
                  </option>
                  <option v-for="country in countries" :key="country.code" :value="country.code">
                    {{ country.name }}
                  </option>
                </select>
              </div>

              <!-- Sélecteur de villes avec label -->
              <div class="mb-4">
                <label for="ville" class="block text-sm font-medium text-gray-900 mb-2">
                  Ville <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="user.ville"
                  id="ville"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                  required
                  :disabled="isLoadingCities || !cities.length"
                >
                  <option value="" disabled hidden class="text-gray-500 opacity-50">
                    Veuillez sélectionner votre ville
                  </option>
                  <option v-for="city in cities" :key="city" :value="city">
                    {{ city }}
                  </option>
                </select>

                <div v-if="isLoadingCities" class="mt-2 flex items-center space-x-2">
                  <div class="w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span class="text-sm text-gray-500">En cours de chargement, veuillez patienter.</span>
                </div>


              </div>

              <div>
  <label for="contact" class="block mb-2 text-sm font-medium text-gray-900">
    Contact <span class="text-red-500">*</span>
  </label>
  <div class="flex">
    <!-- Input pour l'indicatif, en lecture seule -->
    <input
      type="text"
      :value="selectedCountryDialCode"
      class="bg-gray-50 border border-gray-300 text-gray-900 rounded-l-lg block w-1/4 p-2.5"
      disabled
    />
    <!-- Input pour le contact -->
    <input
      v-model="user.contact"
      type="text"
      id="contact"
      class="bg-gray-50 border border-gray-300 text-gray-900 rounded-r-lg block w-3/4 p-2.5"
      placeholder="Entrez votre contact"
      required
      :disabled="isLoading"
    />
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
       // password: '',
        contact: '',
        pays: '',
        ville: '',
        role: 'Client',
      },

      countries: [],
      cities: [],
      isLoadingCities: false,
      selectedCountryCode: "default",
      selectedCountryDialCode: "",

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
        dialCode: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ""),
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

    // Mise à jour du pays sélectionné avec son nom complet
    updateCountryName(countryCode) {
      const country = this.countries.find((c) => c.code === countryCode);
      if (country) {
        this.user.pays = country.name;
        this.selectedCountryDialCode = country.dialCode || ''; // Préremplit l'indicatif
      } else {
        this.user.pays = '';
        this.selectedCountryDialCode = '';
      }
    },

    // Fonction appelée lors du focus pour démarrer le chargement
    startLoadingCities() {
      if (!this.cities.length && !this.isLoading) {
        this.isLoading = true;
      }
    },

   // Enregistrement d'un utilisateur
async registerUser() {
  this.isLoading = true;

  // Récupère l'indicatif et le contact
  const indicatif = this.selectedCountryDialCode || ''; // Utilise la valeur de l'indicatif
  const contact = this.user.contact || '';  // Le contact saisi par l'utilisateur

  // Vérifie si l'indicatif et le contact sont renseignés
  if (!indicatif || !contact) {
    this.dialogType = 'error';
    this.dialogMessage = "Veuillez renseigner l'indicatif et le numéro de contact.";
    this.showDialog = true;
    this.isLoading = false;
    return;
  }

  // Concaténer l'indicatif et le numéro de téléphone
  const fullContact = `${indicatif}${contact}`;
  const userPayload = { ...this.user, contact: fullContact };

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userPayload),
    });

    if (response.ok) {
      this.dialogType = 'success';
      this.dialogMessage = 'Utilisateur enregistré avec succès';
      this.showDialog = true;
    } else {
      const errorData = await response.json();
      this.dialogType = 'error';
      this.dialogMessage = errorData.message || "Erreur d'enregistrement de l'utilisateur";
      this.showDialog = true;
    }
  } catch (error) {
    this.dialogType = 'error';
    this.dialogMessage = "Une erreur est survenue lors de l'enregistrement.";
    this.showDialog = true;
  } finally {
    this.isLoading = false;
    this.resetForm();
  }
}
,

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
      this.selectedCountryDialCode = '';
    },
  },
};
</script>
