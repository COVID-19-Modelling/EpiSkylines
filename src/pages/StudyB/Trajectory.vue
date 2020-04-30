<template>
  <d3-card :title="title"
           :sub-title="subTitle"
           :footer-text="footerText"
           :chart-data="chartData"
           :draw-chart="drawChart"
           :update-chart="updateChart"
           :margin="margin"
  >
  </d3-card>
</template>
<script>
  import { D3Card } from "@/components";
  import * as d3 from "d3";

  export default {
    name: "Trajectory",
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
          return {top: 10, right: 30, bottom: 100, left: 50};
        }
      },
      chartData: {
        type: Object,
        required: true
      },
      frame: {
        type: Number,
        default: 30
      },
      upper: {
        type: Number,
        default: Infinity
      }
    },
    methods: {
      drawChart(self) {
        self.x = d3
          .scaleTime()
          .rangeRound([self.margin.left, self.width - self.margin.right]);

        self.y = d3
          .scaleLinear()
          .nice()
          .range([self.height - self.margin.bottom, self.margin.top]);

        self.xAxis = d3.axisBottom(self.x).ticks(d3.timeDay.every(7)).tickFormat(d3.timeFormat("%d-%b"));

        self.yAxis = d3.axisLeft(self.y).ticks(8).tickFormat(d3.format("0.4f"));

        self.svg.append("g").attr("class", "xAxis")
          .attr("transform", `translate(0,${self.height - self.margin.bottom})`);

        self.svg.append("g").attr("class", "yAxis")
          .attr("transform", `translate(${self.margin.left},0)`);

        self.svg
          .append("text")
          .attr("class", "xLab")
          .attr("transform", `translate(${(self.width + self.margin.left) / 2},${self.height})`)
          .attr("dy", "-0.9em")
          .style("text-anchor", "middle")
          .text("Date");

        self.svg
          .append("text")
          .attr("class", "yLab")
          .attr("transform", "rotate(-90)")
          .attr("y", 0)
          .attr("x", - (self.height / 2) + self.margin.top)
          .attr("dy", "0.9em")
          .style("text-anchor", "middle")
          .text("Number");
      },
      updateChart(self) {
        const parseTime = d3.timeParse("%Y-%m-%d");
        let mx =  d3.max(self.chartData.series, d => parseTime(d.Date));
        let mn =  d3.min(self.chartData.series, d => parseTime(d.Date));
        mn.setTime(mx.getTime() - (this.frame - 0.01) * 86400000);
        self.x.domain([mn, mx]);

        self.y.domain([0,
          Math.min(this.upper, 1.1*d3.max(self.chartData.series
            .filter(ent => ent.Value !== undefined), ent => Math.max(ent.Value.upper, ent.Value.mean)))
        ]);

        self.svg
          .select("g.xAxis")
          .transition()
          .duration(100)
          .call(self.xAxis)
          .selectAll("text")
          .attr("y", 10)
          .attr("x", 9)
          .attr("dy", ".35em")
          .attr("transform", "rotate(45)")
          .style("text-anchor", "start");

        self.svg
          .select("g.yAxis")
          .transition()
          .duration(100)
          .call(self.yAxis);

        self.svg.selectAll("g.point")
          .data(self.chartData.series.filter(d => parseTime(d.Date) > mn))
          .join(
            enter => {
              enter.append("g")
                .attr("class", "point")
                .call(g => {
                  g.append("circle")
                    .attr("cy", d => self.y(d.Value.mean))
                    .attr("cx", d => self.x(parseTime(d.Date)))
                    .attr("r", self.width / 150)
                    .attr("fill", d => d.Sign === "+"?"red":"green");

                  g.append("line")
                    .attr("y1", d => Math.max(0, self.y(d.Value.lower)))
                    .attr("y2", d => Math.max(0, self.y(d.Value.upper)))
                    .attr("x1", d => self.x(parseTime(d.Date)))
                    .attr("x2", d => self.x(parseTime(d.Date)))
                    .style("stroke", d => d.Sign === "+"?"red":"green");
                });
            },
            update => {
              update
                .call(g => {
                  g.select("circle")
                    .attr("cx", d => self.x(parseTime(d.Date)))
                    .transition()
                    .duration(300)
                    .attr("cy", d => self.y(d.Value.mean))
                    .attr("fill", d => d.Sign === "+"?"red":"green");

                  g.select("line")
                    .attr("x1", d => self.x(parseTime(d.Date)))
                    .attr("x2", d => self.x(parseTime(d.Date)))
                    .transition()
                    .duration(300)
                    .attr("y1", d => Math.max(0, self.y(d.Value.lower)))
                    .attr("y2", d => self.y(d.Value.upper))
                    .style("stroke", d => d.Sign === "+"?"red":"green");
                });

            },
            exit => {
              exit.transition(100).remove();
            }
          )
      }
    }
  };
</script>
<style>
</style>
