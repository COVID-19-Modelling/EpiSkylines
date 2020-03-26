<template>
  <div>
    <!--Stats cards-->
    <div class="row">
      <div class="col-md-6 col-xl-3" v-for="stats in statsCards" :key="stats.title">
        <stats-card>
          <div class="icon-big text-center" :class="`icon-${stats.type}`" slot="header">
            <i :class="stats.icon"></i>
          </div>
          <div class="numbers" slot="content">
            <p>{{stats.title}}</p>
            {{stats.value}}
          </div>
          <div class="stats" slot="footer">
            <i :class="stats.footerIcon"></i> {{stats.footerText}}
          </div>
        </stats-card>
      </div>
    </div>

    <!--Charts-->
    <div class="row">
      <div class="col-md-3 col-12">
        <d3-card title="COVID status"
                 sub-title=""
                 :chart-data="statusChart.data"
                 :draw-chart="statusChart.init"
                 :update-chart="statusChart.update"
                 :margin="statusChart.margin">
          <div slot="legend">
            <i class="fa fa-circle legend-active"></i> Active cases
            <i class="fa fa-circle legend-deaths"></i> Deaths
            <i class="fa fa-circle legend-recovered"></i> Recovered
          </div>
        </d3-card>
      </div>
      <div class="col-md-9 col-12">
        <d3-card title="COVID time-series"
                 sub-title=""
                 :chart-data="trendChart.data"
                 :draw-chart="trendChart.init"
                 :update-chart="trendChart.update"
                 :margin="trendChart.margin">
          <div slot="legend">
            <i class="fa fa-circle legend-active"></i> Active cases
            <i class="fa fa-circle legend-deaths"></i> Deaths
            <i class="fa fa-circle legend-recovered"></i> Recovered
          </div>
        </d3-card>
      </div>
    </div>
  </div>
</template>
<script>
import { StatsCard, D3Card } from "@/components/index";
import * as d3 from "d3";
import axios from "axios"

export default {
  components: {
    StatsCard,
    D3Card
  },
  data() {
    return {
      counts: [1, 1, 1],
      statsCards: [
        {
          type: "warning",
          icon: "ti-pulse",
          title: "Total confirmed",
          value: "214,894",
          footerText: "Updating",
          footerIcon: "ti-time"
        },
        {
          type: "danger",
          icon: "ti-wallet",
          title: "Total death",
          value: "8,732",
          footerText: "Updating",
          footerIcon: "ti-time"
        },
        {
          type: "success",
          icon: "ti-pulse",
          title: "Total recovered",
          value: "83,313",
          footerText: "Updating",
          footerIcon: "ti-time"
        },
        {
          type: "info",
          icon: "ti-pulse",
          title: "",
          value: "",
          footerText: "Updating",
          footerIcon: "ti-time"
        }
      ],
      statusChart: {
        data: {
          "Active cases": 1, "Deaths": 1, "Recovered": 1
        },
        margin: {top: 0, right: 30, bottom: 0, left: 30},
        init: function(self) {
          self.colour = d3.scaleOrdinal()
            .domain(["Active cases", "Deaths", "Recovered"])
            .range(["#ffed71", "#a63724", "#97ff70"]);
          self.update();
        },
        update: function(self) {
          self.g.attr("transform", "translate(" + self.width / 2 + "," + self.height / 2 + ")");
          const radius = Math.min(self.width, self.height) / 2;


          const pie = d3.pie()
            .value(function(d) { return d.value; })
            .sort(null);

          const arc = d3.arc()
            .outerRadius(radius)
            .innerRadius(radius * 0.3);

          self.g
            .selectAll("path")
            .data(pie(d3.entries(self.chartData)))
            .join(
              enter => {
                enter
                  .append("path")
                  .attr("d", arc)
                  .attr("fill", function(d){ return(self.colour(d.data.key)) })
                  .attr("stroke", "#ddd")
                  .style("stroke-width", "2px")
                  .style("opacity", 0.7)
              },
              update => {
                update.attr("d", arc)
              }
            )
        }
      },
      trendChart: {
        data: {series: []},
        margin: {top: 10, right: 30, bottom: 50, left: 100},
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
            .call(d3.axisBottom(self.x).tickFormat(d3.timeFormat("%d-%m-%Y")));

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
            .text("Number");

          self.colours = d3.scaleOrdinal()
            .domain(["Confirmed", "Deaths", "Recovered"])
            .range(["#ffed71", "#a63724", "#97ff70"]);

          self.update();
        },
        update: function(self) {
          const parseTime = d3.timeParse("%m/%d/%Y");

          self.x.domain([parseTime(self.chartData.series[0].Date), new Date()])

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
                    .attr("d", d3.line().y(d => self.y(d[col])).x(d => self.x(parseTime(d.Date))))
                    .attr("fill", "none")
                    .attr("stroke", self.colours(col))
                    .attr("stroke-width", 5);
                },
                update => {
                  update.attr("d", d3.line().y(d => self.y(d[col])).x(d => self.x(parseTime(d.Date))));
                }
              );
          });
        }
      }
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      // fetch data from CSSE github
      const url = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/";
      axios.all([
        axios.get(url + "time_series_covid19_confirmed_global.csv"),
        axios.get(url + "time_series_covid19_deaths_global.csv"),
        axios.get(url + "time_series_covid19_recovered_global.csv")
      ]).then(tables => {
        const data = tables.map(res => {
          const dat = res.data.split("\n").map(d => d.split(",").slice(4));
          const cols = dat[0].map(d => {
            let ds = d.split("/");
            return [("0" + ds[0]).slice(-2), ("0" + ds[1]).slice(-2), ("20" + ds[2]).slice(-4)].join("/");
            });
          const series = d3.range(0, cols.length).map(i => d3.sum(dat.slice(1).map(ds => +ds[i]).filter(d => !isNaN(d))));
          return {
            Dates: cols,
            Series: series,
            NCols: cols.length
          }
        });

        this.counts = data.map(ds => d3.max(ds.Series));

        data.forEach((ds, i) => {
          this.statsCards[i].footerText = "Last update: " + ds.Dates[ds.Dates.length - 1];
          this.statsCards[i].value = d3.max(ds.Series).toLocaleString("en-US");
        });

        this.trendChart.data = {
          columns: ["Confirmed", "Deaths", "Recovered"],
          series: d3.range(1, data[0].Dates.length)
            .map(i => {
              return {
                Date: data[0].Dates[i],
                Confirmed: data[0].Series[Math.min(i, data[0].NCols - 1)],
                Deaths: data[1].Series[Math.min(i, data[1].NCols - 1)],
                Recovered: data[2].Series[Math.min(i, data[2].NCols - 1)]
              }
            })
        }
      }).finally(() => {
        this.statusChart.data = {
          "Active cases": (this.counts[0] - this.counts[1] - this.counts[2]) / this.counts[0] * 100,
          Deaths: this.counts[1] / this.counts[0] * 100,
          Recovered: this.counts[2] / this.counts[0] * 100
        }
        //this.proportionChart.data.labels = this.proportionChart.data.series.map(d => Math.round(d) + "%")
      });

    }
  }
};
</script>
<style>
  .legend-active {
    fill: #ffed71;
    color: #ffed71;
  }
  .legend-deaths {
    fill: #a63724;
    color: #a63724
  }
  .legend-recovered {
    fill: #97ff70;
    color: #97ff70
  }

</style>
