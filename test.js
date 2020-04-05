var axios = require("axios");
var d3 = require("d3");

let PD = require("probability-distributions");
var odex = require("odex");
var math = require("mathjs");


class SimulationModel {
  get AllParameters() {
    return [
      { name: "beta", label: "Transmission rate", text: "Transmission rate, per contact-day",
        value: 1.5, min: 0 },
      { name: "r_rec", label: "Recovery rate", text: "Recovery rate, per day", value: 0.05, min: 0 },
      { name: "r_die", label: "Death rate", text: "Death rate, per day", value: 0.05, min: 0 },
      { name: "d_incubate", label: "Incubation period", text: "Incubation period, days", value: 5, min: 0 }
    ]
  }

  get ParameterList() {
    return [];
  }

  get ParameterSettings() {
    const pl = this.ParameterList;
    return this.AllParameters.filter(p => pl.indexOf(p.name) >= 0);
  }

  get AllStates() {
    return ["Uninfected", "Exposed", "Asymptomatic", "Infectious", "Recovered", "Died"];
  }

  get StateList() {
    return this.AllStates;
  }

  dprior(pars) {
    return 0;
  }

  rprior(pars) {
    return {
      beta: PD.runif(1, 1, 3),
      r_rec: 0.1,
      r_die: 1 / 20
    };
  }

  generateModel(pars) {
    return;
  }

  simulate(pars, y0, t0, t1, dt) {
    dt = dt || 1;
    const model = this.generateModel(pars);
    const s = new odex.Solver(this.StateList.length);
    s.denseOutput = true;

    const res = [];
    s.solve(model, t0, y0, t1, s.grid(dt, (x, y) => {
      let ds = { Time: x };
      this.StateList.forEach((k, i) => { ds[k] = y[i]});
      res.push(ds)
    }));
    return res;
  }
}


class SIR extends SimulationModel {
  dprior(pars) {
    return Math.log(PD.dunif(pars.beta, 1, 3));
  }

  rprior() {
    return {
      beta: PD.runif(1, 1, 3),
      r_rec: 0.1,
      r_die: 1 / 20
    };
  }

  get StateList() {
    return ["Uninfected", "Infectious", "Recovered", "Died"]
  }

  get ParameterList() {
    return ["beta", "r_rec", "r_die"];
  }

  generateModel(pars) {
    return function(t, y) {
      const n = math.sum(y);

      return [
        - pars.beta * y[0] * y[1] / n,
        pars.beta * y[0] * y[1] / n - pars.r_rec * y[1] - pars.r_die * y[1],
        pars.r_rec * y[1],
        pars.r_die * y[1]
      ];
    };
  }
}



const Model = new SIR();

let ps, simu;

console.log(Model.ParameterSettings);

simu = Model.simulate(Model.rprior(), [700, 100, 0, 0], 0, 10);
console.log(simu);

for (let i = 0; i < 100; i++) {
  ps = Model.rprior();
  simu = Model.simulate(ps, [700, 100, 0, 0], 0, 10);
}

