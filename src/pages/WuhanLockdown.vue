<template>
  <div class="row">
    <b-tabs class="col-12">
      <b-tab title="Estimators" active>
        <estimators></estimators>
      </b-tab>

      <b-tab title="Forecasts" lazy>
        <prevalence></prevalence>
      </b-tab>


      <b-tab title="The effect of lockdown">

      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
import Estimators from "./StudyA/Estimators";
import Prevalence from "./StudyA/Prevalence";

export default {
  components: {
    Estimators,
    Prevalence
  }
};
</script>
<style>
</style>
