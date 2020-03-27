var axios = require("axios");
var _ = require("lodash");
var d3 = require("d3");
let dat;




axios.get("https://covid19dashboard.cdc.gov.tw/dash5")
  .then(res => {
    let src = Object.values(res.data);
    const now = new Date();

    src = src.filter(d => {
      let time = d['發病日'].split("/");
      time = new Date(2020, + time[0] - 1, time[1]);
      return now > time;
    });
    console.log(src);
    //total = src.reduce((a, b) => a + b.本土感染, 0) / src.reduce((a, b) => a + b.境外移入, 0);
    src = src.slice(-7);
    let out = src.reduce((a, b) => a + b["境外移入"], 0), dom = src.reduce((a, b) => a + b["本土感染"], 0);


  })
