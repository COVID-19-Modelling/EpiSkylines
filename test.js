var axios = require("axios");
var d3 = require("d3");

let PD = require("probability-distributions");
var odex = require("odex");
var math = require("mathjs");

const url = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/";
axios.all([
  axios.get(url + "time_series_covid19_confirmed_global.csv"),
  axios.get(url + "time_series_covid19_deaths_global.csv"),
  axios.get(url + "time_series_covid19_recovered_global.csv")
]).then(tables => {
  let last14 = tables.map(res => {
    const lines = res.data.split("\n").map(d => d.split(","));
    const cols = lines[0].slice(-14).map(d => {
      d = d.replace(/^\s+/, "");
      let ds = d.split("/");
      return [("0" + ds[0]).slice(-2), ("0" + ds[1]).slice(-2), ("20" + ds[2]).slice(-4)].join("/");
    });

    let dat = lines.slice(1).map(d => d.slice(-14).map(d => + d));

    const countries = lines.slice(1).map(d => d[1]);

    let ds = [];
    for (let i = 0; i < countries.length; i++) {
      if (countries[i]) {
        ds.push({
          Date: cols,
          Series: dat[i],
          Location: countries[i].replace(/\s*/, "")})
      }
    }

    return d3.nest().key(d => d.Location)
      .rollup(vs => {
        let cs = [];
        for (let i = 0; i < vs[0].Series.length; i++) {
          cs.push(d3.sum(vs, d => d.Series[i]))
        }
        return {
          Date: vs[0].Date,
          Series: cs,
          Location: vs[0].Location
        };
      }).object(ds);
  });

  let selected = d3.entries(last14[0])
    .filter(d => d.value.Series[0] > 0 && d.value.Series[13] >= 100)
    .map(d => d.key);

  const data = {};
  selected.forEach(country => {
    data[country] = d3.range(0, 13).map(i => {
      const ds = last14.map(d => d[country].Series[i]);
      return {
        Date: last14[0][country].Date[i],
        Location: country,
        Confirmed: ds[0],
        Infectious: ds[0] - ds[1] - ds[2],
        Recovered: ds[1],
        Deaths: ds[2]
      };
    });
  });
});


