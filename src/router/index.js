import { createRouter, createWebHistory } from "vue-router";
import View_CreateDoc from "../views/View_CreateDoc.vue";
import View_SavedDocs from "../views/View_SavedDocs.vue";
import View_Contact from "../views/View_Contact.vue";

const routes = [
  {
    path: "/",
    component: View_CreateDoc,
  },
  {
    path: "/saved",
    component: View_SavedDocs,
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
