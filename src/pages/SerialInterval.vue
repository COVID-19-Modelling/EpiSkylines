<template>
  <div class="row">
    <b-tabs class="col-12">
      <b-tab title="Serial Interval" active>
        <div class="row">
          <div class="col-md-5">
            <markdown-card title="A study of " subTitle="and more..."
                           url="https://covid-19-modelling.github.io/DashboardData/Docs/Serial_Interval_Main.md">
            </markdown-card>
          </div>
          <div class="col-md-7">
            <card>
              <iframe src="https://covid-19-modelling.github.io/DashboardData/Epi_plots/Plot_SI.html"
                      class="si-chart"></iframe>
            </card>
          </div>
        </div>
      </b-tab>

      <b-tab title="EpiCurves" lazy>
        <div class="row">
          <div class="col-md-6">
            <card title="Symptom onset">
              <iframe src="https://covid-19-modelling.github.io/DashboardData/Epi_plots/Plot_EpiCurveOnset.html"
                      class="si-chart"></iframe>
            </card>
          </div>
          <div class="col-md-6">
            <card title="Confirmed cases">
              <iframe src="https://covid-19-modelling.github.io/DashboardData/Epi_plots/Plot_EpiCurveConfirm.html"
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
    </b-tabs>
  </div>
</template>
<script>
  import { MarkdownCard } from "@/components/index";

  export default {
    components: {
      MarkdownCard
    }
  };
</script>
<style>
  .si-chart {
    width: 100%;
    height: 500pt;
  }
</style>
