// Composables
import { createRouter, createWebHistory } from "vue-router";
import ViewReadMRZ from "../views/ViewReadMRZ.vue";
import ViewSavedData from "../views/ViewSavedData.vue";

const routes = [
  {
    path: "/",
    component: ViewReadMRZ,
  },
  {
    path: "/saved",
    component: ViewSavedData,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
