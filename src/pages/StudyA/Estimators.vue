<template>
  <div class="row">
    <div class="col-md-6">
     <forest-v-card title="R0 vs. R(t)"
                    subTitle="t = 12th February"
                    :margin="margin" selected="R0" :entries="forest" :columns="['R0', 'R(t)']">
     </forest-v-card>
    </div>
    <div class="col-md-6">
      <forest-v-card title="beta vs. kappa"
                     subTitle="endogenous vs. exogenous infection"
                     :margin="margin" selected="beta" :entries="forest2" :columns="['beta', 'kappa']">
      </forest-v-card>
    </div>

    <div class="col-12">
      <card title="Parameter estimation" subTitle="based on Bass-SIR model">
        <div class="table-full-width table-responsive">
          <paper-table :data="estimators" :columns="columns">
          </paper-table>
        </div>
      </card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";
import { PaperTable, ForestVCard } from "@/components";

export default {
  name: "Estimators",
  components: {
    PaperTable,
    ForestVCard
  },
  data() {
    return {
      columns: ["Location", "m", "100kappa", "beta", "R0", "R(t)"],
      estimators: [],
      forest: [{Location: "Hubei", variable: "R0", mean: 1, lower: 0, upper: 2}],
      forest2: [{Location: "Hubei", variable: "m", mean: 1, lower: 0, upper: 2}],
      margin: {top: 10, right: 30, bottom: 50, left: 100},
    };
  },
  mounted() {
    this.fetchEstimators();
    window.addEventListener("resize", this.resize);
  },
  methods: {
    fetchEstimators() {
      axios.get("https://raw.githubusercontent.com/COVID-19-Modelling/Bass-COVID-19/master/Output/JSON/EpiIndices.json")
        .then(res => {
          this.forest = res.data.filter(d => ["R0", "R(t)"].indexOf(d.variable)  >= 0);
          this.forest2 = res.data.filter(d => ["m", "beta", "kappa"].indexOf(d.variable)  >= 0);

          this.estimators = Object.values(_.groupBy(res.data, d => d.Location))
            .map(v => {
              let ent = { location: v[0].Location};
              v.forEach(col => {
                switch(col.variable) {
                  case "kappa":
                    ent["100kappa"] = `${(100*col.mean).toFixed(1)} (${(100*col.lower).toFixed(1)} - ${(100*col.upper).toFixed(1)})`;
                    break;
                  case "beta":
                    ent["beta"] = `${col.mean.toFixed(2)} (${col.lower.toFixed(2)} - ${col.upper.toFixed(2)})`;
                    break;
                  case "m":
                    ent["m"] = `${col.mean.toFixed()} (${col.lower.toFixed()} - ${col.upper.toFixed()})`;
                    break;
                  case "R0":
                    ent["r0"] = `${col.mean.toFixed(2)} (${col.lower.toFixed(2)} - ${col.upper.toFixed(2)})`;
                    ent.key = col.mean;
                    break;
                  case "R(t)":
                    ent["r(t)"] = `${col.mean.toFixed(2)} (${col.lower.toFixed(2)} - ${col.upper.toFixed(2)})`;
                    break;
                }
              });
              return ent;
            }).sort((a, b) => b.key - a.key);
        });
    }
  }
}
</script>

<style scoped>

</style>
