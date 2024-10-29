<!-- TicketChart.vue -->
<template>
    <div>
      <canvas ref="ticketChart"></canvas>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
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
  
      onMounted(() => {
        if (ticketChart.value) {
          new Chart(ticketChart.value, {
            type: 'bar',
            data: {
              labels: ['Ouverts', 'En Cours', 'Résolus'],
              datasets: [
                {
                  label: 'Tickets',
                  data: props.data,
                  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                  borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                  
                }
              ]
            },
            options: {
              responsive: true,
              animation: {
                duration: 1000,
                easing: 'easeInOutQuad'
              }
            }
          });
        }
      });
  
      return {
        ticketChart
      };
    }
  };
  </script>
  
  <style scoped>
  /* Styles personnalisés si nécessaire */
  </style>
  