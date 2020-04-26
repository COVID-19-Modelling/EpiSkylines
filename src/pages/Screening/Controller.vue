<template>
  <card title="Controller">
    <b-button block variant="success" v-if="state !== 'running'"
              v-on:click="$emit('click', 'start')">Start</b-button>
    <b-button block variant="success" v-if="state === 'running'"
              v-on:click="$emit('click', 'stop')">Stop</b-button>
    <b-button block variant="success" v-if="state !== 'running'"
              v-on:click="$emit('click', 'step')">Step</b-button>
    <b-button block variant="warning" v-if="state !== 'running'"
              v-on:click="$emit('click', 'reset')">Reset</b-button>
    <br>
    <b-button block variant="info" v-b-modal.setting-modal>Setting</b-button>
    <b-button block v-b-modal.help-modal>Help</b-button>

    <b-modal
        id="setting-modal"
        ref="setting-modal"
        title="Parameter Setting"
        cancel-title="Default"
        cancel-variant="danger"
        no-close-on-esc
        no-close-on-backdrop
        hide-header-close
        ok-title="OK"
        v-on:ok="handleSubmit"
        v-on:close="handleSubmit"
        v-on:cancel="resetPars"
    >
      <b-form ref="setting" v-on:submit.stop.prevent="handleSubmit">
        <b-container fluid>
          <b-row class="my-1">
            <b-col sm="5">
              <label :for="nrow">Cells per row:</label>
            </b-col>
            <b-col sm="7">
              <b-form-input
                  number
                  type="number"
                  id="nrow"
                  max="50"
                  min="5"
                  step="1"
                  v-model="form.nrow"
              ></b-form-input>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="5">
              <label :for="ninf">Initial infected population:</label>
            </b-col>
            <b-col sm="7">
              <b-form-input
                  number
                  type="number"
                  id="ninf"
                  max="50"
                  min="1"
                  step="1"
                  v-model="form.ninf"
              ></b-form-input>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="5">
              <label :for="test_cap">Daily test cap:</label>
            </b-col>
            <b-col sm="7">
              <b-form-input
                  number
                  type="number"
                  id="test_cap"
                  max="50"
                  min="1"
                  step="1"
                  v-model="form.test_cap"
              ></b-form-input>
            </b-col>
          </b-row>
          <h5>Model parameters</h5>
          <b-row
              class="my-1"
              v-for="par in parameters"
              :key="par.key"
              :prepend="par.name"
          >
            <b-col sm="5">
              <label :for="`par-${par.name}`">{{ par.name }}:</label>
            </b-col>
            <b-col sm="7">
              <b-form-input
                  number
                  type="number"
                  :id="`par-${par.name}`"
                  :max="par.max"
                  :min="par.min"
                  step="0.0001"
                  v-model="form[par.key]"
              ></b-form-input>
            </b-col>
          </b-row>
        </b-container>
      </b-form>
    </b-modal>
    <b-modal id="help-modal" scrollable title="Help" ok-only>
      <markdown-card source="# I cannot help you"></markdown-card>
    </b-modal>
  </card>
</template>

<script>
  import { MarkdownCard } from "@/components";

  export default {
    name: "Controller",
    components: {
      MarkdownCard
    },
    props: {
      state: {
        type: String,
        required: true
      },
      help: {
        type: String,
        default: "I won't help you."
      },
      nrow: {
        type: Number,
        required: true
      },
      ninf: {
        type: Number,
        required: true
      },
      test_cap: {
        type: Number,
        default: 0
      },
      parameters: {
        type: Array,
        default: function() {
          return [
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
        },
        validator(value) {
          return value.every(d => {
            return d.name && d.value;
          });
        }
      }
    },
    data() {
      const form = {};
      this.parameters.forEach(d => (form[d.key] = d.value));
      form.nrow = this.nrow;
      form.ninf = this.ninf;
      form.test_cap = this.test_cap;
      return {
        form
      };
    },
    methods: {
      handleSubmit(evt) {
        evt.preventDefault();
        if (!this.$refs.setting.checkValidity()) {
          return;
        }
        this.$nextTick(() => {
          this.$refs["setting-modal"].hide();
        });
        this.$emit("parchange", this.form);
      },
      resetPars(evt) {
        evt.preventDefault();
        this.parameters.forEach(p => (this.form[p.key] = p.value));
      }
    }
  };
</script>

<style scoped>

</style>
