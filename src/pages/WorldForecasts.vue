<template>
  <div class="row">
    <b-tabs class="col-12">
      <b-tab title="Recovery and Death rates" active>
        <rec-die :rawdata="rawData"></rec-die>
      </b-tab>
      <b-tab title="Force of infections" lazy>
        <div class="row">
          <div class="col-md-12">
            <markdown-card title="R(t)">
            </markdown-card>
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
  import { MarkdownCard } from "@/components/index";
  import RecDie from "./StudyB/RecDie";


  export default {
    name: "WorldForecasts",
    components: {
      MarkdownCard,
      RecDie
    },
    data() {
      return {
        rawData: {}
      }
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      fetchData() {

      }
    }
  }
</script>

<style scoped>

</style>
