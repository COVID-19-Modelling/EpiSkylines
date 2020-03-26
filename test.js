var axios = require("axios");
var _ = require("lodash");
var d3 = require("d3");
let dat;





axios.get("https://raw.githubusercontent.com/COVID-19-Modelling/DashboardData/master/Epi_plots/Plot_EpiCurveConfirm.html")
  .then(res => {
    console.log(res.data);

  });

