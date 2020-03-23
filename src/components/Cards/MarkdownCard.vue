<template>
  <card>
    <template slot="header">
      <h4 v-if="$slots.title || title" class="card-title">
        <slot name="title">
          {{title}}
        </slot>
      </h4>
      <p class="card-category">
        <slot name="subTitle">
          {{subTitle}}
        </slot>
      </p>
    </template>
    <div>
      <vue-simple-markdown :source = "source"></vue-simple-markdown>
      <div class="footer">
        <hr>
        <div class="stats">
          <slot name="footer"></slot>
        </div>
        <div class="pull-right">
        </div>
      </div>
    </div>
  </card>
</template>
<script>
  import Card from "./Card.vue";

  export default {
    name: "markdown-card",
    components: {
      Card
    },
    props: {
      footerText: {
        type: String,
        default: ""
      },
      title: {
        type: String,
        default: ""
      },
      subTitle: {
        type: String,
        default: ""
      },
      source: {
        type: String,
        default: "# Hello"
      }
    }
  };
</script>
<style>
</style>
