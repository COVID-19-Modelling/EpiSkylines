<template>
  <div class="row">
    <div class="col-md-3">
      <controller :status="status"
                  :parameters="model.AllParameters"
                  :parametersInUse="model.ParameterList"
                  :locations="locations"
                  v-on:locchange="changeLocation($event)"
                  v-on:parchange="changeParameters($event)"></controller>
    </div>
    <div class="col-md-6">
      <monitor :dataPoints="selected"
               :series="results"
               :states="model.AllStates"
               :statesInUse="model.StateList"></monitor>
    </div>
    <div class="col-md-3">
      <html-card title="Model specification" :url="doc_url"></html-card>
    </div>
  </div>
</template>

<script>
import Controller from "./Controller";
import Monitor from "./Monitor";
import { HtmlCard } from "@/components";
import { SIR, SEIR } from "@/models/model";

export default {
  name: "WarmUp",
  components: {
    Controller,
    Monitor,
    HtmlCard
  },
  props: {
    rawdata: {
      type: Object,
      required: true
    }
  },
  data() {
    const sel = "US";

    return {
      status: "waiting",
      model: new SIR(this.rawdata[sel]),
      structure: [],
      parameters: {},
      requests: 0,
      results: [],
      location: sel,
      selected: this.rawdata[sel],
      doc_url: "./docs/modelling_sir.md",
      margin: { top: 10, right: 50, bottom: 50, left: 100 },
    };
  },
  computed: {
    locations() {
      return Object.values(this.rawdata)
        .sort((a, b) => b[13].Infectious - a[13].Infectious)
        .map(d => d[0].Location);
    }
  },
  watch: {
    rawdata() {
      this.selected = this.rawdata[this.location];
      this.rebuildModel(this.structure);
    }
  },
  methods: {
    changeParameters(evt) {
      this.requests += 1;
      this.structure = evt.structure;
      this.parameters = evt.parameters;
      this.rebuildModel(this.structure);
    },
    changeLocation(evt) {
      this.location = evt;
      this.selected = this.rawdata[evt];
      this.rebuildModel(this.structure);
    },
    rebuildModel(structure) {
      if (structure.indexOf("lat") >= 0) {
        this.model = new SEIR(this.selected);
        this.doc_url = "https://covid-19-modelling.github.io/DashboardData/Models/ModelSEIR.html";
      } else {
        this.model = new SIR(this.selected);
        this.doc_url = "https://covid-19-modelling.github.io/DashboardData/Models/ModelSIR.html";
      }
      this.results = this.model.simulate(this.parameters, 15, 6);
    }
  }
}
</script>

<style scoped>

</style>
