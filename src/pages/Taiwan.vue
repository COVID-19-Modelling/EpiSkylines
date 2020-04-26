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
                      <p>{{ $t(stats.title) }}</p>
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
            <markdown-card :title="$t('title.si_tw')" subTitle="from individual data"
                           :url="sourceKey">
            </markdown-card>
          </div>
        </div>
      </b-tab>
      <b-tab :title="$t('misc.epicurve')" lazy>
        <div class="row">
          <div class="col-md-12">
            <html-card
                :title="$t('misc.epicurve')"
                url="https://covid-19-modelling.github.io/DashboardData/Epi_plots/Plot_EpiCurveOnset.html">
            </html-card>
          </div>
          <div class="col-md-12">
            <html-card
                :title="$t('indices.tot_confirmed')"
                url="https://covid-19-modelling.github.io/DashboardData/Epi_plots/Plot_EpiCurveConfirm.html">
            </html-card>
          </div>
        </div>
      </b-tab>
      <b-tab :title="$t('indices.si')" lazy>
        <div class="row">
          <div class="col-md-12">
            <html-card
                :title="$t('indices.si')"
                url="https://covid-19-modelling.github.io/DashboardData/Epi_plots/Plot_SI.html">
            </html-card>
          </div>
        </div>
      </b-tab>
      <b-tab :title="$t('indices.incu')" lazy>
        <div class="row">
          <div class="col-md-12">
            <html-card
                :title="$t('indices.incu')"
                url="https://covid-19-modelling.github.io/DashboardData/Epi_plots/Plot_Incubation.html">
            </html-card>
          </div>
        </div>
      </b-tab>
      <b-tab :title="$t('indices.o2t')" lazy>
        <div class="row">
          <div class="col-md-12">
            <html-card
                :title="$t('indices.do2t')"
                url="https://covid-19-modelling.github.io/DashboardData/Epi_plots/Plot_OnsetToTesting.html">
            </html-card>
          </div>
        </div>
      </b-tab>
      <b-tab :title="$t('title.dat_meth')" lazy>
        <div class="row">
          <div class="col-md-12">
            <markdown-card :title="$t('title.si_tw')" subTitle="from individual data"
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
            title: "indices.tot_confirmed",
            value: "0",
            footerText: "All time",
            footerIcon: "ti-time"
          },
          {
            type: "danger",
            icon: "ti-pulse",
            title: "indices.tot_deaths",
            value: "0/0",
            footerText: "All time",
            footerIcon: "ti-time"
          },
          {
            type: "info",
            icon: "ti-control-shuffle",
            title: "indices.si",
            value: "",
            footerText: "Weekly average with 95% credible interval",
            footerIcon: "ti-time"
          },
          {
            type: "success",
            icon: "ti-move",
            title: "indices.rt",
            value: "",
            footerText: "Weekly average with 95% confidence interval",
            footerIcon: "ti-time"
          },
          {
            type: "success",
            icon: "ti-cloud",
            title: "indices.imported2",
            value: "100%",
            footerText: "Average by 2 weeks",
            footerIcon: "ti-time"
          },
          {
            type: "danger",
            icon: "ti-search",
            title: "indices.yield2",
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

        axios.get("https://covid-19-modelling.github.io/DashboardData/CDC/key.json")
          .then(res => {
            const src = res.data;

            this.statsCards[0].value = src.Cases;
            this.statsCards[1].value = src.Deaths;

            this.statsCards[4].subvalue = `All time ${Math.round(src.Imported / (src.Cases) * 100)}% (${src.Imported}/${src.Cases})`;
            this.statsCards[5].subvalue = `All time ${Math.round((src.Cases) / (src.Test) * 1000)/10}% (${src.Test} tested)`;

            this.statsCards[4].value = `${Math.round(src.ImportedBi / (src.CasesBi) * 100)}% (${src.ImportedBi}/${src.CasesBi})`;
            this.statsCards[5].value = `${Math.round((src.CasesBi) / (src.TestBi) * 1000)/10}% (${src.TestBi} tested)`;
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
