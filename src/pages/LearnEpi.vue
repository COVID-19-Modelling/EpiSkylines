<template>
    <div class="row">
      <b-tabs class="col-12">
        <b-tab title="R0 and R(t)" active>
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
        }
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
