<template>
  <div class="row">
    <b-tabs class="col-12">
      <b-tab title="Keys" active>
        <div class="row">
          <div class="col-md-8">
            <card>
              <div class="row">
                <div class="col-md-6 col-xl-6" v-for="stats in statsCards" :key="stats.title">
                  <stats-card>
                    <div class="icon-big text-center" :class="`icon-${stats.type}`" slot="header">
                      <i :class="stats.icon"></i>
                    </div>
                    <div class="numbers" slot="content">
                      <p>{{stats.title}}</p>
                      {{stats.value}}
                    </div>
                    <div class="stats" slot="footer">
                      <i :class="stats.footerIcon"></i> {{stats.footerText}}
                    </div>
                  </stats-card>
                </div>
              </div>

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
  import { MarkdownCard, StatsCard } from "@/components/index";
  import axios from "axios";

  export default {
    components: {
      MarkdownCard,
      StatsCard
    },
    props: {
      lang: {
        type: String,
        default: "en"
      }
    },
    data() {
      return {
        statsCards: [
          {
            type: "warning",
            icon: "ti-pulse",
            title: "Total confirmed",
            value: "0",
            footerText: "All time",
            footerIcon: "ti-time"
          },
          {
            type: "danger",
            icon: "ti-pulse",
            title: "Total deaths/recovered",
            value: "0/0",
            footerText: "All time",
            footerIcon: "ti-time"
          },
          {
            type: "info",
            icon: "ti-control-shuffle",
            title: "Serial Interval",
            value: "",
            footerText: "Weekly average",
            footerIcon: "ti-time"
          },
          {
            type: "success",
            icon: "ti-move",
            title: "Effective reproduction number",
            value: "0",
            footerText: "Weekly average",
            footerIcon: "ti-time"
          },
          {
            type: "success",
            icon: "ti-cloud",
            title: "Import cases, weekly",
            value: "100%",
            footerText: "Weekly average",
            footerIcon: "ti-time"
          },
          {
            type: "danger",
            icon: "ti-search",
            title: "Test yield rate, weekly",
            value: "",
            footerText: "Weekly average",
            footerIcon: "ti-time"
          }
        ],
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
        this.sourceKey = this.lang === "en"?
          "https://covid-19-modelling.github.io/DashboardData/Docs/SerialInterval_Key_en.md":
          "https://covid-19-modelling.github.io/DashboardData/Docs/SerialInterval_Key_zh.md";
        this.sourceMethod = this.lang === "en"?
          "https://covid-19-modelling.github.io/DashboardData/Docs/SerialInterval_Method_en.md":
          "https://covid-19-modelling.github.io/DashboardData/Docs/SerialInterval_Method_zh.md";
      }
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      fetchData() {
        axios.get("https://covid-19-modelling.github.io/DashboardData/Epi_plots/KeyIndices.json")
          .then(res => {
            const src = res.data;

            this.statsCards[0].value = src.Confirmed.Total;
            this.statsCards[1].value = `${src.Deaths.Total}/${src.Recovered.Total}`;
            const si = src["Serial Interval"].Week;
            this.statsCards[2].value = `${si.mean} (${si.lower}-${si.upper})`;
            const rt = src.Rt.Week;
            this.statsCards[3].value = `${rt.mean} (${rt.lower}-${rt.upper})`;
            this.statsCards[4].value = src.PercentageImport.Week;
            const y = src.YieldRate.Week;
            this.statsCards[5].value = `${y.Yield} (${y.N_tested} tested)`;
          });
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
