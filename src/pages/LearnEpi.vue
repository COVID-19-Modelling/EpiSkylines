<template>
    <div class="row">
      <b-tabs class="col-12">
        <b-tab title="R0 and R(t)" active>
          <card title="Basic Reproduction Numbers and Effective Reproduction Numbers">

          </card>
        </b-tab>
        <b-tab title="Risk Perception">
          <markdown-card
              title="Risk Perception"
              :source="page2"></markdown-card>
        </b-tab>
      </b-tabs>
    </div>
</template>
<script>
  import { MarkdownCard, Card } from "@/components";

  export default {
    components: {
      MarkdownCard,
      Card
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
