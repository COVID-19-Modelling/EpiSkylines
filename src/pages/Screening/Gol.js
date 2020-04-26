const PD = require("probability-distributions");


const States = {
  Disease: {
    S: "Susceptible", E: "Exposed", I: "Infectious", H: "Hospitalised", R: "Recovered", D: "Death"
  },
  Illness: {
    A: "Asymptomatic/No symptom", M: "Mild", S: "Severe"
  },
  Visible: {
    M: "Mild symptoms", S: "Severe symptoms", H: "Hospitalised", R: "Recovered", D: "Death", O: "Invisible"
  }
};


class Event {
  constructor(tr, tte) {
    this.Transition = tr;
    this.TTE = tte;
  }
}

Event.NullEvent = new Event("", Infinity);


const Events = {
  beingInfectious(ag) {
    ag.State.Disease = States.Disease.I;
  },
  recovery(ag) {
    ag.State.Disease = States.Disease.R;
    ag.State.Illness = States.Illness.A;
  },
  death(ag) {
    ag.State.Disease = States.Disease.D;
  },
  casualIllness(ag) {
    ag.State.Illness = States.Illness.M;
  },
  symptomRelief(ag) {
    ag.State.Illness = States.Illness.A;
  },
  symptomOnset(ag) {
    ag.State.Illness = States.Illness.M;
  },
  beingSerious(ag) {
    ag.State.Illness = States.Illness.S;
  }
};


class Agent {
  constructor(x, y) {
    this.ID = x + "X" + y;
    this.Position = [x, y];

    this.State = {
      Disease: States.Disease.S,
      Illness: States.Illness.A
    };

    this.NextEvents = [];

    this.Awareness = 0;

    this.Neighboiurs = [];
    this.History = [{
      Time: 0,
      Event: "Initialised"
    }];
  }

  get Appearance() {
    if (this.State.Disease === States.Disease.H) {
      return States.Visible.H;
    } else if (this.State.Disease === States.Disease.R) {
      return States.Visible.R;
    } else if (this.State.Disease === States.Disease.D) {
      return States.Visible.D;
    } else if (this.State.Illness === States.Illness.M) {
      return States.Visible.M;
    } else if (this.State.Illness === States.Illness.S) {
      return States.Visible.S;
    } else {
      return States.Visible.O;
    }
  }

  get Next() {
    return this.NextEvents.reduce((prev, curr) => (prev.Time < curr.Time)? prev:curr, Event.NullEvent);
  }

  infected(by, t) {
    this.State.Disease = States.Disease.E;
    this.History.push({ Time: t, Event: "Infection", By: by });
  }

  isolated(t) {
    this.State.Disease = States.Disease.H;
    this.History.push({ Time: t, Event: "Isolated" });
  }

  findNext(pars, ti) {
    this.NextEvents = [];
    if (this.State.Disease === States.Disease.E) {
      this.NextEvents.push(new Event("beingInfectious", PD.rexp(1, pars.r_act)[0] + ti));
    } else if (this.State.Disease === States.Disease.I || this.State.Disease === States.Disease.H) {
      if (this.State.Illness === States.Illness.A) {
        this.NextEvents.push(new Event("symptomOnset", PD.rexp(1, pars.r_sym)[0] + ti));
      } else if (this.State.Illness === States.Illness.M) {
        this.NextEvents.push(new Event("beingSerious", PD.rexp(1, pars.r_serious)[0] + ti));
      }
      this.NextEvents.push(new Event("recovery", PD.rexp(1, pars.r_rec)[0] + ti));
      this.NextEvents.push(new Event("death", PD.rexp(1, pars.r_die)[0] + ti));
    } else if (this.State.Disease === States.Disease.S) {
      if (this.State.Illness === States.Illness.A) {
        this.NextEvents.push(new Event("casualIllness", PD.rexp(1, pars.r_ill)[0] + ti));
      } else if (this.State.Illness === States.Illness.M) {
        this.NextEvents.push(new Event("symptomRelief", PD.rexp(1, pars.r_relief)[0] + ti));
      }
    }
  }

  execute(evt) {
    const tr = Events[evt.Transition];
    if (tr !== undefined) {
      tr(this);
      this.History.push({Time: evt.TTE, Event: evt.Transition});
    }
  }
}


class COVID {
  constructor() {
    this.Parameters = [
      { key: "r_beta", name: "Beta", value: 0.3, min: 0 },
      { key: "r_act", name: "Activation rate (Infectiousness)", value: 0.2, min: 0 },
      { key: "r_sym", name: "Symptom onset rate", value: 0.02, min: 0 },
      { key: "r_serious", name: "Severity increase rate", value: 0.1, min: 0 },
      { key: "r_iso", name: "Care-seeking rate", value: 0.1, min: 0 },
      { key: "r_ill", name: "Casual illness rate", value: 0.01, min: 0 },
      { key: "r_relief", name: "Non-COV Symptom relief", value: 0.01, min: 0 },
      { key: "r_die", name: "Death rate", value: 0.02, min: 0 },
      { key: "r_rec", name: "Recovery rate", value: 0.06, min: 0 }
    ];

    this.VisibleStates = Object.values(States.Visible);

    this.Agents = null;
    this.NRow = 5;
    this.NI0 = 5;
    this.Last = {};
    this.TestQueue = [];
    this.TestRemain = 2;
  }

  get defaultParameters() {
    const pars = {};
    this.Parameters.forEach(d => pars[d.key] = d.value);
    return pars;
  }

  summarise(ti) {
    const rec = {};
    rec.Time = ti;
    if (!this.Agents) {
      rec["Active cases"] = 0;
      rec["Undetected"] = 0;
      rec["Serious"] = 0;
      rec["Mild"] = 0;
      rec["Recovered"] = 0;
      rec["Death"] = 0;
      this.Last = rec;
      return rec;
    }

    rec["Active cases"] = Object.values(this.Agents).filter(ag => {
      return ag.State.Disease === States.Disease.I || ag.State.Disease === States.Disease.H;
    } ).length;

    rec["Undetected"] = Object.values(this.Agents).filter(ag => ag.State.Disease === States.Disease.I).length;
    rec["Serious"] = Object.values(this.Agents).filter(ag => ag.State.Illness === States.Illness.S).length;
    rec["Mild"] = Object.values(this.Agents).filter(ag => ag.State.Illness === States.Illness.M).length;
    rec["Recovered"] = Object.values(this.Agents).filter(ag => ag.State.Disease === States.Disease.R).length;
    rec["Death"] = Object.values(this.Agents).filter(ag => ag.State.Disease === States.Disease.R).length;

    this.Last = rec;
    return rec;
  }

  initAgents(pars, nr, n_inf) {
    this.NRow = nr;
    this.Agents = {};

    for (let x = 0; x < nr; x++) {
      for (let y = 0; y < nr; y++) {
        let ag = new Agent(x, y);
        this.findNeighbours(ag);
        this.Agents[ag.ID] = ag;
      }
    }

    const inf = PD.sample(Object.keys(this.Agents), n_inf);

    Object.values(this.Agents).forEach(ag => {
      if (inf.indexOf(ag.ID) >= 0) {
        ag.State.Disease = States.Disease.I;
      }

      this.findNeighbours(ag);
      ag.findNext(pars, 0);
    });
  }


  update(pars, t0, t1) {
    Object.values(this.Agents).forEach(ag => {
      this.updateAgent(ag, pars, t0, t1);
    });
    this.contact(pars, t0, t1);
    this.detectCases(pars, t0, t1);
  }

  contact(pars, t0, t1) {
    const dt = t1 - t0;
    Object.values(this.Agents)
      .filter(ag => ag.State.Disease === States.Disease.S)
      .forEach(ag => {
        const nei = ag.Neighboiurs.filter(nei => this.Agents[nei].State.Disease === States.Disease.I);
        if (nei.length > 0) {
          if (PD.rexp(1 , pars.r_beta * nei.length * dt)[0] < dt) {
            ag.infected(PD.sample(nei, 1)[0], t1);
            ag.findNext(pars, t1);
          }
        }
      });
  }

  detectCases(pars, t0, t1) {
    const p_h = -Math.expm1(-pars.r_iso * (t1 - t0));
    const queue = [];

    let cap = this.TestRemain;
    if (cap === 0) return;

    let sym_m = Object.values(this.Agents)
      .filter(ag => ag.State.Illness === States.Illness.M)
      .filter(() => Math.random() < p_h);
    if (sym_m.length > 0) sym_m = PD.sample(sym_m);

    let sym_s = Object.values(this.Agents)
      .filter(ag => ag.State.Illness === States.Illness.S)
      .filter(() => Math.random() < p_h);
    if (sym_s.length > 0) sym_s = PD.sample(sym_s);

    for (let i = 0; i < sym_s.length && queue.length < cap; i++) {
      queue.push(sym_s[i]);
    }
    for (let i = 0; i < sym_m.length && queue.length < cap; i++) {
      queue.push(sym_m[i]);
    }

    queue.forEach(ag => {
      if (ag.State.Disease === States.Disease.I) {
        ag.isolated(t1);
        ag.findNext(pars, t1);
      }

    });

    const found = queue.filter(ag => ag.State.Disease === States.Disease.H).length;
    console.log(`Test ${ queue.length }, found ${ found }`);

  }

  updateAgent(ag, pars, t0, t1) {
    let next = ag.Next;
    let ti = t0;
    while(next.TTE < t1) {
      ag.execute(next);
      ti = next.TTE;
      ag.findNext(pars, ti);
      next = ag.Next;
    }
  }

  findNeighbours(ag) {
    const border = this.NRow;
    const x = ag.Position[0], y = ag.Position[1];
    const ti = y - 1 < 0 ? border - 1 : y - 1; // top index
    const ri = x + 1 === border ? 0 : x + 1; // right index
    const bi = y + 1 === border ? 0 : y + 1; // bottom index
    const li = x - 1 < 0 ? border - 1 : x - 1; // left index
    ag.Neighboiurs = [
      li + "X" + ti, x + "X" + ti,
      ri + "X" + ti, li + "X" + y,
      ri + "X" + y, li + "X" + bi,
      x + "X" + bi, ri + "X" + bi
    ];
  }
}

export { COVID };
