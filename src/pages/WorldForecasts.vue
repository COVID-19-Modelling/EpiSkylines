<template>
  <div class="row">
    <b-tabs class="col-12">
      <b-tab title="Recovery and Death rates" active>
        <rec-die :rawdata="selectedEpiIndices"
                 :locations="locations"
                 :selected-location="selectedLocation"
                 v-on:locchange="changeLocation($event)"></rec-die>
      </b-tab>
      <b-tab title="Force of infections" lazy>
      <f-o-i :rawdata="selectedEpiIndices"
             :locations="locations"
             :selected-location="selectedLocation"
             v-on:locchange="changeLocation($event)"></f-o-i>
      </b-tab>
      <b-tab title="Interpretations" lazy>
        <markdown-card title="Interpretation of the indices">

        </markdown-card>
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
  import { MarkdownCard } from "@/components/index";
  import RecDie from "./StudyB/RecDie";
  import FOI from "./StudyB/FOI";
  import axios from "axios";

  export default {
    name: "WorldForecasts",
    components: {
      MarkdownCard,
      RecDie,
      FOI
    },
    data() {
      return {
        locations: [],
        epiIndices: {},
        selectedLocation: "US",
        selectedEpiIndices: {}
      }
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      fetchData() {
        axios.get("https://covid-19-modelling.github.io/End-COVID-19/Output/EpiIndices.json")
          .then(res => {
            this.locations = Object.values(res.data)
              .filter(d =>{ return d.Estimates.filter(ent => ent.Indices !== undefined).length > 5})
              .map(d => d.Location);
            this.epiIndices = res.data;
            this.selectedEpiIndices = res.data[this.selectedLocation];
          });
      },
      changeLocation(loc) {
        this.selectedLocation = loc;
        this.selectedEpiIndices = this.epiIndices[this.selectedLocation];
      }
    }
  }
</script>

<style scoped>

</style>
