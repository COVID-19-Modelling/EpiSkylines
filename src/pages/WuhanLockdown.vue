<template>
  <div class="row">
    <b-tabs class="col-12">
      <b-tab title="Keys" active>
        <div class="row">
          <div class="col-md-8">
            <card>

            </card>
          </div>
          <div class="col-md-4">
            <markdown-card title="Serial Intervals in Taiwan" subTitle="from individual data"
                           :url="sourceKey">
            </markdown-card>
          </div>
        </div>
      </b-tab>
      <b-tab title="Estimators" lazy>
        <estimators></estimators>
      </b-tab>

      <b-tab title="Forecasts" lazy>
        <prevalence></prevalence>
      </b-tab>

      <b-tab title="The effect of lockdown" lazy>
        <lockdown></lockdown>
      </b-tab>
      <b-tab title="Methods" lazy>
        <div class="row">
          <div class="col-md-12">
            <markdown-card title="Benchmark epidemic of COVID-19" subTitle="after Wuhan's lockdown"
                           :url="sourceMethod">
            </markdown-card>
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
import Estimators from "./StudyA/Estimators";
import Prevalence from "./StudyA/Prevalence";
import Lockdown from "./StudyA/Lockdown";
import { MarkdownCard } from "@/components/index";

export default {
  components: {
    Estimators,
    Prevalence,
    Lockdown,
    MarkdownCard
  },
  props: {
    lang: {
      type: String,
      default: "en"
    }
  },
  data() {
    return {
      sourceKey: this.lang === "en"?
        "https://covid-19-modelling.github.io/DashboardData/Docs/Wuhan_Key_en.md":
        "https://covid-19-modelling.github.io/DashboardData/Docs/Wuhan_Key_en.md",
      sourceMethod: this.lang === "en"?
        "https://covid-19-modelling.github.io/DashboardData/Docs/Wuhan_Method_en.md":
        "https://covid-19-modelling.github.io/DashboardData/Docs/Wuhan_Method_en.md"
    };
  },
  watch: {
    lang() {

    }
  }
};
</script>
<style>
</style>
