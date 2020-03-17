var axios = require("axios");


let dat;

axios.get("https://raw.githubusercontent.com/COVID-19-Modelling/DashboardData/master/Resources/papers.json")
  .then(res => {
    console.log(res.data);

  });
console.log(dat);
