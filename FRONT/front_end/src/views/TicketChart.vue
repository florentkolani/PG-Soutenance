<!-- TicketChart.vue -->
<template>
  <div class="chart-container">
    <canvas ref="ticketChart"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'TicketChart',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const ticketChart = ref(null);
    let chartInstance = null;

    const createChart = () => {
      if (chartInstance) {
        chartInstance.destroy();
      }

      if (ticketChart.value) {
  chartInstance = new Chart(ticketChart.value, {
    type: 'bar',
    data: {
      labels: ['En attente', 'Ouverts', 'En Cours', 'Clôturés'],
      datasets: [
        {
          label: 'Tickets',
          data: props.data,
          backgroundColor: ['#EAB308', '#3B82F6', '#F97316', '#22C55E'], 
          borderColor: ['#EAB308', '#3B82F6', '#F97316', '#22C55E'], 
          borderWidth: 1,
        },
      ],
    },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 1000,
              easing: 'easeInOutQuad'
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 20
                }
              }
            },
            plugins: {
              legend: {
                display: true,
                position: 'top'
              },
              title: {
                display: true,
                text: 'Distribution des Tickets par Statut'
              }
            }
          }
        });
      }
    };

    onMounted(() => {
      createChart();
    });

    watch(() => props.data, () => {
      createChart();
    }, { deep: true });

    return {
      ticketChart
    };
  }
};
</script>

<style scoped>
.chart-container {
  height: 400px;
  margin: 20px 0;
}
</style>
  