<template>
  <div class="row">
    <div class="col-md-2">
      <card title="Provence profile" subTitle="">
        <b-form-select v-model="selected" :options="provinces"></b-form-select>
      </card>
    </div>
    <div class="col-md-5">
      <d3-card title="Prevalence, active cases"
               subTitle="Data: before 12th February"
               :chart-data="prvChart.data"
               :draw-chart="prvChart.init"
               :update-chart="prvChart.update"
               :margin="prvChart.margin">
      </d3-card>
    </div>
    <div class="col-md-5">
      <d3-card title="R(t)"
               subTitle="Effective reproduction numbers"
               :chart-data="rtChart.data"
               :draw-chart="rtChart.init"
               :update-chart="rtChart.update"
               :margin="rtChart.margin">

      </d3-card>
    </div>
  </div>
</template>

<script>
  import { D3Card } from "@/components/index";
  import axios from "axios";
  import * as d3 from "d3";

  export default {
    name: "Prevalence",
    components: {
      D3Card
    },
    data() {
      return {
        provinces: ["Hubei"],
        selected: "Hubei",
        prvAll: null,
        prvChart: {
          data: { Data: [], Fitted: [], Simulation: [] },
          margin: {top: 10, right: 30, bottom: 50, left: 50},
          init: function(self) {
            self.x = d3
              .scaleTime()
              .rangeRound([self.margin.left, self.width - self.margin.right]);

            self.y = d3
              .scaleLog()
              .nice()
              .range([self.height - self.margin.bottom, self.margin.top]);

            self.xAxis = g => g
              .attr("transform", `translate(0,${self.height - self.margin.bottom})`)
              .call(d3.axisBottom(self.x).tickFormat(d3.timeFormat("%d-%b")));

            self.yAxis = g => g
              .attr("transform", `translate(${self.margin.left},0)`)
              .call(d3.axisLeft(self.y).ticks(self.width / 80).tickSizeOuter(0));

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
              .text("Prevalence (log scale)");

            if (self.chartData.Simulation.length > 0) self.update();

          },
          update: function(self) {
            const parseTime = d3.timeParse("%Y-%m-%d");
            if (self.chartData.Simulation.length === 0) return;
            self.x.domain([
              parseTime("2020-01-23"),
              parseTime(self.chartData.Simulation[self.chartData.Simulation.length - 1].Time)
            ]);

            self.y.domain([1, 5 * d3.max(self.chartData.Simulation, ent => ent.upper)]);

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

            self.svg.selectAll("path.simband")
              .data([self.chartData.Simulation])
              .join(
                enter => {
                  enter
                    .append("path")
                    .attr("class", "simband")
                    .attr("d", d3.area()
                      .y0(d => self.y(d.lower))
                      .y1(d => self.y(d.upper))
                      .x(d => self.x(parseTime(d.Time))))
                    .attr("fill", "#bbb");
                },
                update => {
                  update
                    .transition()
                    .attr("d", d3.area()
                    .y0(d => self.y(Math.max(d.lower, 1)))
                    .y1(d => self.y(d.upper))
                    .x(d => self.x(parseTime(d.Time))))
                }
              );

            self.svg.selectAll("path.sim")
              .data([self.chartData.Simulation])
              .join(
                enter => {
                  enter
                    .append("path")
                    .attr("class", "sim")
                    .attr("d", d3.line()
                      .y(d => self.y(d.mean))
                      .x(d => self.x(parseTime(d.Time))))
                    .attr("fill", "none")
                    .attr("stroke", "#dd0015")
                    .attr("stroke-width", 1);
                },
                update => {
                  update
                    .transition()
                    .attr("d", d3.line()
                      .y(d => self.y(d.mean))
                      .x(d => self.x(parseTime(d.Time))))
                }
              );

            self.svg.selectAll("circle.data")
              .data(self.chartData.Data)
              .join(
                enter => {
                  enter
                    .append("circle")
                    .attr("class", "data")
                    .attr("cx", d => self.x(parseTime(d.Time)))
                    .attr("cy", d => self.y(d.Data))
                    .attr("r", 2)
                },
                update => {
                  update
                    .transition()
                    .attr("cx", d => self.x(parseTime(d.Time)))
                    .attr("cy", d => self.y(d.Data))

                }
              );

          }
        },
        rtAll: null,
        rtChart: {
          data: { Fitted: [], Simulation: [] },
          margin: {top: 10, right: 30, bottom: 50, left: 50},
          init: function(self) {
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
              .call(d3.axisLeft(self.y).ticks(self.width / 80).tickSizeOuter(0));

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
              .text("Effective reproduction number");
            if (self.chartData.Simulation.length > 0) self.update();
          },
          update: function(self) {
            if (self.chartData.Simulation.length === 0) return;
            const parseTime = d3.timeParse("%Y-%m-%d");

            self.x.domain([
              parseTime("2020-01-23"),
              parseTime(self.chartData.Simulation[self.chartData.Simulation.length - 1].Time)
            ]);


            self.y.domain([0, 1.2 * d3.max(self.chartData.Fitted, ent => ent.upper)]);

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

            self.svg.selectAll("path.simband")
              .data([self.chartData.Simulation])
              .join(
                enter => {
                  enter
                    .append("path")
                    .attr("class", "simband")
                    .attr("d", d3.area()
                      .y0(d => self.y(d.lower))
                      .y1(d => self.y(d.upper))
                      .x(d => self.x(parseTime(d.Time))))
                    .attr("fill", "#bbb");
                },
                update => {
                  update
                    .transition()
                    .attr("d", d3.area()
                      .y0(d => self.y(d.lower))
                      .y1(d => self.y(d.upper))
                      .x(d => self.x(parseTime(d.Time))))
                }
              );

            self.svg.selectAll("path.sim")
              .data([self.chartData.Simulation])
              .join(
                enter => {
                  enter
                    .append("path")
                    .attr("class", "sim")
                    .attr("d", d3.line()
                      .y(d => self.y(d.mean))
                      .x(d => self.x(parseTime(d.Time))))
                    .attr("fill", "none")
                    .attr("stroke", "#dd0015")
                    .attr("stroke-width", 1);
                },
                update => {
                  update
                    .transition()
                    .attr("d", d3.line()
                      .y(d => self.y(d.mean))
                      .x(d => self.x(parseTime(d.Time))))
                }
              );

            self.svg.selectAll("path.fitband")
              .data([self.chartData.Fitted])
              .join(
                enter => {
                  enter
                    .append("path")
                    .attr("class", "fitband")
                    .attr("d", d3.area()
                      .y0(d => self.y(d.lower))
                      .y1(d => self.y(d.upper))
                      .x(d => self.x(parseTime(d.Time))))
                    .attr("fill", "#bbb");
                },
                update => {
                  update
                    .transition()
                    .attr("d", d3.area()
                      .y0(d => self.y(d.lower))
                      .y1(d => self.y(d.upper))
                      .x(d => self.x(parseTime(d.Time))))
                },
                exit => {
                  exit
                    .transition()
                }
              );

            self.svg.selectAll("path.fit")
              .data([self.chartData.Fitted])
              .join(
                enter => {
                  enter
                    .append("path")
                    .attr("class", "sim")
                    .attr("d", d3.line()
                      .y(d => self.y(d.mean))
                      .x(d => self.x(parseTime(d.Time))))
                    .attr("fill", "none")
                    .attr("stroke", "#dd0015")
                    .attr("stroke-width", 1);
                },
                update => {
                  update
                    .transition()
                    .attr("d", d3.line()
                      .y(d => self.y(d.mean))
                      .x(d => self.x(parseTime(d.Time))))
                }
              );

          }
        }
      };
    },
    watch: {
      selected() {
        this.prvChart.data = this.prvAll[this.selected];
        this.rtChart.data = this.rtAll[this.selected];
      }
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      fetchData() {
        axios.get("https://raw.githubusercontent.com/COVID-19-Modelling/Bass-COVID-19/master/Output/JSON/TrajectoryPrv.json")
          .then(res => {
            this.provinces = d3.keys(res.data);
            this.prvAll = res.data;
            this.prvChart.data = this.prvAll[this.selected];
          });

        axios.get("https://raw.githubusercontent.com/COVID-19-Modelling/Bass-COVID-19/master/Output/JSON/TrajectoryRt.json")
          .then(res => {
            this.provinces = d3.keys(res.data);
            this.rtAll = res.data;
            this.rtChart.data = this.rtAll[this.selected];
          })
      }
    }

  }
</script>

<style scoped>

</style>
