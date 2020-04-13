<template>
  <div class="row">
    <div class="col-md-2">
      <card title="Location" subTitle="" style="height: 400pt;">

      </card>
    </div>
    <div class="col-md-5">
      <card title="Recovery rate"></card>
    </div>
    <div class="col-md-5">
      <card title="Death rate"></card>
    </div>
  </div>
</template>

<script>
  export default {
    name: "RecDie",
    props: {
      rawdata: {
        type: Object,
        required: true
      }
    },
  }
</script>

<style scoped>

</style>
