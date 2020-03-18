var axios = require("axios");
var _ = require("lodash");

let dat;

axios.get("https://raw.githubusercontent.com/COVID-19-Modelling/Bass-COVID-19/master/Output/JSON/EpiIndices.json")
  .then(res => {
    dat = res.data;
    dat = Object.values(_.groupBy(dat, d => d.Location))
      .map(v => {
        let ent = { Location: v[0].Location};
        v.forEach(col => {
          switch(col.variable) {
            case "kappa":
              ent["100kappa"] = `${(100*col.mean).toFixed(1)} (${(100*col.lower).toFixed(1)} - ${(100*col.upper).toFixed(1)})`;
              break;
            case "beta":
              ent["beta"] = `${col.mean.toFixed(2)} (${col.lower.toFixed(2)} - ${col.upper.toFixed(2)})`;
              break;
            case "m":
              ent["m"] = `${col.mean.toFixed()} (${col.lower.toFixed()} - ${col.upper.toFixed()})`;
              break;
            case "R0":
              ent["R0"] = `${col.mean.toFixed(2)} (${col.lower.toFixed(2)} - ${col.upper.toFixed(2)})`;
              ent.key = col.mean;
              break;
            case "R(t)":
              ent["R(t)"] = `${col.mean.toFixed(2)} (${col.lower.toFixed(2)} - ${col.upper.toFixed(2)})`;
              break;
          }
        });
        return ent;
      }).sort((a, b) => b.key - a.key);

    console.log(dat)
  });

