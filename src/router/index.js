// Composables
import { createRouter, createWebHistory } from "vue-router";
import ViewReadMRZ from "../views/ViewReadMRZ.vue";
const routes = [
  {
    path: "/",
    component: ViewReadMRZ,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
