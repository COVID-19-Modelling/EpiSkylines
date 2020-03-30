var axios = require("axios");
var d3 = require("d3");
let dat;

const url = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/";
axios.all([
  axios.get(url + "time_series_covid19_confirmed_global.csv"),
  axios.get(url + "time_series_covid19_deaths_global.csv"),
  axios.get(url + "time_series_covid19_recovered_global.csv")
]).then(tables => {

  const data = tables.map(res => {
    const dat = res.data.split("\n").map(d => + d.split(",").slice(-1)[0]).slice(1);
    const countries = res.data.split("\n").map(d => d.split(",")[1]).slice(1);
    let ds = [];
    for (let i = 0; i < countries.length; i++) {
      ds.push({ N: dat[i], Location: countries[i]})
    }
    return d3.nest().key(d => d.Location).rollup(vs => d3.sum(vs, d => d.N)).object(ds);
  });

  const res = d3.keys(data[0]).map(k => {
    let c = data[0][k] || 0, d = data[1][k] || 0, r = data[2][k] || 0;
    return {
      Location: k,
      Confirmed: c,
      Active: c - d - r,
      Deaths: d
    }
  });
console.log(res)
});
