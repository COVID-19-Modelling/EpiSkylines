<template>
  <div class="row">
    <b-tabs class="col-12">
      <b-tab title="Estimators" active>
        <estimators></estimators>
      </b-tab>
      <b-tab title="The effect of lockdown">

      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
import Estimators from "./StudyA/Estimators";

export default {
  components: {
    Estimators
  }
};
</script>
<style>
</style>
