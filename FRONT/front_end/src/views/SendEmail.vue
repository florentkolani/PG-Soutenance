<template>
  <div class="container mx-auto">
    <!-- Header Component -->
    <Header 
      title="NOVA LEAD" 
      primaryActionText="Envoyer un email" 
      @primaryAction="openEmailModal" 
      @filterAction="openFilterOptions" 
      @goToDashboard="redirectToDashboard"
    />

    <!-- List of sent emails -->
    <main class="container mx-auto px-4 py-4">
      <h1 class="text-2xl font-bold text-gray-800">Emails envoyés</h1>

      <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th class="border border-gray-300 px-4 py-2">Expéditeur</th> <!-- Add sender column -->
            <th class="border border-gray-300 px-4 py-2">Destinataires</th>
            <th class="border border-gray-300 px-4 py-2">Sujet</th>
            <th class="border border-gray-300 px-4 py-2">Date d'envoi</th>
            <th class="border border-gray-300 px-4 py-2">Actions</th>
           
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-normal">
          <tr v-for="email in sentEmails" :key="email._id" class="border-b border-gray-200 hover:bg-gray-100">
            <td class="border px-4 py-2">{{ email.senderName || email.sender }}</td> <!-- Fallback to sender if senderName is missing -->
            <td class="border px-4 py-2">
              {{ Array.isArray(email.recipients) ? email.recipients.length : 0 }} destinataire(s)
            </td>
            <td class="border px-4 py-2">{{ email.subject }}</td>
            <td class="border px-4 py-2 text-center">
              {{ new Date(email.sentAt).toLocaleString('fr-FR', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
              }) }}
            </td>
            <td class="border px-4 py-2 text-center">
              <button 
                class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                @click="showRecipientDetails(email)"
              >
                Détails
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </main>

    <!-- Recipient Details Modal -->
    <div v-if="showRecipientModal" class="fixed inset-0 bg-gray-900/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl mx-4 border border-gray-200">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Détails du Mail</h2>
          <button @click="closeRecipientModal" class="text-gray-500 hover:text-gray-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Libellé</th>
                <th scope="col" class="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Valeur</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Expéditeur</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ selectedEmail.senderName || selectedEmail.sender }}</td>
              </tr>
              <tr class="bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sujet</td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ selectedEmail.subject }}</td>
              </tr>
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Date d'envoi</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ new Date(selectedEmail.sentAt).toLocaleString('fr-FR', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                  }) }}
                </td>
              </tr>
              <tr class="bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Destinataires</td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-2">
                    <span v-for="recipient in selectedEmail.recipients" 
                          :key="recipient"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ recipient }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-6 flex justify-end">
          <button 
            @click="closeRecipientModal"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>

    <!-- Email Modal -->
    <EmailModal 
      v-if="showEmailModal"
      :showModal="showEmailModal" 
      @close="closeEmailModal"
    />
  </div>
</template>

<script>
import axios from 'axios';
import Header from "@/components/layouts/Header.vue";
import EmailModal from '@/components/layouts/EmailModal.vue';
import { API_URL } from '@/services/config';

export default {
  components: {
    Header,
    EmailModal
  },
  data() {
    return {
      sentEmails: [],
      showEmailModal: false,
      showRecipientModal: false,
      selectedEmail: null,
    };
  },
  methods: {
    async fetchSentEmails() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/emails/sent`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.sentEmails = response.data.emails || [];
      } catch (error) {
        console.error("Erreur lors de la récupération des emails envoyés :", error);
      }
    },
    openEmailModal() {
      this.showEmailModal = true; // Vérifiez que cette méthode est bien appelée
    },
    closeEmailModal() {
      this.showEmailModal = false; // Ferme le modal
    },
    openFilterOptions() {
      console.log("Options de filtrage ouvertes");
    },
    redirectToDashboard() {
      this.$router.push("/dashboard");
    },
    showRecipientDetails(email) {
      this.selectedEmail = email;
      this.showRecipientModal = true;
    },
    closeRecipientModal() {
      this.showRecipientModal = false;
      this.selectedEmail = null;
    },
  },
  created() {
    this.fetchSentEmails();
  }
};
</script>
