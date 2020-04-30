<template>
  <div class="row">
    <b-tabs class="col-12">
      <b-tab :title="$t('title.dat_meth')" lazy>
        <div class="row">
          <div class="col-md-12">
            <html-card
                title="Benchmark epidemic of COVID-19" subTitle="after Wuhan's lockdown"
                :url="sourceMethod[$i18n.locale]"></html-card>
          </div>
        </div>
      </b-tab>
      <b-tab :title="$t('stats.est')" lazy>
        <estimators></estimators>
      </b-tab>

      <b-tab :title="$t('stats.fore')" lazy>
        <prevalence></prevalence>
      </b-tab>

      <b-tab :title="$t('title.eva_lock')" lazy>
        <lockdown></lockdown>
      </b-tab>
      <b-tab :title="$t('title.key')" active>
        <div class="row">
          <div class="col-md-7">
            <html-card
                title="Abstract"
                :url="sourceAbstract[$i18n.locale]"></html-card>
          </div>
          <div class="col-md-5">
            <html-card
                :title="$t('title.key')"
                :url="sourceKey[$i18n.locale]"></html-card>
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
import Estimators from "./StudyA/Estimators";
import Prevalence from "./StudyA/Prevalence";
import Lockdown from "./StudyA/Lockdown";
import { HtmlCard } from "@/components/index";

export default {
  components: {
    Estimators,
    Prevalence,
    Lockdown,
    HtmlCard
  },
  data() {
    return {
      sourceKey: {
        en_UK: `https://covid-19-modelling.github.io/DashboardData/Studies/Wuhan_Key_en.html`,
        zh_TW: `https://covid-19-modelling.github.io/DashboardData/Studies/Wuhan_Key_tw.html`
      },
      sourceAbstract: {
        en_UK: `https://covid-19-modelling.github.io/DashboardData/Studies/Wuhan_Abstract_en.html`,
        zh_TW: `https://covid-19-modelling.github.io/DashboardData/Studies/Wuhan_Abstract_en.html`
      },
      sourceMethod: {
        en_UK: "https://covid-19-modelling.github.io/DashboardData/Studies/Wuhan_Method_en.html",
        zh_TW: "https://covid-19-modelling.github.io/DashboardData/Studies/Wuhan_Method_tw.html"
      }
    };
  }
};
</script>
<style>
</style>
