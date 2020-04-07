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
      <div class="md-body">
        <vue-simple-markdown :source="raw" :postrender="postRender"></vue-simple-markdown>
      </div>

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
  import axios from "axios";

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
      },
      url: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        raw: this.source,
        mathreg: /\\\[([\s*\w\-{}()\\+?#=.:]+)\\]/g
      }
    },
    mounted() {
      this.updateContent();
    },
    watch: {
      url() {
        this.updateContent();
      },
      source() {
        this.updateContent();
      },
    },
    methods: {
      updateContent() {
        if (this.url !== "") {
          axios.get(this.url)
            .then(res => {
              this.raw = res.data;
            })
            .catch(() => {
              this.raw = this.source;
            })
        }
      },
      postRender(source) {
        source = this.parseMath(source);
        return source;
      },
      parseMath(source) {
        return source.replace(this.mathreg, (match, src) => {
          src = src.replace(/\s+/g, "%20");
          return `<img src="http://latex.codecogs.com/svg.latex?${src}">`
        })
      }
    }
  };
</script>
<style>
  .md-body {
    overflow-y: auto;
    height: 400pt;
  }
</style>
