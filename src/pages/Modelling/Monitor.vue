<template>
  <d3-card title="Results"
           :chart-data="chartData"
           :draw-chart="init"
           :update-chart="update"
           :margin="margin">
    <div slot="legend">
      <div :id="legendId" class="legends"></div>
    </div>
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
      series: {
        type: Array,
        required: true
      },
      dataPoints: {
        type: Array,
        required: true
      },
      states: {
        type: Array,
        required: true
      },
      statesInUse: {
        type: Array,
        required: true
      },
      margin: {
        type: Object,
        default: function() {
          return { top: 5, right: 15, bottom: 80, left: 70 }
        }
      }
    },
    data() {
      return {
        legendId: Math.random(),
        selected: "Infectious"
      }
    },
    computed: {
      chartData() {
        return {
          states: this.states,
          series: this.series,
          columns: this.statesInUse,
          legendId: this.legendId,
          selected: this.selected
        }
      }
    },
    mounted() {
      this.setLegends();
    },
    methods: {
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
            .tickFormat(d3.format("0.2s")));

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

        self.colours = d3.scaleOrdinal()
          .domain(self.chartData.states)
          .range(d3.schemeCategory10);

        self.update();
      },
      update(self) {
        d3.select("#" + self.chartData.legendId).selectAll("button")
          .data(self.chartData.columns)
          .join(
            enter => {
              enter.append("button")
                .attr("type", "button")
                .attr("class", "btn btn-sm")
                .text(col => col)
                .style("stroke-width", 0)
                .style("border-color", col => self.colours(col))
                .style("color", col => self.colours(col))
                .style("background-color", "#fff")
                .on("click", col => this.selected = col);
            },
            update => {
              update
                .text(col => col)
                .style("border-color", col => self.colours(col))
                .style("color", col => self.colours(col));
            },
            exit => {
              exit.remove();
            });

        const parseTime = d3.timeParse("%m/%d/%Y");

        self.x.domain(d3.extent(self.chartData.series, d=>parseTime(d.Date)));

        self.y.domain([0, Math.min(
          d3.max(self.chartData.series, ent => d3.max(d3.values(ent).slice(1))),
          this.dataPoints[this.dataPoints.length - 1].Confirmed * 2.5)
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

        self.chartData.states.forEach(col => {
          if (self.chartData.columns.includes(col)) {
            self.svg
              .selectAll("path.line" + col.replace(/\s+/, ""))
              .data([self.chartData.series])
              .join(
                enter => {
                  enter
                    .append("path")
                    .attr("class", "line" + col.replace(/\s+/, ""))
                    .attr("d", d3.line().y(d => self.y(d[col])).x(d => self.x(parseTime(d.Date))))
                    .attr("fill", "none")
                    .attr("stroke", self.colours(col))
                    .attr("stroke-width", col === self.chartData.selected?3:1);
                },
                update => {
                  update
                    .transition(300)
                    .attr("d", d3.line().y(d => self.y(d[col])).x(d => self.x(parseTime(d.Date))))
                    .attr("stroke-width", col === self.chartData.selected?3:1);
                }
              );
          } else {
            self.svg
              .selectAll("path.line" + col.replace(/\s+/, ""))
              .data([])
              .join(
                () => {},
                () => {},
                exit => {
                  exit
                    .transition(300)
                    .attr("stroke-width", 1)
                    .remove();
                }
              );
          }

        });

        ["Infectious", "Recovered", "Died"].forEach(col => {
          self.svg
            .selectAll("circle.data" + col.replace(/\s+/, ""))
            .data(this.dataPoints)
            .join(
              enter => {
                enter
                  .append("circle")
                  .attr("class", "data" + col.replace(/\s+/, ""))
                  .attr("cx", d => self.x(parseTime(d.Date)))
                  .attr("cy", d => self.y(d[col]))
                  .attr("r", col === self.chartData.selected?5:2)
                  .attr("fill", self.colours(col))
                  .attr("stroke", "#222")
                  .attr("stroke-width", 1);
              },
              update => {
                update
                  .transition(300)
                  .attr("cx", d => self.x(parseTime(d.Date)))
                  .attr("cy", d => self.y(d[col]))
                  .attr("r", col === self.chartData.selected?5:2)
                  .attr("fill", self.colours(col));
              }
            );
        });
      },
      setLegends() {
        const currentTime = new Date().getTime().toString();
        const randomInt = Math.floor(Math.random() * (currentTime + 1));
        this.legendId = `div_${randomInt}`;
      },
    }
  }
</script>

<style scoped>

</style>
