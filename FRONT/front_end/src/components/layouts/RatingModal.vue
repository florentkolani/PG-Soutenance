<template>
  <div>
    <!-- Modal de notation -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded shadow-lg w-96 relative">
        <button @click="close" class="absolute top-2 right-2 text-red-600 hover:text-red-800 text-2xl">&times;</button>
        <h2 class="text-lg font-bold mb-4 text-center">Noter le ticket</h2>
        <form @submit.prevent="submitRating">
          <div class="mb-4">
            <label class="block text-gray-700">Note:</label>
            <select v-model="rating.note" required class="border rounded p-2 w-full">
              <option value="" disabled selected>Choisissez une note</option>
              <option value="Médiocre">Médiocre</option>
              <option value="Passable">Passable</option>
              <option value="Satisfait">Satisfait</option>
              <option value="Très Satisfait">Très Satisfait</option>
            </select>
          </div>
          <div v-if="rating.note === 'Médiocre' || rating.note === 'Passable'" class="mb-4">
            <label class="block text-gray-700">Commentaire:</label>
            <textarea v-model="rating.commentaire" required class="border rounded p-2 w-full"></textarea>
          </div>
          <div class="flex justify-center">
            <button type="submit" class="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800" :disabled="alreadyRated">
              Soumettre
            </button>
            <button @click="close" type="button" class="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Alert Dialog -->
    <div v-if="showAlert" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div class="bg-white p-4 rounded shadow-lg w-80 text-center">
        <p class="text-lg font-semibold" :class="alertType === 'success' ? 'text-green-600' : 'text-red-600'">
          {{ alertMessage }}
        </p>
        <button @click="showAlert = false" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          OK
        </button>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    showModal: Boolean,
    ticketId: String,
    alreadyRated: Boolean, 
  },
  data() {
    return {
      rating: {
        note: '',
        commentaire: '',
      },
      showAlert: false,
      alertMessage: '',
      alertType: 'success', 
    };
  },
  methods: {
    submitRating() {
      if (this.alreadyRated) {
        this.showError("Vous avez déjà noté ce ticket.");
        return;
      }
      this.$emit('submitRating', { ...this.rating, ticketId: this.ticketId });
      this.showSuccess("Merci pour votre note!");
      this.close();
    },
    close() {
      this.$emit('close');
      this.rating.note = '';
      this.rating.commentaire = '';
    },
    showSuccess(message) {
      this.alertType = 'success';
      this.alertMessage = message;
      this.showAlert = true;
    },
    showError(message) {
      this.alertType = 'error';
      this.alertMessage = message;
      this.showAlert = true;
    },
  },
};
</script>

<style scoped>
/* Ajoutez des styles si nécessaire */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
</style>
