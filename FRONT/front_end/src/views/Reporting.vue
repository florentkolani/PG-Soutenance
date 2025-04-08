<template>
    <div class="container mx-auto">
    <!-- Header Component -->
    <Header 
      title="NOVA LEAD" 
      @goToDashboard="redirectToDashboard"
    />
  </div>

    <div class="p-6 space-y-8">
      <h1 class="text-2xl font-bold text-gray-800">📊 Tableau de bord - Statistiques</h1>
  
      <!-- Filters -->
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <div>
          <label for="startDate" class="block text-sm font-medium text-gray-700">Date de début</label>
          <input type="date" id="startDate" v-model="filters.startDate" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
        </div>
        <div>
          <label for="endDate" class="block text-sm font-medium text-gray-700">Date de fin</label>
          <input type="date" id="endDate" v-model="filters.endDate" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
        </div>
        <div>
          <label for="user" class="block text-sm font-medium text-gray-700">Utilisateur</label>
          <select id="user" v-model="filters.user" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            <option value="">Tous</option>
            <option v-for="user in users" :key="user._id" :value="user._id">{{ user.name }}</option>
          </select>
        </div>
        <div>
          <label for="role" class="block text-sm font-medium text-gray-700">Rôle</label>
          <select id="role" v-model="filters.role" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            <option value="">Tous</option>
            <option value="agentsupport">Agent Support</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700">Statut</label>
          <select id="status" v-model="filters.status" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            <option value="">Tous</option>
            <option value="open">Ouvert</option>
            <option value="closed">Fermé</option>
          </select>
        </div>
        <button @click="applyFilters" class="px-4 py-2 bg-blue-600 text-white rounded-md shadow">Filtrer</button>
      </div>

      <!-- Export Buttons -->
      <div class="flex gap-4 mt-4">
        <button @click="exportData('pdf')" class="px-4 py-2 bg-red-600 text-white rounded-md shadow">Exporter en PDF</button>
        <button @click="exportData('excel')" class="px-4 py-2 bg-green-600 text-white rounded-md shadow">Exporter en Excel</button>
      </div>
  
      <!-- Cartes Résumées -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl shadow p-4 text-center">
          <p class="text-gray-500">Utilisateurs</p>
          <h2 class="text-3xl font-bold text-green-600">{{ stats.totalUsers }}</h2>
        </div>
        <div class="bg-white rounded-2xl shadow p-4 text-center">
          <p class="text-gray-500">Tickets</p>
          <h2 class="text-3xl font-bold text-green-600">{{ stats.totalTickets }}</h2>
        </div>
        <div class="bg-white rounded-2xl shadow p-4 text-center">
          <p class="text-gray-500">Produits</p>
          <h2 class="text-3xl font-bold text-green-600">{{ stats.totalProduits }}</h2>
        </div>
        <div class="bg-white rounded-2xl shadow p-4 text-center">
          <p class="text-gray-500">Type de demande</p>
          <h2 class="text-3xl font-bold text-green-600">{{ stats.totalTypesDeDemande }}</h2>
        </div>
        <div class="bg-white rounded-2xl shadow p-4 text-center">
          <p class="text-gray-500">Notes</p>
          <h2 class="text-3xl font-bold text-green-600">{{ stats.totalNotes }}</h2>
        </div>
      </div>
  
      <!-- Graphique tickets par mois -->
      <div class="bg-white p-4 rounded-3xl shadow">
        <h2 class="text-xl font-semibold mb-4">📅 Tickets créés par mois</h2>
        <Bar :data="ticketsData" />
      </div>
  
      <!-- Graphique satisfaction -->
      <div class="bg-white p-4 rounded-2xl shadow w-full md:w-1/4">
        <h2 class="text-xl font-semibold mb-4">😊 Taux de satisfaction</h2>
        <Doughnut :data="satisfactionData" />
      </div>
    </div>
  </template>
  

<script setup>
import { ref, onMounted } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import { API_URL } from '@/services/config';
import Header from '@/components/layouts/Header.vue'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale)

const ticketsData = ref({
  labels: [],
  datasets: [{
    label: 'Tickets par mois',
    data: [],
    backgroundColor: '#22c55e' // Vert
  }]
})
const satisfactionData = ref({
  labels: ['Satisfaction', 'Manque'],
  datasets: [{
    data: [0, 100],
    backgroundColor: ['#10b981', '#e5e7eb']
  }]
})

const stats = ref({
  totalUsers: 0,
  totalTickets: 0,
  totalProduits: 0,
  totalTypesDeDemande: 0,
  totalNotes: 0
})

const filters = ref({
  startDate: '',
  endDate: '',
  user: '',
  role: '',
  status: ''
})

const users = ref([])

const applyFilters = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    const queryParams = new URLSearchParams(filters.value).toString();
    const [ticketsRes, satisfactionRes, statsRes, typesRes, notesRes] = await Promise.all([
      fetch(`${API_URL}/reporting/tickets-par-mois?${queryParams}`, { headers }),
      fetch(`${API_URL}/reporting/satisfaction?${queryParams}`, { headers }),
      fetch(`${API_URL}/reporting/totaux?${queryParams}`, { headers }),
      fetch(`${API_URL}/reporting/types-de-demande?${queryParams}`, { headers }),
      fetch(`${API_URL}/reporting/notes?${queryParams}`, { headers })
    ]);
    

    // ...existing code for processing responses...
  } catch (error) {
    console.error('Error applying filters:', error);
  }
}

const exportData = async (format) => {
  try {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    const queryParams = new URLSearchParams(filters.value).toString();
    const response = await fetch(`${API_URL}/reporting/export?format=${format}&${queryParams}`, { headers });

    if (!response.ok) throw new Error('Failed to export data');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporting.${format}`;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting data:', error);
  }
}

const redirectToDashboard = () => {
  this.$router.push("/dashboard");
};

onMounted(async () => {
  try {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    const headers = { Authorization: `Bearer ${token}` };

    const [ticketsRes, satisfactionRes, statsRes, typesRes, notesRes] = await Promise.all([
      fetch(`${API_URL}/reporting/tickets-par-mois`, { headers }),
      fetch(`${API_URL}/reporting/satisfaction`, { headers }),
      fetch(`${API_URL}/reporting/totaux`, { headers }),
      fetch(`${API_URL}/reporting/types-de-demande`, { headers }),
      fetch(`${API_URL}/reporting/notes`, { headers })
    ]);

    if (!ticketsRes.ok || !satisfactionRes.ok || !statsRes.ok || !typesRes.ok || !notesRes.ok) {
      throw new Error('Failed to fetch one or more API endpoints');
    }

    const tickets = await ticketsRes.json();
    ticketsData.value.labels = tickets.map(d => `M${d._id}`);
    ticketsData.value.datasets[0].data = tickets.map(d => d.count);

    const satisfaction = await satisfactionRes.json();
    satisfactionData.value.datasets[0].data = [
      Math.round(satisfaction.satisfaction * 20), // Ex: 4/5 * 100%
      100 - Math.round(satisfaction.satisfaction * 20)
    ];

    stats.value = await statsRes.json();
    stats.value.totalTypesDeDemande = (await typesRes.json()).totalTypesDeDemande;
    stats.value.totalNotes = (await notesRes.json()).totalNotes;
  } catch (error) {
    console.error('Error fetching reporting data:', error);
  }

  try {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };
    const usersRes = await fetch(`${API_URL}/users/all`, { headers });
    if (usersRes.ok) {
      users.value = await usersRes.json();
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
})

</script>

