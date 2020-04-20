<template>
  <card title="Settings">
    <p>Location</p>
    <b-form-select v-model="selected" :options="locations"></b-form-select>
    <slot></slot>
  </card>
</template>

<script>
  export default {
    name: "LocSelector",
    props: {
      locations: {
        type: Array,
        default: function() {
          return ["US"]
        }
      },
      selectedLocation: {
        type: String,
        default: "US"
      }
    },
    data() {
      return {
        selected: this.selectedLocation
      };
    },
    watch: {
      selected() {
        this.emitLocation();
      },
      selectedLocation() {
        this.selected = this.selectedLocation;
      }
    },
    methods: {
      emitLocation() {
        this.$emit("locchange", this.selected);
      }
    },
  }
</script>

<style scoped>
  input:invalid {
    box-shadow: 0 0 5px 1px red;
  }
</style>
