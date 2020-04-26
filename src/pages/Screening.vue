<template>
  <div>
    <div class="row">
      <div class="col-md-2 col-12">
        <controller
            :state="State"
            :nrow="nrow"
            :ninf="ninf"
            :test_cap="test_cap"
            :parameters="Model.Parameters"
            v-on:click="findEvent($event)"
            v-on:parchange="changeParameters($event)"></controller>
        <card title="Indices">{{ Record }}</card>
      </div>
      <div class="col-md-6 col-12">
        <grid :agents="Agents"
              :nrow="nrow"
              :visible="Model.VisibleStates"></grid>
      </div>
      <div class="col-md-4 col-12">
        <monitor :last="Record"></monitor>
      </div>
    </div>
  </div>
</template>

<script>
  import Controller from "./Screening/Controller";
  import Monitor from "./Screening/Monitor";
  import Grid from "./Screening/Grid";
  import { COVID } from "./Screening/Gol.js";


  export default {
    name: "Screening",
    components: {
      Monitor,
      Controller,
      Grid
    },
    data() {
      const model = new COVID();
      return {
        State: "stop",
        Timer: null,
        Parameters: model.defaultParameters,
        nrow: 20,
        ninf: 5,
        test_cap: 10,
        Record: model.summarise(0.1),
        Model: model,
        Agents: []
      };
    },
    mounted() {
      this.reset();
    },
    methods: {
      findEvent(e) {
        switch (e) {
          case "start":
            this.start();
            break;
          case "stop":
            this.stop();
            break;
          case "step":
            this.stop();
            this.step();
            break;
          case "reset":
            this.stop();
            this.reset();
            break;
        }
      },
      changeParameters(evt) {
        this.nrow = evt.nrow;
        this.ninf = evt.ninf;

        Object.assign(this.Parameters, evt);
        delete this.Parameters.nrow;
        delete this.Parameters.ninf;
        this.reset();
      },
      reset() {
        this.Model.initAgents(this.Parameters, this.nrow, this.ninf);
        this.Record = this.Model.summarise(0);
        this.Agents = Object.values(this.Model.Agents);
      },
      start() {
        if (this.State === "running") return;
        this.State = "running";
        this.Timer = setInterval(this.step, 1000);
      },
      stop() {
        this.State = "stop";
        clearInterval(this.Timer);
      },
      step() {
        this.Model.update(this.Parameters, this.Record.Time, this.Record.Time + 0.5);
        this.Model.TestRemain = this.test_cap;
        this.Model.update(this.Parameters, this.Record.Time + 0.5, this.Record.Time + 1);
        this.Record = this.Model.summarise(this.Record.Time + 1);
        this.Agents = Object.values(this.Model.Agents);
      }
    }
  }
</script>

<style scoped>

</style>
