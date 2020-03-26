<template>
  <div class="row">
    <div class="col-md-12 col-xl-6">
      <card>
        <template slot="header">
          <h4 class="card-title">More models</h4>
          <p class="card-category">Modelling resources</p>
        </template>
        <div class="content">
          <div class="content">
            <div v-for="paper in papers" :key="paper.Name">
              <div class="typo-line" >
                <h4><p class="category">{{paper.Type}}</p>
                  <a :href="paper.Link" target="_blank">{{paper.Name}}</a></h4>
              </div>
            </div>

          </div>
        </div>
      </card>
    </div>
    <div class="col-md-12 col-xl-6">
      <card>
        <template slot="header">
          <h4 class="card-title">More dashboards / databases for COVID-19</h4>
          <p class="card-category">Other dashboards / databases</p>
        </template>
        <div class="content">
          <div v-for="db in dbs" :key="db.Name">
            <div class="typo-line" >
              <h4><p class="category">{{db.Type}}</p>
                <a :href="db.Link" target="_blank">{{db.Name}}</a></h4>
            </div>
          </div>
        </div>
      </card>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Resources",
  data() {
    return {
      papers: [],
      dbs: []
    };
  },
  mounted() {
    this.fetchPapers();
    this.fetchDatabases();
  },
  methods: {
    fetchPapers() {
      axios.get("https://covid-19-modelling.github.io/DashboardData/Resources/papers.json")
        .then(res => {
          this.papers = res.data;
        });
    },
    fetchDatabases() {
      axios.get("https://covid-19-modelling.github.io/DashboardData/Resources/dbs.json")
        .then(res => {
          this.dbs = res.data;
        });
    }
  }
}
</script>

<style scoped>

</style>
