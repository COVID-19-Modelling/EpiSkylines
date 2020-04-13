<template>
  <div class="row">
    <div class="col-md-2">
      <loc-selector
          :locations="locations"
          v-on:locchange="$emit('locchange', $event)"
          style="height: 400pt;">
      </loc-selector>
    </div>
    <div class="col-md-5" v-for="(chart, index) in charts" :key="index">
      <d3-card
          :title="chart.title"
          :chart-data="chart.data"
          :draw-chart="init"
          :update-chart="update"
      ></d3-card>
    </div>
  </div>
</template>

<script>
  import LocSelector from "./LocSelector";
  import { D3Card } from "@/components";
  import * as d3 from "d3";

  export default {
    name: "RecDie",
    components: {
      LocSelector,
      D3Card
    },
    props: {
      rawdata: {
        type: Object,
        required: true
      },
      locations: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        charts: [
          {
            title: "Recovery rate",
            data: { location: "", series: [] }
          },
          {
            title: "Death rate",
            data: { location: "", series: [] }
          }]
      };
    },
    watch: {
      rawdata() {
        this.extractSeries()
      }
    },
    mounted() {
      this.extractSeries();
    },
    methods: {
      extractSeries() {

        ["r_rec", "r_death"].forEach((key, i) => {
          let last = 0;

          this.charts[i].data = {
            location: this.rawdata.Location,
            series: this.rawdata.Estimates
              .map(ent => {
                return {
                  Date: ent.Date,
                  Value: ent.Indices[key],
                }
              }).filter(ent => ent.Value !== undefined)
              .map(ent => {
                ent.Sign = ent.Value.Mean > last? "+": "-";
                last = ent.Value.Mean;
                return ent;
              })
          };
        });
      },
      init(self) {
        self.x = d3
          .scaleTime()
          .rangeRound([self.margin.left, self.width - self.margin.right]);

        self.y = d3
          .scaleLinear()
          .nice()
          .range([self.height - self.margin.bottom, self.margin.top]);

        self.xAxis = g => g
          .attr("transform", `translate(0,${self.height - self.margin.bottom})`)
          .call(d3.axisBottom(self.x).tickFormat(d3.timeFormat("%d-%b")));

        self.yAxis = g => g
          .attr("transform", `translate(${self.margin.left},0)`)
          .call(d3.axisLeft(self.y).ticks(10)
            .tickFormat(d3.format("0.5f")));

        self.svg.append("g").attr("class", "xAxis").call(self.xAxis);

        self.svg.append("g").attr("class", "yAxis").call(self.yAxis);

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

        //self.update();
      },
      update(self) {
        const parseTime = d3.timeParse("%Y-%m-%d");
        let mx =  d3.max(self.chartData.series, d => parseTime(d.Date));
        let mn =  d3.min(self.chartData.series, d => parseTime(d.Date));
        mn.setTime(mx.getTime() - 29.99 * 86400000);
        self.x.domain([mn, mx]);

        self.y.domain([0,
          Math.min(1, 1.1*d3.max(self.chartData.series
            .filter(ent => ent.Value !== undefined), ent => Math.max(ent.Value.Upper, ent.Value.Mean)))
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
          .data(self.chartData.series)
          .join(
            enter => {
              enter.append("g")
                .attr("class", "point")
                .call(g => {
                  g.append("circle")
                    .attr("cy", d => self.y(d.Value.Mean))
                    .attr("cx", d => self.x(parseTime(d.Date)))
                    .attr("r", self.width / 150)
                    .attr("fill", d => d.Sign === "+"?"red":"green");

                  g.append("line")
                    .attr("y1", d => self.y(d.Value.Lower))
                    .attr("y2", d => self.y(d.Value.Upper))
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
                    .attr("cy", d => self.y(d.Value.Mean))
                    .attr("fill", d => d.Sign === "+"?"red":"green");

                  g.select("line")
                    .attr("x1", d => self.x(parseTime(d.Date)))
                    .attr("x2", d => self.x(parseTime(d.Date)))
                    .transition()
                    .duration(300)
                    .attr("y1", d => self.y(d.Value.Lower))
                    .attr("y2", d => self.y(d.Value.Upper))
                    .style("stroke", d => d.Sign === "+"?"red":"green");
                });

            },
            exit => {
              exit.transition(100).remove();
            }
          )
      }
    }

  }
</script>

<style scoped>

</style>
