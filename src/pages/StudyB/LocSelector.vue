<template>
  <card title="Settings">
    <p>Location</p>
    <b-form-select v-model="selectedLocation" :options="locations"></b-form-select>
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
      }
    },
    data() {
      return {
        selectedLocation: "US"
      };
    },
    watch: {
      selectedLocation() {
        this.emitLocation();
      }
    },
    methods: {
      emitLocation() {
        this.$emit("locchange", this.selectedLocation);
      }
    },
  }
</script>

<style scoped>
  input:invalid {
    box-shadow: 0 0 5px 1px red;
  }
</style>
