<template>
  <div class="dashboard-wrapper">
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
    <div id="report-container">
      <v-card elevation="8" class="chart-card">
        <div class="chart-wrapper">
          <h3 class="chart-title">Status Breakdown</h3>
          <apexchart
              width="100%"
              height="100%"
              type="pie"
              :options="statusPie.chartOptions"
              :series="statusPie.series"
          />
        </div>
      </v-card>
      <v-card elevation="8" class="chart-card">
        <div class="chart-wrapper">
          <h3 class="chart-title">On-Time Performance</h3>
          <apexchart
              width="100%"
              height="100%"
              type="pie"
              :options="onTimePie.chartOptions"
              :series="onTimePie.series"
          />
        </div>
      </v-card>
      <v-card elevation="8" id="line-chart">
        <h3 class="chart-title">On Time vs Late (Last 7 days)</h3>
        <apexchart
            type="line"
            width="100%"
            height="350"
            :options="previousWeek.chartOptions"
            :series="previousWeek.series"
        />
      </v-card>
      <v-card elevation="8" id="last-5">
        <h3 class="chart-title">Recent Orders</h3>
        <v-data-table :headers="recentOrders.headers" :items="recentOrders.data" items-per-page="5">
          <template v-slot:item.arrivalTime="{ item }">
            {{ formatDate(item.arrivalTime) }}
          </template>
          <template v-slot:item.departureTime="{ item }">
            {{ formatDate(item.departureTime) }}
          </template>
        </v-data-table>
      </v-card>
    </div>
  </div>
</template>


<script>
export default {
  name: "DashboardView",
  data() {
    return {
      recentOrders: {
        headers: [
          {title: 'ID', key: 'id', sortable: true, align: 'center'},
          {title: 'Customer', key: 'customer.name', sortable: true, align: 'center'},
          {title: 'Arrival Time', key: 'arrivalTime', sortable: true, align: 'center'},
          {title: 'Departure Time', key: 'departureTime', sortable: true, align: 'center'},
          {title: 'Safe To Load', key: 'safeToLoad', sortable: true, align: 'center'},
          {title: 'Keys Held', key: 'hasKeys', sortable: true, align: 'center'},
          {title: 'Status', key: 'status', sortable: true, align: 'center'},
          {title: 'On Time', key: 'onTime', sortable: true, align: 'center'},
        ],
        data: []
      },
      statusPie: {
        chartOptions: {
          labels: ["Not Arrived", "On Bay", "Completed"],
          chart: {
            type: 'pie'
          },
          legend: {
            position: 'bottom'
          },
          dataLabels: {
            formatter: val => `${val.toFixed(1)}%`
          }
        },
        series: []
      },
      onTimePie: {
        chartOptions: {
          labels: ["On Time", "Late"],
          chart: {
            type: 'pie'
          },
          legend: {
            position: 'bottom'
          },
          dataLabels: {
            formatter: val => `${val.toFixed(1)}%`
          }
        },
        series: [] // [5, 10] etc.
      },
      previousWeek: {
        chartOptions: {
          chart: {
            type: 'line'
          },
          xaxis: {
            type: 'datetime',
            categories: [],
            labels: {
              datetimeUTC: true,
              datetimeFormatter: {
                year: 'yyyy',
                month: "MMM 'yy",
                day: 'dd/MM/yyyy',
                hour: 'HH:mm',
                minute: 'HH:mm:ss',
                second: 'HH:mm:ss',
              }
            }
          },
          yaxis: {
            tickAmount: 1,
            min: 0
          }
        },
        series: []
      }
    }
  },
  async mounted() {
    await this.fetchStatusStatistics();
    await this.fetchOnTimeStatistics();
    await this.fetchPreviousWeek();
    await this.fetchRecent()
  },
  methods: {
    async fetchStatusStatistics() {
      this.statusPie.series = await this.$apiService.reports.fetchStatusStatistics();
    },
    async fetchOnTimeStatistics() {
      this.onTimePie.series = await this.$apiService.reports.fetchOnTimeStatistics();
    },
    async fetchPreviousWeek() {
      const previousWeek = await this.$apiService.reports.fetchPreviousWeek();
      this.previousWeek = {
        chartOptions: {
          chart: {
            id: "previous-week"
          },
          xaxis: {
            categories: previousWeek.labels
          }
        },
        series: [
          {
            name: 'On Time',
            data: previousWeek.series.onTime
          },
          {
            name: 'Late',
            data: previousWeek.series.late
          }
        ]
      };
    },
    async fetchRecent() {
      this.recentOrders.data = await this.$apiService.reports.fetchRecent();
    },
    formatDate(dateStr) {
      if (!dateStr) return 'N/A'
      const date = new Date(dateStr)
      return date.toLocaleString().replace(',', '');
    }
  }
}
</script>

<style scoped>

#report-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-template-rows: minmax(425px, 425px);
  row-gap: 40px !important;
  gap: 20px;
}

.chart-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: #fff;
  border-radius: 1rem;
  height: 100%;
}

#line-chart {
  grid-column: 3 / span 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
  background: #fff;
  border-radius: 1rem;
  height: 100%;
}

#last-5 {
  grid-column: 1 / span 4;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
  background: #fff;
  border-radius: 1rem;
  height: 100%;
}

.dashboard-wrapper {
  height: 100%;
  width: 100%;
}

.chart-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 25px;
}

.chart-title {
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
}

</style>