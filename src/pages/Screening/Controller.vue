<template>
  <card title="Controller">
    <b-button block variant="success" v-if="status !== 'running'"
              v-on:click="$emit('click', 'start')">Start</b-button>
    <b-button block variant="success" v-if="status === 'running'"
              v-on:click="$emit('click', 'stop')">Stop</b-button>
    <b-button block variant="success" v-if="status !== 'running'"
              v-on:click="r$emit('click', 'step')">Step</b-button>
    <b-button block variant="warning" v-if="status !== 'running'"
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
          <b-row
              class="my-1"
              v-for="par in parameters"
              :key="par.name"
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
                  v-model="form[par.name]"
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
      parameters: {
        type: Array,
        default: function() {
          return [
            { name: "Beta", value: 1.5, min: 0 },
            { name: "Gamma", value: 0.2, min: 0 },
            { name: "DeathRate", value: 0.02, min: 0 }
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
      this.parameters.forEach(d => (form[d.name] = d.value));
      form.nrow = this.nrow;
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
        this.parameters.forEach(p => (this.form[p.name] = p.value));
      }
    }
  };
</script>

<style scoped>

</style>
