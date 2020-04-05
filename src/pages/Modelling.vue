<template>
  <div class="row">
    <b-tabs class="col-12">
      <b-tab title="Keys" active>
        <warm-up></warm-up>
      </b-tab>

      <b-tab title="Methods" lazy>
        <div class="row">
          <div class="col-md-12">
            <markdown-card title="Benchmark epidemic of COVID-19">
            </markdown-card>
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
import { MarkdownCard } from "@/components/index";
import WarmUp from "./Modelling/WarmUp";


export default {
  components: {
    MarkdownCard,
    WarmUp
  },
  props: {
    lang: {
      type: String,
      default: "en"
    }
  },
  data() {
    return {
      status: "waiting",
      input: ""
    }
  },
  watch: {
    lang() {

    }
  },
  methods: {

  }
};
</script>
<style>
</style>
