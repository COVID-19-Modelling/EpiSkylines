<template>
  <d3-card title="Monitor">

  </d3-card>
</template>

<script>
  import { D3Card } from "@/components";

  export default {
    name: "Monitor",
    components: {
      D3Card
    },
    props: {
      last: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        Records: [this.last],
        margin: { top: 10, right: 10, bottom: 50, left: 50 }
      }
    },
    watch: {
      last(rec1, rec0) {
        if (rec1.Time >= rec0.Time) {
          this.newRecord();
        } else {
          this.reset();
        }
      }
    },
    methods: {
      newRecord() {
        this.Records.push(this.last);
        this.update();
      },
      reset() {
        this.Records = [this.last];
        this.update();
      },
    }
  }
</script>

<style scoped>

</style>
