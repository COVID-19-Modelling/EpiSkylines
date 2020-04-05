import * as PD from "probability-distributions";
import * as odex from "odex";
import * as math from "mathjs";


class SimulationModel {
  constructor(data) {
    this.MinN = data[data.length - 1].Confirmed;
    this.ARD = [data[0].Infectious, data[0].Recovered, data[0].Died]
  }

  get AllParameters() {
    return [
      { name: "beta", label: "Transmission rate", text: "Transmission rate, per contact-day",
        value: 1, min: 0, step: 0.001 },
      { name: "r_rec", label: "Recovery rate", text: "Recovery rate, per day", value: 0.02, min: 0, step: 0.001 },
      { name: "r_die", label: "Death rate", text: "Death rate, per day", value: 0.01, min: 0, step: 0.001 },
      { name: "d_incubate", label: "Incubation period", text: "Incubation period, days", value: 5, min: 0, step: 0.1 },
      { name: "n", label: "Population size", text: "Effective population size", value: this.MinN * 5, min: this.MinN, step: 1}
    ]
  }

  get ParameterList() {
    return [];
  }

  getY0(pars) {
    return [pars.n - math.sum(this.ARD), this.ARD[0], this.ARD[1], this.ARD[2]];
  }

  get ParameterSettings() {
    const pl = this.ParameterList;
    return SimulationModel.AllParameters.filter(p => pl.indexOf(p.name) >= 0);
  }

  get AllStates() {
    return ["Uninfected", "Exposed", "Asymptomatic", "Infectious", "Recovered", "Died"];
  }

  get StateList() {
    return SimulationModel.AllStates;
  }

  dPrior() {
    return 0;
  }

  rPrior() {
    return {
      beta: PD.runif(1, 1, 3),
      r_rec: 0.1,
      r_die: 1 / 20
    };
  }

  generateModel() {

  }

  simulate(pars, back, fore, dt) {
    dt = dt || 1;
    const model = this.generateModel(pars);
    const s = new odex.Solver(this.StateList.length);
    s.denseOutput = true;

    const d = new Date();
    d.setDate(d.getDate() - back);

    const res = [];
    s.solve(model, 0, this.getY0(pars), back + fore, s.grid(dt, (x, y) => {
      d.setDate(d.getDate() + 1);
      let ds = { Date: d.toLocaleDateString("en-US") };
      this.StateList.forEach((k, i) => { ds[k] = y[i]});
      res.push(ds)
    }));
    return res;
  }
}


class SIR extends SimulationModel {
  dPrior(pars) {
    return Math.log(PD.dunif(pars.beta, 1, 3));
  }

  rPrior() {
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
    return ["beta", "r_rec", "r_die", "n"];
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


class SEIR extends SimulationModel {
  dPrior(pars) {
    return Math.log(PD.dunif(pars.beta, 1, 3));
  }

  rPrior() {
    return {
      beta: PD.runif(1, 1, 3),
      r_rec: 0.1,
      r_die: 1 / 20,
      d_incubate: 5
    };
  }

  get StateList() {
    return ["Uninfected", "Exposed", "Infectious", "Recovered", "Died"]
  }

  get ParameterList() {
    return ["beta", "r_rec", "r_die", "d_incubate", "n"];
  }

  getY0(pars) {
    let p_lat = pars.p_lat || 0.01;
    let pre = pars.n - math.sum(this.ARD);

    return [pre * (1 - p_lat), pre * p_lat, this.ARD[0], this.ARD[1], this.ARD[2]];
  }

  generateModel(pars) {
    return function(t, y) {
      const n = math.sum(y);

      return [
        - pars.beta * y[0] * y[2] / n,
        pars.beta * y[0] * y[2] / n - y[1] / pars.d_incubate,
        y[1] / pars.d_incubate - pars.r_rec * y[2] - pars.r_die * y[2],
        pars.r_rec * y[2],
        pars.r_die * y[2]
      ];
    };
  }
}

export { SimulationModel, SIR, SEIR };
