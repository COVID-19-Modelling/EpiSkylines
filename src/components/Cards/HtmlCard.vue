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
      <iframe :src="url" frameBorder="0"></iframe>
    </div>
  </card>
</template>
<script>
  import Card from "./Card.vue";

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
      url: {
        type: String,
        default: "https://covid-19-modelling.github.io/DashboardData/Epi_plots/Plot_Incubation.html"
      }
    }
  };
</script>
<style>
  iframe {
    overflow-y: auto;
    width: 100%;
    height: 500pt
  }
</style>
