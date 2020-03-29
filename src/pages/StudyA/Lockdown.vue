<template>
  <div class="row">
    <div class="col-md-2">
      <card title="Provence" subTitle="">
        <b-form-select v-model="selected" :options="provinces"></b-form-select>
        <div class="mt-3">Proportion of exogenous infection:</div>
        <strong>{{ selectedData[0] }}</strong>
        <div class="mt-3">PAF of lockdown: two weeks later:</div>
        <strong>{{ selectedData[1] }}</strong>
      </card>
    </div>
    <div class="col-md-5">
      <d3-card title="Exogenous force of infection"
               subTitle="Date: 12th February"
               :chart-data="exoChart.data"
               :draw-chart="exoChart.init"
               :update-chart="exoChart.update"
               :margin="exoChart.margin">
      </d3-card>
    </div>
    <div class="col-md-5">
      <d3-card title="Impacts of massive lockdown"
               subTitle="Date: 26th Marth"
               :chart-data="lockChart.data"
               :draw-chart="lockChart.init"
               :update-chart="lockChart.update"
               :margin="lockChart.margin">
      </d3-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import * as d3 from "d3";
import { D3Card } from "@/components";

export default {
  name: "Lockdown",
  components: {
    D3Card
  },
  data() {
    return {
      provinces: ["Hubei"],
      selected: "Hubei",
      selectedData: ["A", "B"],
      exoChart: {
        data: {entries: [{name: "Hubei", mean: 1, lower: 0, upper: 2}], selected: "Hubei"},
        margin: {top: 70, right: 100, bottom: 10, left: 0},
        init: function(self) {
          self.x = d3
            .scaleLinear()
            .range([self.margin.left, self.width - self.margin.right]);

          self.y = d3
            .scalePoint()
            .range([self.height - self.margin.bottom, self.margin.top]);

          self.xAxis = g => g
            .attr("transform", `translate(0,${self.margin.top - 20})`)
            .call(d3.axisTop(self.x));

          self.yAxis = g => g
            .attr("transform", `translate(${self.width - self.margin.right},0)`)
            .call(d3.axisRight(self.y));

          self.svg.append("g").attr("class", "xAxis").call(self.xAxis);

          self.svg.append("g").attr("class", "yAxis").call(self.yAxis);

          self.svg
            .append("text")
            .attr("class", "xLab")
            .attr("transform", `translate(${(self.width + self.margin.left) / 2},${self.margin.top/3})`)
            .attr("dy", "-0.9em")
            .style("text-anchor", "left")
            .text("Pr(Exogenous infection)");

          if (self.chartData.entries.length > 1) self.update();

        },
        update: function(self) {
          if (self.chartData.entries.length <= 0) return;
          self.x.domain([105, 0]);

          self.y.domain(self.chartData.entries.map(d => d.Location));

          self.svg
            .select("g.xAxis")
            .transition()
            .duration(100)
            .call(self.xAxis);

          self.svg
            .select("g.yAxis")
            .transition()
            .duration(100)
            .call(self.yAxis);

          self.svg.selectAll("g.mci")
            .data(self.chartData.entries)
            .join(
              group => {
                const enter = group.append("g").attr("class", "mci").attr("id", d => d.Location);
                enter.append("circle")
                  .attr("cx", d => self.x(d.mean))
                  .attr("cy", d => self.y(d.Location))
                  .attr("r", d => d.Location === self.chartData.selected? 6: 3)
                  .style("fill", d => d.Location === self.chartData.selected? "#f00": "black");

                enter.append("line")
                  .attr("x1", d => self.x(d.lower))
                  .attr("x2", d => self.x(d.upper))
                  .attr("y1", d => self.y(d.Location))
                  .attr("y2", d => self.y(d.Location))
                  .style("stroke", d => d.Location === self.chartData.selected? "#f00": "black");
              },
              update => {
                update.selectAll("circle")
                  .attr("cx", d => self.x(d.mean))
                  .attr("cy", d => self.y(d.Location))
                  .attr("r", d => d.Location === self.chartData.selected? 6: 3)
                  .style("fill", d => d.Location === self.chartData.selected? "#f00": "black");

                update.selectAll("line")
                  .attr("x1", d => self.x(d.lower))
                  .attr("x2", d => self.x(d.upper))
                  .attr("y1", d => self.y(d.Location))
                  .attr("y2", d => self.y(d.Location))
                  .style("stroke", d => d.Location === self.chartData.selected? "#f00": "black");
              }
            );
        }
      },
      lockChart: {
        data: {entries: [{name: "Hubei", mean: 1, lower: 0, upper: 2}], selected: "Hubei"},
        margin: {top: 70, right: 0, bottom: 10, left: 100},
        init: function(self) {
          self.x = d3
            .scaleLinear()
            .range([self.margin.left, self.width - self.margin.right]);

          self.y = d3
            .scalePoint()
            .range([self.height - self.margin.bottom, self.margin.top]);

          self.xAxis = g => g
            .attr("transform", `translate(0,${self.margin.top - 20})`)
            .call(d3.axisTop(self.x));

          self.yAxis = g => g
            .attr("transform", `translate(${self.margin.left},0)`)
            .call(d3.axisLeft(self.y));

          self.svg.append("g").attr("class", "xAxis").call(self.xAxis);

          self.svg.append("g").attr("class", "yAxis").call(self.yAxis);

          self.svg
            .append("text")
            .attr("class", "xLab")
            .attr("transform", `translate(${(self.width + self.margin.left) / 2},${self.margin.top/3})`)
            .attr("dy", "-0.9em")
            .style("text-anchor", "middle")
            .text("Population attributable fraction of lockdown");

          if (self.chartData.entries.length > 1) self.update();

        },
        update: function(self) {
          if (self.chartData.entries.length <= 0) return;
          self.x.domain([0, 105]);

          self.y.domain(self.chartData.entries.map(d => d.Location));

          self.svg
            .select("g.xAxis")
            .transition()
            .duration(100)
            .call(self.xAxis);

          self.svg
            .select("g.yAxis")
            .transition()
            .duration(100)
            .call(self.yAxis);

          self.svg.selectAll("g.mci")
            .data(self.chartData.entries)
            .join(
              group => {
                const enter = group.append("g").attr("class", "mci").attr("id", d => d.Location);
                enter.append("circle")
                  .attr("cx", d => self.x(d.mean))
                  .attr("cy", d => self.y(d.Location))
                  .attr("r", d => d.Location === self.chartData.selected? 6: 3)
                  .style("fill", d => d.Location === self.chartData.selected? "#f00": "black");

                enter.append("line")
                  .attr("x1", d => self.x(d.lower))
                  .attr("x2", d => self.x(d.upper))
                  .attr("y1", d => self.y(d.Location))
                  .attr("y2", d => self.y(d.Location))
                  .style("stroke", d => d.Location === self.chartData.selected? "#f00": "black");
              },
              update => {
                update.selectAll("circle")
                  .attr("cx", d => self.x(d.mean))
                  .attr("cy", d => self.y(d.Location))
                  .attr("r", d => d.Location === self.chartData.selected? 6: 3)
                  .style("fill", d => d.Location === self.chartData.selected? "#f00": "black");

                update.selectAll("line")
                  .attr("x1", d => self.x(d.lower))
                  .attr("x2", d => self.x(d.upper))
                  .attr("y1", d => self.y(d.Location))
                  .attr("y2", d => self.y(d.Location))
                  .style("stroke", d => d.Location === self.chartData.selected? "#f00": "black");
              }
            );
        }
      }
    };
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    selected() {
      this.exoChart.data = {
        entries: this.exoChart.data.entries,
        selected: this.selected
      };

      this.lockChart.data = {
        entries: this.lockChart.data.entries,
        selected: this.selected
      };

      this.selectProvince();
    }
  },
  methods: {
    fetchData() {
      axios.get("https://raw.githubusercontent.com/COVID-19-Modelling/Bass-COVID-19/master/Output/JSON/Lockdown.json")
        .then(res => {
          this.exoChart.data = {
            entries: res.data
              .filter(d => d.variable === "PrEx" && d.Scenario === "Baseline")
              .sort((a, b) => a.mean - b.mean),
            selected: this.selected
          };
          this.lockChart.data = {
            entries: res.data
              .filter(d => d.variable === "PAF_2w" && d.Scenario === "Lockdown")
              .map(d => {
                return {
                  Location: d.Location,
                  mean: -d.mean,
                  upper: -d.upper,
                  lower: -d.lower
                }
              })
              .sort((a, b) => a.mean - b.mean),
            selected: this.selected
          };
          this.provinces = this.exoChart.data.entries.map(d => d.Location);
          this.provinces.sort();
          this.selectProvince();
        });
    },
    selectProvince() {
      this.selectedData = [
        this.exoChart.data.entries.filter(d => d.Location === this.selected)
          .map(d => `${d.mean.toFixed()}% (95% CrI: ${d.lower.toFixed()}%-${d.upper.toFixed()}%)`)[0],
        this.lockChart.data.entries.filter(d => d.Location === this.selected)
          .map(d => `${d.mean.toFixed()}% (95% CrI: ${d.lower.toFixed()}%-${d.upper.toFixed()}%)`)[0]
      ]
    }
  }
}
</script>

<style scoped>

</style>
