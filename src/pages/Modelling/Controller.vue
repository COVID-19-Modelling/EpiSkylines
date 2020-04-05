<template>
<card title="Settings">
  <b-form-group>
    <p>Model structure</p>
    <b-form-checkbox-group
        v-model="structure"
        :options="structuralOptions"
        stacked
    ></b-form-checkbox-group>
  </b-form-group>
  <b-form ref="setting">
    <p>Model parameters</p>
    <b-form-group  fluid>
      <b-row class="my-1" v-for="par in parameters" :key="par.name" :prepend="par.name">
        <b-col sm="5">
          <label :for="`par-${par.name}`">{{ par.label }}:</label>
        </b-col>
        <b-col sm="7">
          <b-form-input
              number
              type="number"
              :id="`par-${par.name}`"
              :max="par.max"
              :min="par.min"
              step="0.001"
              :disabled="!parametersInUse.includes(par.name)"
              v-model="pars[par.name]"
          ></b-form-input>
        </b-col>
        <b-tooltip :target="`par-${par.name}`" triggers="hover">
          {{ par.text }}
        </b-tooltip>
      </b-row>
      <b-button block variant="success" v-if="status !== 'running'"
                v-on:click="emitPars()">Run</b-button>
      <b-button block variant="warning" v-if="status !== 'running'"
                v-on:click="resetPars()">Reset</b-button>
    </b-form-group>
  </b-form>
</card>
</template>

<script>
  export default {
    name: "Controller",
    props: {
      status: {
        type: String,
        default: "waiting"
      },
      structuralOptions: {
        type: Array,
        default: function() {
          return [
            { value: "lat", text: "Latent period" },
            { value: "asym", text: "Asymptomatic transmission" },
            { value: "cap_test", text: "Testing capacity" }
          ];
        }
      },
      parameters: {
        type: Array,
        default: function() {
          return [
            { name: "beta", label: "Transmission rate", text: "Transmission rate", value: 1.5, min: 0 },
            { name: "r rec", label: "Recovery rate", text: "Recovery rate", value: 0.2, min: 0 },
            { name: "r die", label: "Death rate", text: "Death rate", value: 0.02, min: 0 }
          ];
        },
        validator(value) {
          return value.every(d => {
            return d.name && d.value;
          });
        }
      },
      parametersInUse: {
        type: Array,
        default: function() {
          return ["beta", "r rec", "r die"];
        }
      }
    },
    data() {
      const pars = {};
      this.parameters.forEach(d => (pars[d.name] = d.value));

      return {
        pars,
        requests: 0,
        structure: []
      };
    },
    computed: {
      input() {
        return {
          structure: this.structure,
          parameters: this.pars
        }
      },
      parametersShow() {
        return this.parameters.filter(p => this.parametersInUse.includes(p.name));
      }
    },
    mounted() {
      this.emitPars();
    },
    watch: {
      structure() {
        this.emitPars();
      }
    },
    methods: {
      resetPars() {
        this.parameters.forEach(p => (this.pars[p.name] = p.value));
        this.emitPars();
      },
      emitPars() {
        this.$emit("parchange", this.input)
      }
    },
  }
</script>

<style scoped>

</style>
