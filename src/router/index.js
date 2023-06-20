// Composables
import { createRouter, createWebHistory } from "vue-router";
import ReadAddMRZ from "../views/ReadAddMRZ.vue";
import ViewSavedData from "../views/ViewSavedData.vue";

const routes = [
  {
    path: "/",
    component: ReadAddMRZ,
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
