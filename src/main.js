/*!

 =========================================================
 * Vue Paper Dashboard - v2.0.0
 =========================================================

 * Product Page: http://www.creative-tim.com/product/paper-dashboard
 * Copyright 2019 Creative Tim (http://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard/blob/master/LICENSE.md)

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 */
import Vue from "vue";
import App from "./App";
import router from "./router/index";

import PaperDashboard from "./plugins/paperDashboard";
import BootstrapVue from "bootstrap-vue";
import "vue-notifyjs/themes/default.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import VueSimpleMarkdown from "vue-simple-markdown";
import "vue-simple-markdown/dist/vue-simple-markdown.css"

Vue.use(VueSimpleMarkdown);
Vue.use(PaperDashboard);
Vue.use(BootstrapVue);

import VueI18n from "vue-i18n";
import zh_TW from "./lang/zh_TW.json";
import en_UK from "./lang/en_UK.json";
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: "en_UK",
  messages: { zh_TW, en_UK }
});

/* eslint-disable no-new */
new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount("#app");
