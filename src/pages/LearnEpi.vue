<template>
    <div class="row">
      <b-tabs class="col-12">
        <b-tab title="R0 and R(t)" active>
          <markdown-card
              title="Basic Reproduction Numbers and Effective Reproduction Numbers"
              url="https://covid-19-modelling.github.io/DashboardData/Docs/Learn_R0Rt.md"></markdown-card>
        </b-tab>
        <b-tab title="Incidence and notification" lazy>
          <markdown-card
              title="Incidence and notification"
              url="https://covid-19-modelling.github.io/DashboardData/Docs/Learn_SerialInterval.md"></markdown-card>
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
  import { MarkdownCard } from "@/components";

  export default {
    components: {
      MarkdownCard
    },
    data() {
      return {
        page2: "### Hi",
        pages: []
      };
    }
  };
</script>
<style>
</style>
