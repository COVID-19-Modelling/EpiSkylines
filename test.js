var axios = require("axios");


let dat;
axios.get("https://raw.githubusercontent.com/COVID-19-Modelling/Bass-COVID-19/master/Output/JSON/EpiIndices.json")
  .then(req => { dat = req.data;});

console.log(dat);
