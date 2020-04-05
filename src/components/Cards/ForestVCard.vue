<template>
  <d3-card :title="title"
           :sub-title="subTitle"
           :footer-text="footerText"
           :chart-data="chartData"
           :draw-chart="drawChart"
           :update-chart="updateChart">
    <div :id="legendId" slot="legend">
    </div>
  </d3-card>
</template>
<script>
import D3Card from "./D3Card.vue";
import * as d3 from "d3";

export default {
  name: "forest-v-card",
  components: {
    D3Card
  },
  props: {
    footerText: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    subTitle: {
      type: String,
      default: ""
    },
    margin: {
      type: Object,
      default: () => {
        return {top: 10, right: 30, bottom: 100, left: 100};
      }
    },
    entries: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    index: {
      type: String,
      default: "Location"
    },
    selected: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      legendId: "no-id"
    };
  },
  computed: {
    chartData() {
      let data = d3.nest()
        .key(d => d[this.index])
        .object(this.entries);

      data = d3.values(data).map(d => {
        let vs = {};
        vs.key = d[0][this.index];
        d.forEach(v => {
          if (this.columns.indexOf(v.variable) >= 0) {
            vs[v.variable] = v;
          }
        });
        return vs;
      });

      return {
        entries: data,
        columns: this.columns,
        selected: this.selected,
        legendId: this.legendId
      }
    }
  },
  mounted() {
    this.setLegends();
  },
  methods: {
    drawChart(self) {
      self.y = d3.scaleLinear()
        .range([self.height - self.margin.bottom, self.margin.top]);

      self.x = d3.scalePoint()
        .range([self.margin.left + 20, self.width - self.margin.right]);

      self.xAxis = g => g
        .attr("transform", `translate(0,${self.height - self.margin.bottom})`)
        .call(d3.axisBottom(self.x));

      self.yAxis = g => g
        .attr("transform", `translate(${self.margin.left},0)`)
        .call(d3.axisLeft(self.y));

      self.svg.append("g").attr("class", "xAxis");

      self.svg.append("g").attr("class", "yAxis");

      self.svg
        .append("text")
        .attr("class", "yLab")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", -(self.height / 2) + self.margin.top)
        .attr("dy", "3em")
        .style("text-anchor", "middle")
        .text("Reproduction numbers");

      self.colours = d3.scaleOrdinal()
        .range(d3.schemeCategory10).domain(self.chartData.columns);

      d3.select("#" + self.chartData.legendId).selectAll("button")
        .data(self.chartData.columns)
        .join(enter => {
          enter.append("button")
            .attr("type", "button")
            .attr("class", "btn btn-lg")
            .style("stroke-width", 0)
            .style("background-color", col => self.colours(col))
            .text(col => col)
            .on("click", col => this.selected = col);
        })
    },
    setLegends() {
      const currentTime = new Date().getTime().toString();
      const randomInt = Math.floor(Math.random() * (currentTime + 1));
      this.legendId = `div_${randomInt}`;
    },
    updateChart(self) {
      let data = self.chartData;
      data.entries.sort((a, b) => b[data.selected].mean - a[data.selected].mean);

      self.x.domain(data.entries.map(d => d.key));

      self.y.domain([0, d3.max(data.entries, ent => d3.max(data.columns, col => ent[col].upper))]);

      self.svg
        .select("g.xAxis")
        .transition()
        .duration(200)
        .call(self.xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(60)")
        .style("text-anchor", "start");

      self.svg
        .select("g.yAxis")
        .transition()
        .duration(200)
        .call(self.yAxis);

      data.columns.forEach((col, i) => {
        self.svg.selectAll("g#gp" + i)
          .data(data.entries)
          .join(
            gp => {
              const enter = gp.append("g").attr("id", "gp" + i);
              enter.append("circle")
                .attr("cy", d => self.y(d[col].mean))
                .attr("cx", d => self.x(d.key))
                .attr("r", col === data.selected? self.width / 150: self.width / 200)
                .attr("fill", self.colours(col));

              enter.append("line")
                .attr("y1", d => self.y(d[col].lower))
                .attr("y2", d => self.y(d[col].upper))
                .attr("x1", d => self.x(d[col].Location))
                .attr("x2", d => self.x(d[col].Location))
                .style("stroke", self.colours(col));
            },
            gp => {
              gp.selectAll("circle")
                .transition()
                .duration(400)
                .attr("cy", d => self.y(d[col].mean))
                .attr("cx", d => self.x(d.key))
                .attr("r", col === data.selected? self.width / 150: self.width / 200)
                .attr("fill", self.colours(col));

              gp.selectAll("line")
                .transition()
                .duration(400)
                .attr("y1", d => self.y(d[col].lower))
                .attr("y2", d => self.y(d[col].upper))
                .attr("x1", d => self.x(d[col].Location))
                .attr("x2", d => self.x(d[col].Location))
                .style("stroke", self.colours(col));
            }
          )
      });
    },
  }
};
</script>
<style>
</style>
