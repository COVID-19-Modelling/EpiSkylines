<template>
  <div>
    <div class="row">
      <div class="col-md-2 col-12">
        <controller></controller>
        <card title="Indices"></card>
      </div>
      <div class="col-md-6 col-12">
        <card title="Grid"></card>
      </div>
      <div class="col-md-4 col-12">
        <monitor></monitor>
      </div>
    </div>
  </div>
</template>

<script>
  import Controller from "./Screening/Controller";
  import Monitor from "./Screening/Monitor";


  export default {
    name: "Screening",
    components: {
      Monitor,
      Controller
    }
  }
</script>

<style scoped>

</style>
