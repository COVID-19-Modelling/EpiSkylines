<template>
  <div class="row">
    <div class="col-md-3">
      <controller :status="status"
                  :parameters="model.AllParameters"
                  :parametersInUse="model.ParameterList"
                  v-on:parchange="changeParameters($event)"></controller>
    </div>
    <div class="col-md-6">
      <monitor :series="results" :states="model.AllStates" :statesInUse="model.StateList"></monitor>
    </div>
    <div class="col-md-3">
      <markdown-card title="Model description">
      </markdown-card>
    </div>
  </div>

</template>

<script>
import Controller from "./Controller";
import Monitor from "./Monitor";
import { MarkdownCard } from "@/components";
import { SIR, SEIR } from "@/models/model";

export default {
  name: "WarmUp",
  components: {
    Controller,
    Monitor,
    MarkdownCard
  },
  data() {
    return {
      status: "waiting",
      input: "",
      model: new SIR(),
      requests: 0,
      results: [],
      margin: {top: 10, right: 50, bottom: 50, left: 100},
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {

    },
    changeParameters(evt) {
      this.requests += 1;
      if (evt.structure.indexOf("lat") >= 0) {
        this.model = new SEIR();
      } else {
        this.model = new SIR();
      }
      this.input = evt;
      this.results = this.model.simulate(evt.parameters, [900, 90, 10], 15, 6);
      //this.model = new SIR();
    }
  }
}
</script>

<style scoped>

</style>
