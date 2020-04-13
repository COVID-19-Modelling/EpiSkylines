<template>
    <div class="row">
      <b-tabs class="col-12">
        <b-tab :title="$t('class.indices')" active>
          <div class="row">
            <b-nav vertical class="col-md-3">
              <card title="Menu">
                  <b-nav-item
                      :id="page.title"
                      v-for="(page, index) in epiIndices"
                      :key="index"
                      v-on:click="activatePage('epiIndices', page)"
                      style="font-size: 22px; color: #0b2e13"
                  >{{ $t(page.title) }}</b-nav-item>
              </card>
            </b-nav>
            <div class="col-md-9">
              <html-card
                  :title="$t(activePages.epiIndices.title)"
                  :url="activePages.epiIndices.url[$i18n.locale]"></html-card>
            </div>
          </div>

        </b-tab>
        <b-tab title="R0 and R(t)" lazy>
          <div class="row">
            <div class="col-md-6">
            <html-card
                title="Basic Reproduction numbers"
                url="https://covid-19-modelling.github.io/DashboardData/Docs/Learn_R0_en.html"></html-card>

            </div>
            <div class="col-md-6">
              <markdown-card
                  title="Effective Reproduction Numbers"
                  :url="pages.Rt"></markdown-card>
            </div>
          </div>
        </b-tab>
        <b-tab title="Incidence and notification" lazy>

          <markdown-card
              title="Incidence and notification"
              :url="pages.SI"></markdown-card>
        </b-tab>
        <b-tab title="Risk Perception" lazy>
          <markdown-card
              title="Risk Perception"
              url="https://covid-19-modelling.github.io/DashboardData/Docs/Learn_Risk.md"></markdown-card>
        </b-tab>
      </b-tabs>
    </div>
</template>
<script>
  import { MarkdownCard, HtmlCard } from "@/components";

  export default {
    components: {
      MarkdownCard,
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
        pages: {
          R0: this.lang === "en"?
            "https://covid-19-modelling.github.io/DashboardData/Docs/Learn_R0_en.md":
            "https://covid-19-modelling.github.io/DashboardData/Docs/Learn_R0_en.md",
          Rt: this.lang === "en"?
            "https://covid-19-modelling.github.io/DashboardData/Docs/Learn_Rt_en.md":
            "https://covid-19-modelling.github.io/DashboardData/Docs/Learn_Rt_en.md",
          SI: this.lang === "en"?
            "https://covid-19-modelling.github.io/DashboardData/Docs/Learn_Rt_en.md":
            "https://covid-19-modelling.github.io/DashboardData/Docs/Learn_Rt_en.md",
        },
        epiIndices: [
          {
            title: "indices.r0",
            id: "r0",
            url: {
              en_UK: "https://covid-19-modelling.github.io/DashboardData/Docs/Learn_R0_en.html",
              zh_TW: "https://covid-19-modelling.github.io/DashboardData/Docs/Learn_R0_tw.html"
            }
          },
          {
            title: "indices.rt",
            id: "rt",
            url: {
              en_UK: "https://covid-19-modelling.github.io/DashboardData/Docs/Learn_Rt_en.html",
              zh_TW: "https://covid-19-modelling.github.io/DashboardData/Docs/Learn_Rt_tw.html"
            }
          }
        ],
        activePages: {
          epiIndices: "https://covid-19-modelling.github.io/DashboardData/Docs/Learn_R0_en.html"
        }
      };
    },
    mounted() {
      this.activatePage("epiIndices", this.epiIndices[0]);
    },
    methods: {
      activatePage(tab, page) {
        this.activePages[tab] = page;
      }
    }
  };
</script>
<style>
body {
  font-size: 20px;
}
</style>
