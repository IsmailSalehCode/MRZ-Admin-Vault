// Composables
import { createRouter, createWebHistory } from "vue-router";
import Page_ReadAddMRZ from "../views/Page_ReadAddMRZ.vue";
import Page_ReadDeleteEditSavedData from "../views/Page_ReadDeleteEditSavedData.vue";
import Page_Contact from "../views/Page_Contact.vue";

const routes = [
  {
    path: "/",
    component: Page_ReadAddMRZ,
  },
  {
    path: "/saved",
    component: Page_ReadDeleteEditSavedData,
  },
  {
    path: "/contact",
    component: Page_Contact,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
