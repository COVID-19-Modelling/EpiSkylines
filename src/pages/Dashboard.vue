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
      <div class="col-md-4 col-12">
        <d3-card title="Disease status"
                    sub-title=""
                    :chart-data="statusChart.data"
                    :draw-chart="statusChart.init"
                    :update-chart="statusChart.update">
          <div slot="legend">
            <i class="fa fa-circle legend-active"></i> Active cases
            <i class="fa fa-circle legend-deaths"></i> Deaths
            <i class="fa fa-circle legend-recovered"></i> Recovered
          </div>
        </d3-card>
      </div>
      <div class="col-md-8 col-12">
        <chart-card title="Worldwide trend"
                    sub-title=""
                    :chart-data="activityChart.data"
                    :chart-options="activityChart.options">
          <span slot="footer">
            <i class="ti-check"></i> Data information certified
          </span>
          <div slot="legend">
            <i class="fa fa-circle legend-active"></i> Active cases
            <i class="fa fa-circle legend-deaths"></i> Deaths
            <i class="fa fa-circle legend-recovered"></i> Recovered
          </div>
        </chart-card>
      </div>

      <div class="col-12">
        <chart-card title="Some indices"
                    sub-title="by country"
                    :chart-data="usersChart.data"
                    :chart-options="usersChart.options">
          <span slot="footer">
            <i class="ti-reload"></i> Updated 3 minutes ago
          </span>
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> A
            <i class="fa fa-circle text-danger"></i> B
            <i class="fa fa-circle text-warning"></i> C
          </div>
        </chart-card>
      </div>


    </div>

  </div>
</template>
<script>
import { StatsCard, ChartCard, D3Card } from "@/components/index";
import Chartist from "chartist";
import * as d3 from "d3";
import axios from "axios"

export default {
  components: {
    StatsCard,
    ChartCard,
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
          footerText: "Updated now",
          footerIcon: "ti-time"
        },
        {
          type: "danger",
          icon: "ti-wallet",
          title: "Total death",
          value: "8,732",
          footerText: "Last day",
          footerIcon: "ti-time"
        },
        {
          type: "success",
          icon: "ti-pulse",
          title: "Total recovered",
          value: "83,313",
          footerText: "Updated now",
          footerIcon: "ti-time"
        },
        {
          type: "info",
          icon: "ti-pulse",
          title: "",
          value: "",
          footerText: "Updated now",
          footerIcon: "ti-time"
        }
      ],
      usersChart: {
        data: {
          labels: [
            "9:00AM",
            "12:00AM",
            "3:00PM",
            "6:00PM",
            "9:00PM",
            "12:00PM",
            "3:00AM",
            "6:00AM"
          ],
          series: [
            [287, 385, 490, 562, 594, 626, 698, 895, 952],
            [67, 152, 193, 240, 387, 435, 535, 642, 744],
            [23, 113, 67, 108, 190, 239, 307, 410, 410]
          ]
        },
        options: {
          low: 0,
          high: 1000,
          showArea: true,
          height: "245px",
          axisX: {
            showGrid: false
          },
          lineSmooth: Chartist.Interpolation.simple({
            divisor: 3
          }),
          showLine: true,
          showPoint: false
        }
      },
      activityChart: {
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Mai",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ],
          series: [
            [542, 543, 520, 680, 653, 753, 326, 434, 568, 610, 756, 895],
            [230, 293, 380, 480, 503, 553, 600, 664, 698, 710, 736, 795]
          ]
        },
        options: {
          seriesBarDistance: 10,
          axisX: {
            showGrid: false
          },
          height: "245px"
        }
      },
      statusChart: {
        data: {
          "Active cases": 1, "Deaths": 1, "Recovered": 1
        },
        margin: {top: 0, right: 30, bottom: 0, left: 30},
        init: function(self) {
          self.update();
        },
        update: function(self) {
          self.g.attr("transform", "translate(" + self.width / 2 + "," + self.height / 2 + ")");
          const radius = Math.min(self.width, self.height) / 2;
          const color = d3.scaleOrdinal()
            .domain(["Active cases", "Deaths", "Recovered"])
            .range(["#ffed71", "#a63724", "#97ff70"]);

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
                  .attr("fill", function(d){ return(color(d.data.key)) })
                  .attr("stroke", "#ddd")
                  .style("stroke-width", "2px")
                  .style("opacity", 0.7)
              },
              update => {
                update.attr("d", arc)
              }
            )
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
        axios.get(url + "time_series_19-covid-Confirmed.csv"),
        axios.get(url + "time_series_19-covid-Deaths.csv"),
        axios.get(url + "time_series_19-covid-Recovered.csv")
      ]).then(tables => {
        tables.forEach((res, i) => {
          const dat = res.data.split("\n");
          const cols = dat[0].split(",");
          this.counts[i] = dat.map(d => parseInt(d.split(",")[cols.length - 1]))
            .filter((d, i) => i >0)
            .reduce((a, b) => a + b, 0);

          this.statsCards[i].footerText = "Last update: " + cols[cols.length - 1];
          this.statsCards[i].value = this.counts[i].toLocaleString("en-US");
        })
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
