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
                      <span>{{stats.value}}</span><br>
                      <span class="subvalue" v-if="stats.subvalue !== undefined">{{ stats.subvalue }}</span>
                    </div>
                    <div class="stats" slot="footer">
                      <i :class="stats.footerIcon"></i> {{stats.footerText}}
                    </div>
                  </stats-card>
                </div>
              </div>
              <div slot="footer">
                The surveillance data are synchronised
                <a href="https://sites.google.com/cdc.gov.tw/2019ncov/taiwan?authuser=0" target="_blank">Taiwan CDC dashboard</a>
                Case sources and test yield rates might be delayed due to epidemic investigations
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
            <html-card
                title="Epidemic curve"
                url="https://covid-19-modelling.github.io/DashboardData/Epi_plots/Plot_EpiCurveOnset.html">
            </html-card>
          </div>
          <div class="col-md-12">
            <html-card
                title="Confirmed cases"
                url="https://covid-19-modelling.github.io/DashboardData/Epi_plots/Plot_EpiCurveConfirm.html">
            </html-card>
          </div>
        </div>
      </b-tab>
      <b-tab title="Serial Interval" lazy>
        <div class="row">
          <div class="col-md-12">
            <html-card
                title="Confirmed cases"
                url="https://covid-19-modelling.github.io/DashboardData/Epi_plots/Plot_SI.html">
            </html-card>
          </div>
        </div>
      </b-tab>
      <b-tab title="Incubation time" lazy>
        <div class="row">
          <div class="col-md-12">
            <html-card
                title="Confirmed cases"
                url="https://covid-19-modelling.github.io/DashboardData/Epi_plots/Plot_Incubation.html">
            </html-card>
          </div>
        </div>
      </b-tab>
      <b-tab title="Symptom onset to Testing" lazy>
        <div class="row">
          <div class="col-md-12">
            <html-card
                title="Delay from symptom onset to testing"
                url="https://covid-19-modelling.github.io/DashboardData/Epi_plots/Plot_OnsetToTesting.html">
            </html-card>
          </div>
        </div>
      </b-tab>
      <b-tab title="Data and Methodology" lazy>
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
  import { MarkdownCard, StatsCard, HtmlCard } from "@/components/index";
  import axios from "axios";

  export default {
    components: {
      MarkdownCard,
      StatsCard,
      HtmlCard
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
            title: "Total deaths",
            value: "0/0",
            footerText: "All time",
            footerIcon: "ti-time"
          },
          {
            type: "info",
            icon: "ti-control-shuffle",
            title: "Serial Interval",
            value: "",
            footerText: "Weekly average with 95% credible interval",
            footerIcon: "ti-time"
          },
          {
            type: "success",
            icon: "ti-move",
            title: "Effective reproduction number",
            value: "",
            footerText: "Weekly average with 95% confidence interval",
            footerIcon: "ti-time"
          },
          {
            type: "success",
            icon: "ti-cloud",
            title: "Imported cases, last two weeks",
            value: "100%",
            footerText: "Average by 2 weeks",
            footerIcon: "ti-time"
          },
          {
            type: "danger",
            icon: "ti-search",
            title: "Test yield rate, last two weeks",
            value: "",
            footerText: "Average by 2 weeks",
            footerIcon: "ti-time"
          }
        ],
        sourceKey: this.lang === "en"?
          "https://covid-19-modelling.github.io/DashboardData/Docs/SerialInterval_Key_en.md":
          "https://covid-19-modelling.github.io/DashboardData/Docs/SerialInterval_Key_zh.md",
        sourceMethod: this.lang === "en"?
          "https://covid-19-modelling.github.io/DashboardData/Docs/SerialInterval_Method_en.md":
          "https://covid-19-modelling.github.io/DashboardData/Docs/SerialInterval_Method_zh.md"
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

            const si = src["Serial Interval"].Week;
            this.statsCards[2].value = `${si.mean} (${si.lower}-${si.upper})`;
            //const rt = src.Rt.Week;
            //this.statsCards[3].value = `${rt.mean} (${rt.lower}-${rt.upper})`;
            // this.statsCards[4].value = src.PercentageImport.Week;
          });

        axios.get("https://covid19dashboard.cdc.gov.tw/dash3")
          .then(res => {
            const src = res.data[0];
            this.statsCards[0].value = src.確診;
            this.statsCards[1].value = src.死亡;
          });

        axios.all([
          axios.get("https://covid19dashboard.cdc.gov.tw/dash4"),
          axios.get("https://covid19dashboard.cdc.gov.tw/dash5")
        ]).then(tables => {
          const now = new Date();

          let res = Object.values(tables[1].data);
          let tests = Object.values(tables[0].data);

          res = res.filter(d => {
            let time = d["發病日"].split("/");
            time = new Date(2020, + time[0] - 1, time[1]);
            return now > time;
          });

          tests = tests.filter(d => {
            let time = d["通報日"].split("/");
            time = new Date(2020, + time[0] - 1, time[1]);
            return now > time;
          });

          let out = res.reduce((a, b) => a + b.境外移入, 0), dom = res.reduce((a, b) => a + b.本土感染, 0);
          let tested = tests.reduce((a, b) => a + b.Total, 0);
          this.statsCards[4].subvalue = `All time ${Math.round(out / (dom + out) * 100)}% (${out}/${dom + out})`;
          this.statsCards[5].subvalue = `All time ${Math.round((dom + out) / (tested) * 1000)/10}% (${tested} tested)`;

          res = res.slice(-14); tests = tests.slice(-14);

          out = res.reduce((a, b) => a + b.境外移入, 0); dom = res.reduce((a, b) => a + b.本土感染, 0);
          tested = tests.reduce((a, b) => a + b.Total, 0);
          this.statsCards[4].value = `${Math.round(out / (dom + out) * 100)}% (${out}/${dom + out})`;
          this.statsCards[5].value = `${Math.round((dom + out) / (tested) * 1000)/10}% (${tested} tested)`;
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
  .subvalue {
    font-size: 70%;
  }
</style>
