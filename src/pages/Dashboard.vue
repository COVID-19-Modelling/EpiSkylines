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
            <p>{{$t(stats.title)}}</p>
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
      <div class="col-md-5 col-12">
        <d3-card title="COVID-19 time-series"
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
      <div class="col-md-7 col-12">
        <d3-card title="Occurrence by country/region, all time"
                 :sub-title="distChart.data.selected"
                 :chart-data="distChart.data"
                 :draw-chart="distChart.init"
                 :update-chart="distChart.update"
                 :margin="distChart.margin">
          <p id="sel_country"></p>
          <div slot="legend">
            <div class="row">
              <button class="btn btn-outline-warning" v-on:click="selectIndex('Confirmed')">Confirmed</button>
              <button class="btn btn-warning" v-on:click="selectIndex('Active')">Active</button>
              <button class="btn btn-danger" v-on:click="selectIndex('Deaths')">Deaths</button>
            </div>
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
          title: "indices.tot_confirmed",
          value: "214,894",
          footerText: "Updating",
          footerIcon: "ti-time"
        },
        {
          type: "danger",
          icon: "ti-wallet",
          title: "indices.tot_deaths",
          value: "8,732",
          footerText: "Updating",
          footerIcon: "ti-time"
        },
        {
          type: "success",
          icon: "ti-pulse",
          title: "indices.tot_recovered",
          value: "83,313",
          footerText: "Updating",
          footerIcon: "ti-time"
        },
        {
          type: "info",
          icon: "ti-control-forward",
          title: "Doubling Time",
          value: "",
          footerText: "Since today",
          footerIcon: "ti-time"
        }
      ],
      trendChart: {
        data: {series: []},
        margin: {top: 5, right: 30, bottom: 80, left: 70},
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
            .range(["#ffab16", "#a6333d", "#23ff4f"]);

          self.update();
        },
        update: function(self) {
          const parseTime = d3.timeParse("%m/%d/%Y");

          self.x.domain([parseTime(self.chartData.series[0].Date), new Date()]);

          self.y.domain([0, d3.max(self.chartData.series, ent => d3.max(d3.values(ent).slice(1)))]);

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

          // pie
          self.g.attr("transform", "translate(" + ((self.width - self.margin.left - self.margin.right) / 3 + self.margin.left) + "," + self.height / 3 + ")");
          const radius = Math.min(
            self.width - self.margin.left - self.margin.right,
            self.height - self.margin.top - self.margin.bottom) / 6;

          const pie = d3.pie()
            .value(function(d) { return d.value; })
            .sort(null);

          const arc = d3.arc()
            .outerRadius(radius)
            .innerRadius(radius * 0.3);

          self.g
            .selectAll("path")
            .data(pie(d3.entries(self.chartData.counts)))
            .join(
              enter => {
                enter
                  .append("path")
                  .attr("d", arc)
                  .attr("fill", d => self.colours(d.data.key))
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
      distChart: {
        data: {
          n: 20,
          selected: "Confirmed",
          burden: []
        },
        margin: {top: 5, right: 5, bottom: 5, left: 5},
        init(self) {
          self.treemap = d3.treemap().tile(d3.treemapResquarify)
            .size([
            self.width - self.margin.left - self.margin.right,
            self.height - self.margin.top - self.margin.bottom]);

        },
        update(self) {
          if (self.chartData.burden.length <= 1) return;
          self.colours = d3.scaleOrdinal().range(d3.schemeTableau10)
            .domain(self.chartData.burden.map(d => d.Location));

          const selected = self.chartData.selected;

          d3.select("#sel_country").text("click to pick up a country");

          const data = {
            Location: "World",
            children: self.chartData.burden
          };

          const root = d3.hierarchy(data, (d) => d.children)
            .sum((d) => d[selected]);

          const tree = self.treemap(root);


          self.g
            .selectAll("g.node")
            .data(tree.leaves())
            .join(enter => {
              enter.append("g").attr("class", "node")
                .call(gp => gp.append("rect")
                  .attr('x', d => d.x0)
                  .attr('y', d => d.y0)
                  .attr('width', d => d.x1 - d.x0)
                  .attr('height', d => d.y1 - d.y0)
                  .style("stroke", "black")
                  .style("fill", d => self.colours(d.data.Location))
                  .on("click", d => {
                    d3.select("#sel_country")
                      .text(d.data.Location + ", " + self.chartData.selected + " " + d.value.toLocaleString('en-us'));
                  }))
                .call(gp => gp.append("text")
                  .attr("x", d => d.x0 + 10)
                  .attr("y", d => d.y0 + 20)
                  .text(d => d.data.Location)
                  .attr("font-size", "15px")
                  .attr("fill", "white"));
              },
              update => {
                update.transition().duration(1000)
                  .call(box => box.select("rect").attr('x', d => d.x0)
                    .attr('y', d => d.y0)
                    .attr('width', d => d.x1 - d.x0)
                    .attr('height', d => d.y1 - d.y0))
                  .call(label => label.select("text").attr("x", d => d.x0 + 10)
                    .attr("y", d => d.y0 + 20)
                    .text(d => d.data.Location));
              },
              exit => {
                exit.transition().duration(200)
                  .remove();
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
    statsCards: { deep: true }
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
          res.data = res.data.replace('"Korea, South"', "South Korea").replace("Taiwan*", "Taiwan");
          const dat = res.data.split("\n").map(d => d.split(",").slice(4));
          const cols = dat[0].map(d => {
            d = d.replace(/\s+/, "");
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
            }),
          counts: {
            "Active cases": (this.counts[0] - this.counts[1] - this.counts[2]) / this.counts[0] * 100,
            Deaths: this.counts[1] / this.counts[0] * 100,
            Recovered: this.counts[2] / this.counts[0] * 100
          }
        };

        this.statsCards[3].value = (() => {
          const ds = data[0].Series.slice(-3);
          const gr = (Math.log(ds[2]) - Math.log(ds[0])) / 2;
          console.log(gr)
          return (Math.log(2) / gr).toFixed(1) + " Days";
        })();

        const lastday = tables.map(res => {
          res.data = res.data.replace('"Korea, South"', "South Korea").replace("Taiwan*", "Taiwan");

          const dat = res.data.split("\n").map(d => + d.split(",").slice(-1)[0]).slice(1);
          const countries = res.data.split("\n").map(d => d.split(",")[1]).slice(1);
          let ds = [];
          for (let i = 0; i < countries.length; i++) {
            ds.push({ N: dat[i], Location: countries[i]})
          }
          return d3.nest().key(d => d.Location).rollup(vs => d3.sum(vs, d => d.N)).object(ds);
        });

        this.distChart.data = {
          n: 20,
          selected: "Confirmed",
          burden: d3.keys(lastday[0]).map(k => {

              let c = lastday[0][k] || 0, d = lastday[1][k] || 0, r = lastday[2][k] || 0;
              return {
                Location: k,
                Confirmed: c,
                Active: c - d - r,
                Deaths: d
              };
            }).sort((a, b) => d3.descending(a.Confirmed, b.Confirmed))
        };
      });

    },
    selectIndex(index) {
      this.distChart.data = {
        n: this.distChart.data.n,
        selected: index,
        burden: this.distChart.data.burden
      }
    }
  }
};
</script>
<style scoped>
  .legend-active {
    fill: #ffab16;
    color: #ffab16;
  }
  .legend-deaths {
    fill: #a6333d;
    color: #a6333d
  }
  .legend-recovered {
    fill: #23ff4f;
    color: #23ff4f
  }
</style>
