<template>
  <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
    <div class="bg-white rounded-lg p-6 w-1/3 shadow-md relative">
      <div class="flex justify-between items-center pb-4 mb-4 border-b">
        <h3 class="text-lg font-semibold text-gray-900">Ajoutez un nouveau pays</h3>
        <button @click="$emit('close')" class="text-red-600 hover:text-red-800 text-2xl">&times;</button>
      </div>
      <form @submit.prevent="save">
        <!-- Nom du pays -->
        <div class="mb-4">
          <label for="country-name" class="block text-sm font-medium text-gray-700 mb-2">Pays <span class="text-red-500">*</span></label>
          <input 
            id="country-name" 
            v-model="country.name" 
            type="text" 
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" 
            placeholder="Entrez le nom du pays" 
            required 
          />
        </div>
        <!-- Code du pays -->
        <div class="mb-4">
          <label for="country-code" class="block text-sm font-medium text-gray-700 mb-2">Code pays <span class="text-red-500">*</span></label>
          <input 
            id="country-code" 
            v-model="country.code" 
            type="text" 
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" 
            placeholder="Entrez le code du pays" 
            required 
          />
        </div>
        <!-- Boutons -->
        <div class="flex justify-center space-x-4">
          <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md shadow-md transition-all">
            Enregistrer
          </button>
          <button 
            @click.prevent="$emit('close')" 
            type="button" 
            class="bg-gray-500 hover:bg-gray-300 text-black px-6 py-2 rounded-md shadow-md transition-all">
            Annuler
          </button>
        </div>
      </form>
    </div>
  </div>
  <!-- Success and Error Dialogs -->
  <div v-if="successMessage" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
    <div class="bg-white rounded-lg p-6 w-1/3 shadow-md relative text-center">
      <h3 class="text-lg font-semibold text-green-700 text-center">Succès!</h3>
      <p>{{ successMessage }}</p>
      <button @click="successMessage = ''" class="bg-green-500 text-white px-4 py-2 mt-4 rounded-md">Fermer</button>
    </div>
  </div>
  <div v-if="errorMessage" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
    <div class="bg-white rounded-lg p-6 w-1/3 shadow-md relative text-center">
      <h3 class="text-lg font-semibold text-red-700">Erreur!</h3>
      <p>{{ errorMessage }}</p>
      <button @click="errorMessage = ''" class="bg-red-500 text-white px-4 py-2 mt-4 rounded-md">Fermer</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    country: {
      type: Object,
      default: () => ({ name: '', code: '' })
    }
  },
  emits: ['close', 'save'],
  data() {
    return {
      successMessage: '',
      errorMessage: '',
    };
  },
  methods: {
    save() {
      if (this.country.name && this.country.code) {
        this.$emit('save', this.country);
        this.$emit('close');  // Fermer le modal après la sauvegarde
      } else {
        this.errorMessage = 'Veuillez remplir tous les champs.';
      }
    }
  }
};
</script>

<style scoped>
/* Styles personnalisés */
</style>