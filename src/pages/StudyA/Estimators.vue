<template>
  <div class="row">
    <div class="col-md-9">
      <card title="R0 vs. R(t)" subTitle="t = 12th February">
        <div id="r0rt">
        </div>
      </card>
    </div>
    <div class="col-md-3">
      <card title="Model" subTitle="">

      </card>
    </div>
    <div class="col-12">
      <card title="Parameter estimation" subTitle="based on Bass-SIR model">
        <div class="table-full-width table-responsive">
          <paper-table :data="estimators" :columns="columns">
          </paper-table>
        </div>
      </card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";
import * as d3 from "d3";
import { PaperTable } from "@/components";

export default {
  name: "Estimators",
  components: {
    PaperTable
  },
  data() {
    return {
      columns: ["Location", "m", "100kappa", "beta", "R0", "R(t)"],
      estimators: [],
      rt: [],
      svg: null,
      legends: null,
      x: null,
      y: null,
      xAxis: null,
      yAxis: null,
      width: 300,
      margin: {top: 10, right: 30, bottom: 100, left: 100},
      loading: false
    };
  },
  mounted() {
    this.fetchEstimators();
    window.addEventListener("resize", this.resize);
  },
  methods: {
    fetchEstimators() {
      this.loading = true;
      axios.get("https://raw.githubusercontent.com/COVID-19-Modelling/Bass-COVID-19/master/Output/JSON/EpiIndices.json")
        .then(res => {
          this.rt = res.data.filter(d => ["R0", "R(t)"].indexOf(d.variable)  >= 0);

          this.estimators = Object.values(_.groupBy(res.data, d => d.Location))
            .map(v => {
              let ent = { location: v[0].Location};
              v.forEach(col => {
                switch(col.variable) {
                  case "kappa":
                    ent["100kappa"] = `${(100*col.mean).toFixed(1)} (${(100*col.lower).toFixed(1)} - ${(100*col.upper).toFixed(1)})`;
                    break;
                  case "beta":
                    ent["beta"] = `${col.mean.toFixed(2)} (${col.lower.toFixed(2)} - ${col.upper.toFixed(2)})`;
                    break;
                  case "m":
                    ent["m"] = `${col.mean.toFixed()} (${col.lower.toFixed()} - ${col.upper.toFixed()})`;
                    break;
                  case "R0":
                    ent["r0"] = `${col.mean.toFixed(2)} (${col.lower.toFixed(2)} - ${col.upper.toFixed(2)})`;
                    ent.key = col.mean;
                    break;
                  case "R(t)":
                    ent["r(t)"] = `${col.mean.toFixed(2)} (${col.lower.toFixed(2)} - ${col.upper.toFixed(2)})`;
                    break;
                }
              });
              return ent;
            }).sort((a, b) => b.key - a.key);


        }).finally(() => {
          this.loading = false;
          this.drawFigure();
        });
    },
    drawFigure() {
      this.legends = d3.select("#r0rt").append("div").append("ul").attr("class", "nav justify-content-end");

      this.svg = d3.select("#r0rt").append("svg");

      const parent = this.svg.node().parentNode;
      const width = parent.clientWidth;
      const height = Math.min(width * 0.5, 500);
      this.width = width;
      const margin = this.margin;

      this.svg
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "#fff");

      this.y = d3.scaleLinear()
        .domain([0, d3.max(this.rt, d => d.upper)]).nice()
        .rangeRound([height - margin.bottom, margin.top]);

      const keys = this.rt
        .filter(d => d.variable === "R0")
        .sort((a, b) => b.mean - a.mean)
        .map(d => d.Location);

      this.x = d3.scalePoint()
        .domain(keys)
        .range([margin.left + 20, width - margin.right]);

      this.xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(this.x));

      this.yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(this.y));

      this.svg.append("g").attr("class", "xAxis");

      this.svg.append("g").attr("class", "yAxis");

      const colour = d3.scaleOrdinal()
        .range(d3.schemeCategory10).domain("R0", "R(t)");

      this.legends
        .selectAll("li")
        .data(["R0", "R(t)"])
        .join(enter => {
          const li = enter.append("li").attr("class", "nav-item").style("background-color", d => colour(d));
          li.append("a")
            .attr("class", "nav-link disabled")
            .attr("href", "#")
            .style("color", "#111")
            .style("font-face", "bold")
            .text(d => d);
        });

      this.svg.append("line")
        .attr("y1", this.y(1))
        .attr("y2", this.y(1))
        .attr("x1", margin.left)
        .attr("x2", width - margin.right)
        .style("stroke-width", 1)
        .style("stroke", "#888");

      this.svg
        .append("text")
        .attr("class", "yLab")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", -(height / 2) + margin.top)
        .attr("dy", "3em")
        .style("text-anchor", "middle")
        .text("Reproduction numbers");

      this.svg.append("g")
        .selectAll("g")
        .data(this.rt)
        .join(group => {
          const enter = group.append("g");
          enter.append("circle")
            .attr("cy", d => this.y(d.mean))
            .attr("cx", d => this.x(d.Location))
            .attr("r", width / 200)
            .attr("fill", d => colour(d.variable));

          enter.append("line")
            .attr("y1", d => this.y(d.lower))
            .attr("y2", d => this.y(d.upper))
            .attr("x1", d => this.x(d.Location))
            .attr("x2", d => this.x(d.Location))
            .style("stroke", d => colour(d.variable));
        });

      this.resize();
    },

    resize() {
      const parent = this.svg.node().parentNode;
      const width = parent.clientWidth;
      const height = Math.min(width * 0.5, 500);
      this.width = width;
      const margin = this.margin;

      this.svg
        .attr("width", this.width)
        .attr("height", height);

      this.y.rangeRound([height - margin.bottom, margin.top]);
      this.x.range([margin.left + 20, width - margin.right]);

      this.svg
        .select("g.xAxis")
        .transition()
        .duration(200)
        .call(this.xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(60)")
        .style("text-anchor", "start");

      this.svg
        .select("g.yAxis")
        .transition()
        .duration(200)
        .call(this.yAxis);

    }

  }
}
</script>

<style scoped>

</style>
