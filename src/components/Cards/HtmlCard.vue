<template>
  <card>
    <template slot="header">
      <h4 v-if="$slots.title || title" class="card-title">
        <slot name="title">
          {{title}}
        </slot>
      </h4>
    </template>
    <div>
      <iframe src="/si_tw/Plot_EpiCurveConfirm.html" style="width: 100%; height: 400pt"></iframe>
    </div>
  </card>
</template>
<script>
  import Card from "./Card.vue";
  import axios from "axios";

  export default {
    name: "html-card",
    components: {
      Card
    },
    props: {
      footerText: {
        type: String,
        default: ""
      },
      title: {
        type: String,
        default: ""
      },
      subTitle: {
        type: String,
        default: ""
      },
      path: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        rawHTML: "<p>找不到啦! 是在 hello</p>"
      }
    },
    mounted() {
      axios.get("https://raw.githubusercontent.com/COVID-19-Modelling/DashboardData/master/Epi_plots/Plot_Incubation.html")
        .then(res => {
          this.rawHTML = res.data;
        });

    }
  };
</script>
<style>
</style>
