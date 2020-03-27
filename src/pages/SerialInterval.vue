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
      <b-tab title="EpiCurves" lazy>
        <div class="row">
          <div class="col-md-12">
            <card title="Symptom onset">
              <iframe src="https://covid-19-modelling.github.io/DashboardData/Epi_plots/Plot_EpiCurveOnset.html"
                      class="si-chart"></iframe>
            </card>
          </div>
          <div class="col-md-12">
            <card title="Confirmed cases">
              <iframe src="https://covid-19-modelling.github.io/DashboardData/Epi_plots/Plot_EpiCurveConfirm.html"
                      class="si-chart"></iframe>
            </card>
          </div>
        </div>
      </b-tab>
      <b-tab title="Serial Interval" lazy>
        <div class="row">
          <div class="col-md-12">
            <card>
              <iframe src="https://covid-19-modelling.github.io/DashboardData/Epi_plots/Plot_SI.html"
                      class="si-chart"></iframe>
            </card>
          </div>
        </div>
      </b-tab>
      <b-tab title="Incubation time" lazy>
        <div class="row">
          <div class="col-md-6">
            <card title="Incubation time">
              <iframe src="https://covid-19-modelling.github.io/DashboardData/Epi_plots/Plot_Incubation.html"
                      class="si-chart"></iframe>
            </card>
          </div>
          <div class="col-md-6">
            <card title="Delay from symptom onset to testing">
              <iframe src="https://covid-19-modelling.github.io/DashboardData/Epi_plots/Plot_OnsetToTesting.html"
                      class="si-chart"></iframe>
            </card>
          </div>
        </div>
      </b-tab>
      <b-tab title="Methods" lazy>
        <div class="row">
          <div class="col-md-12">
            <markdown-card title="Serial Intervals in Taiwan" subTitle="from individual data"
                           :url="sourceMethod">
            </markdown-card>
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
  import { MarkdownCard } from "@/components/index";

  export default {
    components: {
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
          "https://covid-19-modelling.github.io/DashboardData/Docs/SerialInterval_Key_en.md":
          "https://covid-19-modelling.github.io/DashboardData/Docs/SerialInterval_Key_en.md",
        sourceMethod: this.lang === "en"?
          "https://covid-19-modelling.github.io/DashboardData/Docs/SerialInterval_Method_en.md":
          "https://covid-19-modelling.github.io/DashboardData/Docs/SerialInterval_Method_en.md"
      };
    },
    watch: {
      lang() {

      }
    }
  };
</script>
<style>
  .si-chart {
    width: 100%;
    height: 500pt;
  }
</style>
