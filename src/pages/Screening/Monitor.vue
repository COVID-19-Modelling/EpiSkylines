<template>
  <d3-card title="Monitor"
           :chart-data="chartData"
           :draw-chart="init"
           :update-chart="update"
           :margin="margin">
  </d3-card>
</template>

<script>
  import { D3Card } from "@/components";
  import * as d3 from "d3";

  export default {
    name: "Monitor",
    components: {
      D3Card
    },
    props: {
      last: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        Records: [this.last],
        columns: Object.keys(this.last).filter(v => v!== "Time"),
        margin: { top: 10, right: 10, bottom: 50, left: 50 },
        init(self) {
          self.x = d3
            .scaleLinear()
            .range([self.margin.left, self.width - self.margin.right]);

          self.y = d3
            .scaleLinear()
            .nice()
            .range([self.height - self.margin.bottom, self.margin.top]);

          self.xAxis = g => g
            .attr("transform", `translate(0,${self.height - self.margin.bottom})`)
            .call(d3.axisBottom(self.x));

          self.yAxis = g => g
            .attr("transform", `translate(${self.margin.left},0)`)
            .call(d3.axisLeft(self.y).ticks(10)
              .tickFormat(d3.format(".2s")));

          self.svg.append("g").attr("class", "xAxis").call(self.xAxis);

          self.svg.append("g").attr("class", "yAxis").call(self.yAxis);

          self.svg
            .append("text")
            .attr("class", "xLab")
            .attr("transform", `translate(${(self.width + self.margin.left) / 2},${self.height})`)
            .attr("dy", "-0.9em")
            .style("text-anchor", "middle")
            .text("Days");


          self.svg
            .append("text")
            .attr("class", "yLab")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x", - (self.height / 2) + self.margin.top)
            .attr("dy", "0.9em")
            .style("text-anchor", "middle")
            .text("Value");

          self.colours = d3.scaleOrdinal()
            .domain(self.chartData.columns)
            .range(d3.schemeCategory10);

        },
        update(self) {

          self.x.domain([0, self.chartData.last]);

          self.y.domain([0, d3.max(self.chartData.series, ent => d3.max(d3.values(ent).slice(1)))]);

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

          self.chartData.columns.forEach(col => {
            self.svg
              .selectAll("path.line" + col.replace(/\s+/, ""))
              .data([self.chartData.series])
              .join(
                enter => {
                  enter
                    .append("path")
                    .attr("class", "line" + col.replace(/\s+/, ""))
                    .attr("d", d3.line().y(d => self.y(d[col])).x(d => self.x(d.Time)))
                    .attr("fill", "none")
                    .attr("stroke", self.colours(col))
                    .attr("stroke-width", 3);
                },
                update => {
                  update.attr("d", d3.line().y(d => self.y(d[col])).x(d => self.x(d.Time)));
                }
              );
          });
        }
      }
    },
    watch: {
      last(rec1, rec0) {
        if (rec1.Time >= rec0.Time) {
          this.newRecord();
        } else {
          this.reset();
        }
      }
    },
    computed: {
      chartData() {
        return {
          series: this.Records,
          columns: this.columns,
          last: this.last.Time
        }
      }
    },
    methods: {
      newRecord() {
        this.Records.push(this.last);
      },
      reset() {
        this.Records = [this.last];
      },
    }
  }
</script>

<style scoped>

</style>
