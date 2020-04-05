import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
import Dashboard from "@/pages/Dashboard.vue";
import Icons from "@/pages/Icons.vue";
import Maps from "@/pages/Maps.vue";
import Typography from "@/pages/Typography.vue";
import Resources from "@/pages/Resources";
import Info from "@/pages/Info";
import LearnEpi from "@/pages/LearnEpi";
import WuhanLockdown from "@/pages/WuhanLockdown";
import SerialInterval from "@/pages/SerialInterval";
import Modelling from "@/pages/Modelling";


const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard
      },
      {
        path: "wuhanlockdown",
        name: "wuhanlockdown",
        component: WuhanLockdown
      },
      {
        path: "serial",
        name: "serial",
        component: SerialInterval
      },
      {
        path: "modelling",
        name: "modelling",
        component: Modelling
      },
      {
        path: "resources",
        name: "resources",
        component: Resources
      },
      {
        path: "info",
        name: "info",
        component: Info
      },
      {
        path: "learn",
        name: "learn",
        component: LearnEpi
      },
      {
        path: "maps",
        name: "maps",
        component: Maps
      },
      {
        path: "icons",
        name: "icons",
        component: Icons
      },
      {
        path: "maps",
        name: "maps",
        component: Maps
      },
      {
        path: "typography",
        name: "typography",
        component: Typography
      }
    ]
  },
  { path: "*", component: NotFound }
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
