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
    name: "Grid",
    components: {
      D3Card
    },
    props: {
      nrow: {
        type: Number,
        required: true
      },
      agents: {
        type: Array,
        required: true
      },
      visible: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        init(self) {
          self.x = d3
            .scaleLinear()
            .range([(self.width - self.height) / 2, (self.height + self.width) / 2]);

          self.y = d3
            .scaleLinear()
            .range([self.height, 0]);

          self.xAxis = g => g
            .attr("transform", `translate(0,${self.width})`)
            .call(d3.axisBottom(self.x));

          self.yAxis = g => g
            .attr("transform", "translate(0,0)")
            .call(d3.axisLeft(self.y));

          self.svg.append("g").attr("class", "xAxis").call(self.xAxis);
          self.svg.append("g").attr("class", "yAxis").call(self.yAxis);

          self.colours = d3.scaleOrdinal().domain(self.chartData.states)
            .range(d3.schemeTableau10);

          self.update();
        },
        update(self) {
          console.log("update")
          self.x.domain([0, self.chartData.nrow]);
          self.y.domain([0, self.chartData.nrow]);

          const rad = self.x(0.5) - self.x(0);

          self.svg
            .selectAll("circle")
            .data(self.chartData.agents)
            .join(
              enter => {
                enter
                  .append("circle")
                  .attr("cx", d => self.x(d.Position[0] + 0.5))
                  .attr("cy", d => self.y(d.Position[1] + 0.5))
                  .attr("r", rad)
                  .attr("fill", d => self.colours(d.Appearance))
                  .on("click", d => {
                    self.$emit("test", d.ID);
                    self.focus = d.ID;
                  });
              },
              update => {
                update
                  .transition().duration(300)
                  .attr("r", rad)
                  .attr("fill", d => self.colours(d.Appearance))
              },
              exit => {
                exit.remove();
              }
            );

        }
      }
    },
    computed: {
      chartData() {
        return {
          agents: this.agents,
          nrow: this.nrow,
          states: this.visible
        }
      }
    }
  }
</script>

<style scoped>

</style>
