<template>
  <div class="row">
    <div class="col-md-3">
      <loc-selector
          :locations="locations"
          :selected-location="selectedLocation"
          v-on:locchange="$emit('locchange', $event)"
          style="height: 400pt;">
      </loc-selector>
    </div>
    <div class="col-md-3" v-for="(chart, index) in charts" :key="index">
      <trajectory
          :title="chart.title"
          :sub-title="chart.subtitle"
          :chart-data="chart.data"
          :margin="margin"
      ></trajectory>
    </div>
  </div>
</template>

<script>
  import LocSelector from "./LocSelector";
  import Trajectory from "./Trajectory";

  export default {
    name: "FOI",
    components: {
      LocSelector,
      Trajectory
    },
    props: {
      rawdata: {
        type: Object,
        required: true
      },
      locations: {
        type: Array,
        required: true
      },
      selectedLocation: {
        type: String,
        default: "US"
      }
    },
    data() {
      return {
        charts: [
          {
            title: "Contact/transmission rate",
            data: { location: "", series: [] }
          },
          {
            title: "Exogenous effect of infection",
            subtitle: "",
            data: { location: "", series: [] }
          },
          {
            title: "Effective reproduction number",
            subtitle: "",
            data: { location: "", series: [] }
          }
          ],
        margin: {top: 10, right: 30, bottom: 70, left: 70}
      };
    },
    watch: {
      rawdata() {
        this.extractSeries()
      }
    },
    mounted() {
      this.extractSeries();
    },
    methods: {
      extractSeries() {
        ["beta", "kappa", "Rt"].forEach((key, i) => {
          let last = 0;

          this.charts[i].data = {
            location: this.rawdata.Location,
            series: this.rawdata.Estimates
              .map(ent => {
                return {
                  Date: ent.Date,
                  Value: ent.Indices.filter(d => d._row === key)[0]
                }
              }).filter(ent => ent.Value !== undefined)
              .map(ent => {
                ent.Sign = ent.Value.mean > last? "+": "-";
                last = ent.Value.mean;
                return ent;
              })
          };
        });
      }
    }
  }
</script>

<style scoped>

</style>
