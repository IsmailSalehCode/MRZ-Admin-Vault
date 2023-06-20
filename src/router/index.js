// Composables
import { createRouter, createWebHistory } from "vue-router";
import ReadAddMRZ from "../views/ReadAddMRZ.vue";
import ReadDeleteEditSavedData from "../views/ReadDeleteEditSavedData.vue";

const routes = [
  {
    path: "/",
    component: ReadAddMRZ,
  },
  {
    path: "/saved",
    component: ReadDeleteEditSavedData,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
