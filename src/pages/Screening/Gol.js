const math = require("mathjs");
const PD = require("probability-distributions");


const States = {
  Disease: {
    S: "Susceptible", E: "Exposed", I: "Infectious", H: "Hospitalised", R: "Recovered", D: "Death"
  },
  Illness: {
    N: "None", A: "Asymptomatic", M: "Mild", S: "Severe"
  },
  Awareness: {
    U: "Unaware", A: "Aware", P: "Risk perceived", Q: "Isolated/Quarantined"
  }
};


class Transition {
  constructor(name, states, di, risk) {
    this.Name = name;
    this.States = states;
    this.Sampler = di;
    this.ByRisk = risk || false;
  }

  sample(ag, pars) {
    let tte;
    if (typeof this.Sampler === "string") {
      tte = PD.rexp(1, pars[this.Sampler])[0];
    } else {
      tte = this.Sampler(pars);
    }
    if (this.ByRisk) tte /= ag.Risk;
    return tte;
  }
}

class Event {
  constructor(tr, tte) {
    this.Transition = tr;
    this.TTE = tte;
  }
}

Event.NullEvent = new Event("", Infinity);

const Disease = {
  findNext(ag, pars, t) {}
};

const Illness = {
  findNext(ag, pars, t) {}
};

const Awareness = {
  findNext(ag, pars, t) {}
};

class Agent {
  constructor(x, y) {
    this.ID = x + "X" + y;
    this.Position = [x, y];

    this.State = {
      Disease: States.Disease.S,
      Illness: States.Illness.A,
      Awareness: States.Awareness.U
    };

    this.Next = {
      Disease: Event.NullEvent,
      Illness: Event.NullEvent,
      Awareness: Event.NullEvent
    };

    this.Risk = 0;
    this.Infectiousness = 0;

    this.Neighboiurs = [];
    this.History = {
      Time: 0,
      Initialise: 0
    };
  }

  transit(tr, ) {

  }
}


class Disease {
  constructor() {
    this.Parameters = [
      { name: "Beta", value: 0.3, min: 0 },
      { name: "Gamma", value: 0.2, min: 0 },
      { name: "DeathRate", value: 0.02, min: 0 }
    ];

    this.States = {
      Sus: { Trans: ["Inc", "Dea"], Risk: 0 },
      Inf: { Trans: ["Rec", "Dea"], Risk: 1 },
      Rec: { Trans: ["Dea"], Risk: 0 }
    };

    this.Transitions = {
      Inc: { Next: "Inf", Dist: "Beta", Risk: true },
      Rec: { Next: "Rec", Dist: "Gamma" },
      Dea: { Next: "Sus", Dist: "DeathRate" }
    };

    this.Agents = null;
    this.NRow = 0;
  }

  get defaultParameters() {
    const pars = {};
    this.Parameters.forEach(d => pars[d.name] = d.value);
    return pars;
  }

  summarise(time) {
    const rec = {};
    rec.Time = time;
    if (!this.Agents) {
      Object.keys(this.States).forEach(st => {
        rec[st] = 0;
      });
      return rec;
    }

    Object.keys(this.States).forEach(st => {
      rec[st] = Object.values(this.Agents).filter(ag => ag.State === st).length;
    });
    return rec;
  }

  initAgents(pars, nr) {
    this.NRow = nr;
    this.Agents = {};

    let ag;
    let sts = Object.keys(this.States);

    const mid = Math.round(nr / 2);
    for (let x = 0; x < nr; x++) {
      for (let y = 0; y < nr; y++) {
        ag = new Agent(x, y, x === mid && y === mid ? sts[1] : sts[0]);
        ag.Infectiousness = this.States[ag.State].Risk;
        this.Agents[ag.ID] = ag;
      }
    }
    Object.values(this.Agents).forEach(ag => this.initAgent(ag, pars));
  }

  goto(pars, time0, time1) {
    let time = time0;
    let ag;
    while (time < time1) {
      ag = Object.values(this.Agents).reduce(function(res, obj) {
        return obj.Next.Time < res.Next.Time ? obj : res;
      });
      time = ag.Next.Time;

      if (time > time1) {
        break;
      }
      this.goNext(ag, pars, time);
    }
  }

  initAgent(ag, pars) {
    this.updateRisk(ag);
    this.findNext(ag, pars, 0);
  }

  rotateState(id, pars, time) {
    const ag = this.Agents[id];
    this.transition(ag, this.SW[ag.State], pars, time);
  }

  goNext(ag, pars, time) {
    //const ag = this.Agents[pos[0] + "X" + pos[1]];
    this.transition(ag, ag.Next.State, pars, time);
  }

  transition(ag, new_state, pars, time) {
    const risk = this.States[new_state].Risk;
    const riskChange = this.States[ag.State].Risk !== risk;
    ag.State = new_state;
    this.findNext(ag, pars, time);
    if (riskChange) {
      ag.Infectiousness = risk;
      this.findNeighbours(ag).forEach(nei => {
        this.updateRisk(nei);
        this.findNext(nei, pars, time);
      });
    }
  }

  findNext(ag, pars, time) {
    const st = ag.State;
    let nxt = null, ti = Infinity;

    this.States[st].Trans.forEach(tr => {
      const val = this.Transitions[tr];
      let t = -math.log(math.random()) / pars[val.Dist];
      if (val.Risk) {
        t /= ag.Risk;
      }
      if (t < ti) {
        ti = t;
        nxt = val.Next;
      }
    });
    ag.Next = { State: nxt, Time: ti + time };
  }

  updateRisk(ag) {
    ag.Risk = math.sum(this.findNeighbours(ag).map(nei => nei.Infectiousness));
  }

  findNeighbours(ag) {
    const border = this.NRow;
    const x = ag.Position[0], y = ag.Position[1];
    const ti = y - 1 < 0 ? border - 1 : y - 1; // top index
    const ri = x + 1 === border ? 0 : x + 1; // right index
    const bi = y + 1 === border ? 0 : y + 1; // bottom index
    const li = x - 1 < 0 ? border - 1 : x - 1; // left index
    return [
      this.Agents[li + "X" + ti], this.Agents[x + "X" + ti],
      this.Agents[ri + "X" + ti], this.Agents[li + "X" + y],
      this.Agents[ri + "X" + y], this.Agents[li + "X" + bi],
      this.Agents[x + "X" + bi], this.Agents[ri + "X" + bi]
    ];
  }
}


let evt = Event.NullEvent;

console.log(evt);

