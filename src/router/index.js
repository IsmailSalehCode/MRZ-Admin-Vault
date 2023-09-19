import { createRouter, createWebHistory } from "vue-router";
import View_ReadAddMRZ from "../views/View_ReadAddMRZ.vue";
import View_ReadDeleteEditSavedData from "../views/View_ReadDeleteEditSavedData.vue";
import View_Contact from "../views/View_Contact.vue";

const routes = [
  {
    path: "/",
    component: View_ReadAddMRZ,
  },
  {
    path: "/saved",
    component: View_ReadDeleteEditSavedData,
  },
  {
    path: "/contact",
    component: View_Contact,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
