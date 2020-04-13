<template>
    <div class="row">
      <b-tabs class="col-12">
        <b-tab :title="$t('class.indices')" active>
          <div class="row">
            <b-nav vertical class="col-md-3">
              <card title="Menu">
                  <b-nav-item
                      :id="page.title"
                      v-for="(page, index) in epiIndices"
                      :key="index"
                      v-on:click="activatePage('epiIndices', page)"
                      style="font-size: 22px; color: #0b2e13"
                  >{{ $t(page.title) }}</b-nav-item>
              </card>
            </b-nav>
            <div class="col-md-9">
              <html-card
                  :title="$t(activePages.epiIndices.title)"
                  :url="activePages.epiIndices.url[$i18n.locale]"></html-card>
            </div>
          </div>
        </b-tab>
        <b-tab :title="$t('class.actions')" lazy>
          <div class="row">
            <b-nav vertical class="col-md-3">
              <card title="Menu">
                <b-nav-item
                    :id="page.title"
                    v-for="(page, index) in actions"
                    :key="index"
                    v-on:click="activatePage('actions', page)"
                    style="font-size: 22px; color: #0b2e13"
                >{{ $t(page.title) }}</b-nav-item>
              </card>
            </b-nav>
            <div class="col-md-9">
              <html-card
                  :title="$t(activePages.actions.title)"
                  :url="activePages.actions.url[$i18n.locale]"></html-card>
            </div>
          </div>
        </b-tab>
      </b-tabs>
    </div>
</template>
<script>
  import { HtmlCard } from "@/components";

  const get_page = function(key, id) {
    return {
      title: key,
      id: id,
      url: {
        en_UK: `https://covid-19-modelling.github.io/DashboardData/Docs/Learn_${ id }_en.html`,
        zh_TW: `https://covid-19-modelling.github.io/DashboardData/Docs/Learn_${ id }_tw.html`
      }
    };
  };

  export default {
    components: {
      HtmlCard
    },
    data() {
      return {
        epiIndices: [
          get_page("indices.r0", "R0"),
          get_page("indices.rt", "Rt")
        ],
        actions: [
          get_page("actions.soc_dist", "R0")
        ],
        activePages: {
          epiIndices: "https://covid-19-modelling.github.io/DashboardData/Docs/Learn_R0_en.html",
          actions: "https://covid-19-modelling.github.io/DashboardData/Docs/Learn_R0_en.html"
        }
      };
    },
    mounted() {
      this.activatePage("epiIndices", this.epiIndices[0]);
      this.activatePage("actions", this.actions[0]);
    },
    methods: {
      activatePage(tab, page) {
        this.activePages[tab] = page;
      }
    }
  };
</script>
<style>
body {
  font-size: 20px;
}
</style>
