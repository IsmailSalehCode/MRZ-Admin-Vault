<template>
  <v-app>
    <AppBar />

    <v-main>
      <router-view></router-view>
    </v-main>

    <AppFooter />
  </v-app>
</template>

<script>
import AppBar from "./components/AppBar.vue";
import AppFooter from "./components/AppFooter.vue";

export default {
  components: { AppBar, AppFooter },
};
</script>

<style>
.v-application {
  font-family: sans-serif, Times !important;
}
</style>
