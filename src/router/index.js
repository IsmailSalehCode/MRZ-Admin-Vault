// Composables
import { createRouter, createWebHistory } from "vue-router";
import ViewReadAddMRZ from "../views/ViewReadAddMRZ.vue";
import ViewSavedData from "../views/ViewSavedData.vue";

const routes = [
  {
    path: "/",
    component: ViewReadAddMRZ,
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
