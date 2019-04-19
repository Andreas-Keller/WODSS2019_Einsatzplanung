<template>
  <div>
    <h1>Calendar of Project {{this.projectName}}</h1>
    <highcharts :options="this.chartOptions"></highcharts>
  </div>
</template>

<script>
import axios from 'axios';
import { Chart } from 'highcharts-vue';

const restHeader = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };


export default {
  name: 'Calendar',
  components: {
    highcharts: Chart,
  },
  props: {
    projectId: null,
    projectName: String,
  },
  data() {
    return {
      chartOptions: {
        title: this.projectId,
        chart: {
          type: 'area',
          spacingBottom: 30,
        },
        xAxis: {
          type: 'datetime',
          startOnTick: true,
          endOnTick: true,
        },
        plotOptions: {
          area: {
            stacking: 'normal',
            step: 'left',
          },
        },
        series: [{
          // data: [1,2,3] // sample data
          data: this.getValues(),
          name: 'Workload',
        }],
      },
    };
  },
  methods: {
    getValues() {
      const statistics = [];
      // eslint-disable-next-line
      axios.get(`${process.env.VUE_APP_API_SERVER}:${process.env.VUE_APP_API_PORT}/api/allocation`, restHeader)
        .then(response => response.data)
        .then((allocations) => {
          // eslint-disable-next-line
          allocations.sort(function (a, b) {
            return new Date(a.startDate) - new Date(b.startDate);
          });
          const sortedAllocations = [];
          let level = 0;
          allocations.forEach((entry) => {
            if (entry.projectId === this.projectId) {
              sortedAllocations.push([entry.startDate, entry.pensumPercentage, level, 'first']);
              sortedAllocations.push([entry.endDate, entry.pensumPercentage, level, 'last']);
              level += 1;
            }
          });
          // eslint-disable-next-line
          sortedAllocations.sort(function (a, b) {
            return new Date(a[0]) - new Date(b[0]);
          });
          level = 0;
          let pensum = 0;
          let endDate;
          sortedAllocations.forEach((entry) => {
            if (entry[3] === 'first') pensum += entry[1];
            else pensum -= entry[1];
            statistics.push({ x: (new Date(entry[0])).getTime(), y: pensum });
            if ((new Date(entry[0])).getTime() > endDate
              && level === entry[2]
              && (pensum - entry[3]) >= 0) {
              statistics.push({ x: (new Date(entry[0])).getTime() + 1, y: 0 });
            }
            // eslint-disable-next-line
            level = entry[2];
            endDate = (new Date(entry[0])).getTime();
          });
        })
        .then(() => {
          // eslint-disable-next-line
          statistics.sort(function (a, b) {
            return new Date(a[0]) - new Date(b[0]);
          });
        });
      return statistics;
    },
  },
};
</script>

<style scoped>

</style>
