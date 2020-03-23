var axios = require("axios");
var _ = require("lodash");

let dat;





axios.get("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv")
  .then(res => {
    dat = res.data.split("\n");
    console.log(dat);
    let cols = dat[0].split(",");
    console.log("Last update: " + cols[cols.length - 1]);

    let total = dat.map(d => parseInt(d.split(",")[cols.length - 1]))
      .filter((d, i) => i >0)
      .reduce((a, b) => a + b, 0);
    console.log(total);

  });

