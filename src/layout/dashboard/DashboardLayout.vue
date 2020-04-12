<template>
  <div class="wrapper">
    <side-bar title="EpiSkylines">
      <template slot="links">
        <sidebar-link to="/dashboard" name="Dashboard" icon="ti-panel"/>
        <sidebar-link to="/serial" :name="$t('pages.covid19_tw')" icon="ti-pulse"/>
        <sidebar-link to="/wuhanlockdown" :name="$t('pages.wuhan')" icon="ti-archive"/>
        <sidebar-link to="/learn" :name="$t('pages.learn')" icon="ti-key"/>
        <sidebar-link to="/modelling" :name="$t('pages.model')" icon="ti-stats-up"/>
        <sidebar-link to="/resources" :name="$t('pages.resource')" icon="ti-view-list-alt"/>
        <sidebar-link to="/info" :name="$t('pages.about')" icon="ti-user"/>
        <!--<sidebar-link to="/icons" name="Icons" icon="ti-view-list-alt"/>-->
      </template>
      <mobile-menu>
        <li class="nav-item">
          <a class="nav-link">
            <i class="ti-panel"></i>
            <p>Stats</p>
          </a>
        </li>
        <drop-down class="nav-item"
                   title="Language"
                   title-classes="nav-link"
                   icon="ti-bell">
          <a class="dropdown-item">En</a>
          <a class="dropdown-item">Ch</a>
        </drop-down>
        <li class="nav-item">
          <a class="nav-link">
            <i class="ti-settings"></i>
            <p>Settings</p>
          </a>
        </li>
        <li class="divider"></li>
      </mobile-menu>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar">

      </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu";
export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    MobileMenu
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    }
  }
};
</script>
